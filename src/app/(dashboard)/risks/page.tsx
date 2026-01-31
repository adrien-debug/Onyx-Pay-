import { Suspense } from "react";
import { db } from "@/lib/db";
import { RisksClient } from "./risks-client";

async function getRisks() {
  const risks = await db.risk.findMany({
    include: {
      owner: true,
      workstream: true,
      project: true,
    },
    orderBy: [{ impact: "desc" }, { probability: "desc" }],
  });

  const workstreams = await db.workstream.findMany({
    orderBy: { name: "asc" },
  });

  const users = await db.user.findMany({
    orderBy: { name: "asc" },
  });

  const project = await db.project.findFirst();

  return { risks, workstreams, users, projectId: project?.id || "" };
}

async function RisksContent() {
  const { risks, workstreams, users, projectId } = await getRisks();

  return (
    <RisksClient
      risks={risks}
      workstreams={workstreams}
      users={users}
      projectId={projectId}
    />
  );
}

export default function RisksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      }
    >
      <RisksContent />
    </Suspense>
  );
}
