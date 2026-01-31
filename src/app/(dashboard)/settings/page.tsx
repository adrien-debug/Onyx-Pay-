import { Suspense } from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { getRoleColor } from "@/lib/utils";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Users,
  Key,
} from "lucide-react";

async function getSettingsData() {
  const session = await getSession();
  
  let currentUser = null;
  let allUsers: Awaited<ReturnType<typeof db.user.findMany>> = [];
  
  if (session?.user?.id) {
    currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    });
    
    // Only admins can see all users
    if (session.user.role === "ADMIN") {
      allUsers = await db.user.findMany({
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-copper-400" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
                <Avatar
                  fallback={currentUser?.name || "U"}
                  size="lg"
                />
                <div>
                  <h3 className="text-lg font-medium text-zinc-200">
                    {currentUser?.name || "Utilisateur"}
                  </h3>
                  <p className="text-sm text-zinc-400">{currentUser?.email}</p>
                  <Badge className={`mt-1 ${getRoleColor(currentUser?.role || "VIEWER")}`}>
                    {currentUser?.role || "VIEWER"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom</Label>
                  <Input
                    defaultValue={currentUser?.name || ""}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    defaultValue={currentUser?.email || ""}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>

              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-copper-400" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mot de passe actuel</Label>
                <Input type="password" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label>Confirmer</Label>
                  <Input type="password" className="mt-1" />
                </div>
              </div>
              <Button variant="outline">Changer le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-copper-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <div>
                    <p className="font-medium text-zinc-200">Email notifications</p>
                    <p className="text-sm text-zinc-400">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <div>
                    <p className="font-medium text-zinc-200">Tâches assignées</p>
                    <p className="text-sm text-zinc-400">
                      Notification quand une tâche m&apos;est assignée
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <div>
                    <p className="font-medium text-zinc-200">Deadline approaching</p>
                    <p className="text-sm text-zinc-400">
                      Rappel 24h avant échéance
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Role info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-copper-400" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50">
                  <span className="text-zinc-400">Rôle</span>
                  <Badge className={getRoleColor(currentUser?.role || "VIEWER")}>
                    {currentUser?.role || "VIEWER"}
                  </Badge>
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  {currentUser?.role === "ADMIN" && (
                    <p>Accès complet à toutes les fonctionnalités</p>
                  )}
                  {currentUser?.role === "PM" && (
                    <p>Gestion complète des projets, tâches et équipes</p>
                  )}
                  {currentUser?.role === "OPS" && (
                    <p>Accès aux runbooks, hardware et tâches</p>
                  )}
                  {currentUser?.role === "LEGAL" && (
                    <p>Gestion des documents légaux</p>
                  )}
                  {currentUser?.role === "SALES" && (
                    <p>Accès au pricing et aux propositions</p>
                  )}
                  {currentUser?.role === "VIEWER" && (
                    <p>Lecture seule</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-copper-400" />
                Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Version</span>
                  <span className="text-zinc-200">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Environnement</span>
                  <Badge variant="default">Development</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Database</span>
                  <span className="text-zinc-200">SQLite (dev)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin: Users management */}
          {isAdmin && allUsers.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-copper-400" />
                  Utilisateurs
                </CardTitle>
                <Badge variant="default">{allUsers.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded bg-zinc-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar fallback={user.name || "?"} size="sm" />
                        <div>
                          <p className="text-sm text-zinc-200">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
