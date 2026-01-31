"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createTask, updateTask, deleteTask } from "@/lib/actions/tasks";
import { Loader2, Trash2 } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    workstreamId: string | null;
    assigneeId: string | null;
  } | null;
  projectId: string;
  workstreams: { id: string; name: string }[];
  users: { id: string; name: string | null }[];
}

export function TaskForm({
  isOpen,
  onClose,
  task,
  projectId,
  workstreams,
  users,
}: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!task;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && task) {
        await updateTask(task.id, formData);
      } else {
        formData.set("projectId", projectId);
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!task || !confirm("Supprimer cette tâche ?")) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier la tâche" : "Nouvelle tâche"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={task?.title || ""}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={task?.description || ""}
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              id="status"
              name="status"
              defaultValue={task?.status || "BACKLOG"}
              className="mt-1"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="BLOCKED">Bloqué</option>
              <option value="DONE">Terminé</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select
              id="priority"
              name="priority"
              defaultValue={task?.priority || "MEDIUM"}
              className="mt-1"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="CRITICAL">Critique</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueDate">Échéance</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={
                task?.dueDate
                  ? new Date(task.dueDate).toISOString().split("T")[0]
                  : ""
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="workstreamId">Workstream</Label>
            <Select
              id="workstreamId"
              name="workstreamId"
              defaultValue={task?.workstreamId || ""}
              className="mt-1"
            >
              <option value="">Aucun</option>
              {workstreams.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="assigneeId">Assigné à</Label>
          <Select
            id="assigneeId"
            name="assigneeId"
            defaultValue={task?.assigneeId || ""}
            className="mt-1"
          >
            <option value="">Non assigné</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-between pt-4 border-t border-zinc-800">
          {isEditing ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Supprimer
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? "Sauvegarder" : "Créer"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
