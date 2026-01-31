"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { getRoleColor } from "@/lib/utils";
import {
  updateProfile,
  changePassword,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/actions/settings";
import {
  User,
  Shield,
  Bell,
  Database,
  Users,
  Key,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface SettingsClientProps {
  currentUser: UserData | null;
  allUsers: UserData[];
  isAdmin: boolean;
}

export function SettingsClient({ currentUser, allUsers, isAdmin }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Notifications state (UI only for now)
  const [notifications, setNotifications] = useState({
    email: true,
    taskAssigned: true,
    deadline: true,
  });

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: result.message || "Profil mis à jour" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Erreur" });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);

    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: result.message || "Mot de passe modifié" });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.error || "Erreur" });
    }
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    let result;
    if (editingUser) {
      result = await updateUser(editingUser.id, formData);
    } else {
      result = await createUser(formData);
    }

    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: result.message || "Succès" });
      setShowUserModal(false);
      setEditingUser(null);
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Erreur" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    const result = await deleteUser(userId);
    setLoading(false);
    setShowDeleteConfirm(null);

    if (result.success) {
      setMessage({ type: "success", text: "Utilisateur supprimé" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Erreur" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Message toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-500/20 border border-green-500 text-green-400"
              : "bg-red-500/20 border border-red-500 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
                <Avatar fallback={currentUser?.name || "U"} size="lg" />
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
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={currentUser?.name || ""}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={currentUser?.email || ""} disabled className="mt-1" />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </form>
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
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="mt-1"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="mt-1"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" variant="outline" disabled={loading}>
                {loading ? "Modification..." : "Changer le mot de passe"}
              </Button>
            </form>
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
                  <p className="text-sm text-zinc-400">Recevoir des notifications par email</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotifications((n) => ({ ...n, email: !n.email }))}
                >
                  {notifications.email ? "Activé" : "Désactivé"}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div>
                  <p className="font-medium text-zinc-200">Tâches assignées</p>
                  <p className="text-sm text-zinc-400">
                    Notification quand une tâche m&apos;est assignée
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotifications((n) => ({ ...n, taskAssigned: !n.taskAssigned }))}
                >
                  {notifications.taskAssigned ? "Activé" : "Désactivé"}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div>
                  <p className="font-medium text-zinc-200">Deadline approaching</p>
                  <p className="text-sm text-zinc-400">Rappel 24h avant échéance</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotifications((n) => ({ ...n, deadline: !n.deadline }))}
                >
                  {notifications.deadline ? "Activé" : "Désactivé"}
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
                {currentUser?.role === "OPS" && <p>Accès aux runbooks, hardware et tâches</p>}
                {currentUser?.role === "LEGAL" && <p>Gestion des documents légaux</p>}
                {currentUser?.role === "SALES" && <p>Accès au pricing et aux propositions</p>}
                {currentUser?.role === "VIEWER" && <p>Lecture seule</p>}
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
                <Badge variant="default">
                  {process.env.NODE_ENV === "production" ? "Production" : "Development"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Database</span>
                <span className="text-zinc-200">PostgreSQL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin: Users management */}
        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-copper-400" />
                Utilisateurs
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="default">{allUsers.length}</Badge>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingUser(null);
                    setShowUserModal(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded bg-zinc-800/50 group"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar fallback={user.name || "?"} size="sm" />
                      <div>
                        <p className="text-sm text-zinc-200">{user.name}</p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] ${getRoleColor(user.role)}`}>{user.role}</Badge>
                      <div className="hidden group-hover:flex gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-1 text-zinc-400 hover:text-copper-400"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="p-1 text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              name="email"
              type="email"
              defaultValue={editingUser?.email || ""}
              disabled={!!editingUser}
              required={!editingUser}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="userName">Nom</Label>
            <Input
              id="userName"
              name="name"
              defaultValue={editingUser?.name || ""}
              required
              className="mt-1"
            />
          </div>
          {!editingUser && (
            <div>
              <Label htmlFor="userPassword">Mot de passe</Label>
              <Input
                id="userPassword"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1"
              />
            </div>
          )}
          <div>
            <Label htmlFor="userRole">Rôle</Label>
            <Select
              id="userRole"
              name="role"
              defaultValue={editingUser?.role || "VIEWER"}
              className="mt-1"
            >
              <option value="ADMIN">Admin</option>
              <option value="PM">Project Manager</option>
              <option value="OPS">Operations</option>
              <option value="LEGAL">Legal</option>
              <option value="SALES">Sales</option>
              <option value="VIEWER">Viewer</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUserModal(false);
                setEditingUser(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "..." : editingUser ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmer la suppression"
      >
        <p className="text-zinc-400 mb-6">
          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => showDeleteConfirm && handleDeleteUser(showDeleteConfirm)}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
