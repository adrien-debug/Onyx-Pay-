"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createRisk, updateRisk, deleteRisk } from "@/lib/actions/risks";
import { Loader2, Trash2 } from "lucide-react";

interface RiskFormProps {
  isOpen: boolean;
  onClose: () => void;
  risk?: {
    id: string;
    title: string;
    description: string | null;
    probability: number;
    impact: number;
    mitigation: string | null;
    status: string;
    workstreamId: string | null;
    ownerId: string | null;
  } | null;
  projectId: string;
  workstreams: { id: string; name: string }[];
  users: { id: string; name: string | null }[];
}

export function RiskForm({
  isOpen,
  onClose,
  risk,
  projectId,
  workstreams,
  users,
}: RiskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!risk;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && risk) {
        await updateRisk(risk.id, formData);
      } else {
        formData.set("projectId", projectId);
        await createRisk(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving risk:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!risk || !confirm("Supprimer ce risque ?")) return;
    setIsDeleting(true);
    try {
      await deleteRisk(risk.id);
      onClose();
    } catch (error) {
      console.error("Error deleting risk:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le risque" : "Nouveau risque"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={risk?.title || ""}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={risk?.description || ""}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="probability">Probabilité (1-5)</Label>
            <Select
              id="probability"
              name="probability"
              defaultValue={risk?.probability?.toString() || "3"}
              className="mt-1"
            >
              <option value="1">1 - Très faible</option>
              <option value="2">2 - Faible</option>
              <option value="3">3 - Moyen</option>
              <option value="4">4 - Élevé</option>
              <option value="5">5 - Très élevé</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="impact">Impact (1-5)</Label>
            <Select
              id="impact"
              name="impact"
              defaultValue={risk?.impact?.toString() || "3"}
              className="mt-1"
            >
              <option value="1">1 - Négligeable</option>
              <option value="2">2 - Mineur</option>
              <option value="3">3 - Modéré</option>
              <option value="4">4 - Majeur</option>
              <option value="5">5 - Critique</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              id="status"
              name="status"
              defaultValue={risk?.status || "TODO"}
              className="mt-1"
            >
              <option value="BACKLOG">Identifié</option>
              <option value="TODO">À traiter</option>
              <option value="IN_PROGRESS">En mitigation</option>
              <option value="DONE">Mitigé</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="mitigation">Plan de mitigation</Label>
          <Textarea
            id="mitigation"
            name="mitigation"
            defaultValue={risk?.mitigation || ""}
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workstreamId">Workstream</Label>
            <Select
              id="workstreamId"
              name="workstreamId"
              defaultValue={risk?.workstreamId || ""}
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
          <div>
            <Label htmlFor="ownerId">Responsable</Label>
            <Select
              id="ownerId"
              name="ownerId"
              defaultValue={risk?.ownerId || ""}
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
