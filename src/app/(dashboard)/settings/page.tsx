import { Suspense } from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsClient } from "./settings-client";

async function getSettingsData() {
  const session = await getSession();
  
  let currentUser = null;
  let allUsers: { id: string; email: string; name: string | null; role: string }[] = [];
  
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    currentUser = user;
    
    // Only admins can see all users
    if (session.user.role === "ADMIN") {
      allUsers = await db.user.findMany({
        select: { id: true, email: true, name: true, role: true },
        orderBy: { name: "asc" },
      });
    }
  }

  return { currentUser, allUsers, isAdmin: session?.user?.role === "ADMIN" };
}

async function SettingsContent() {
  const { currentUser, allUsers, isAdmin } = await getSettingsData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configuration du profil et de l'application"
      />
      <SettingsClient
        currentUser={currentUser}
        allUsers={allUsers}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-96 bg-zinc-800 rounded-xl shimmer" />
            <div className="h-96 bg-zinc-800 rounded-xl shimmer" />
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
