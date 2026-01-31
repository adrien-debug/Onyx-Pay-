"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createMilestone, updateMilestone, deleteMilestone } from "@/lib/actions/milestones";
import { Loader2, Trash2 } from "lucide-react";

interface MilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: {
    id: string;
    title: string;
    description: string | null;
    targetDate: Date;
    ownerId: string | null;
    workstreamId: string | null;
    completedAt: Date | null;
  } | null;
  projectId: string;
  workstreams: { id: string; name: string }[];
  users: { id: string; name: string | null }[];
}

export function MilestoneForm({
  isOpen,
  onClose,
  milestone,
  projectId,
  workstreams,
  users,
}: MilestoneFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!milestone;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && milestone) {
        await updateMilestone(milestone.id, formData);
      } else {
        formData.set("projectId", projectId);
        await createMilestone(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving milestone:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!milestone || !confirm("Supprimer ce jalon ?")) return;
    setIsDeleting(true);
    try {
      await deleteMilestone(milestone.id);
      onClose();
    } catch (error) {
      console.error("Error deleting milestone:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le jalon" : "Nouveau jalon"}
      size="md"
    >
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={milestone?.title || ""}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={milestone?.description || ""}
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetDate">Date cible *</Label>
            <Input
              id="targetDate"
              name="targetDate"
              type="date"
              defaultValue={
                milestone?.targetDate
                  ? new Date(milestone.targetDate).toISOString().split("T")[0]
                  : ""
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="workstreamId">Workstream</Label>
            <Select
              id="workstreamId"
              name="workstreamId"
              defaultValue={milestone?.workstreamId || ""}
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
          <Label htmlFor="ownerId">Responsable</Label>
          <Select
            id="ownerId"
            name="ownerId"
            defaultValue={milestone?.ownerId || ""}
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

        {isEditing && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              value="true"
              defaultChecked={!!milestone?.completedAt}
              className="rounded border-zinc-700"
            />
            <Label htmlFor="completed">Marquer comme terminé</Label>
          </div>
        )}

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
