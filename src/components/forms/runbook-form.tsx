"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createRunbook, updateRunbook, deleteRunbook } from "@/lib/actions/runbooks";
import { Loader2, Trash2 } from "lucide-react";

interface RunbookFormProps {
  isOpen: boolean;
  onClose: () => void;
  runbook?: {
    id: string;
    title: string;
    type: string;
    content: string;
    checklist: string | null;
    version: string;
    isActive: boolean;
  } | null;
}

export function RunbookForm({ isOpen, onClose, runbook }: RunbookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!runbook;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && runbook) {
        await updateRunbook(runbook.id, formData);
      } else {
        await createRunbook(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving runbook:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!runbook || !confirm("Supprimer ce runbook ?")) return;
    setIsDeleting(true);
    try {
      await deleteRunbook(runbook.id);
      onClose();
    } catch (error) {
      console.error("Error deleting runbook:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le runbook" : "Nouveau runbook"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={runbook?.title || ""}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              id="type"
              name="type"
              defaultValue={runbook?.type || ""}
              required
              className="mt-1"
            >
              <option value="">Sélectionner...</option>
              <option value="venue_launch">Venue Launch</option>
              <option value="incident">Incident Guide</option>
              <option value="onboarding">Onboarding Script</option>
              <option value="maintenance">Maintenance</option>
              <option value="escalation">Escalation</option>
              <option value="other">Autre</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="content">Contenu (Markdown)</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={runbook?.content || ""}
            className="mt-1 font-mono text-sm"
            rows={10}
            placeholder="## Section 1&#10;- Item 1&#10;- Item 2&#10;&#10;## Section 2&#10;..."
          />
        </div>

        <div>
          <Label htmlFor="checklist">Checklist (JSON)</Label>
          <Textarea
            id="checklist"
            name="checklist"
            defaultValue={runbook?.checklist || ""}
            className="mt-1 font-mono text-sm"
            rows={5}
            placeholder='[{"name": "Section", "items": ["Item 1", "Item 2"]}]'
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              name="version"
              defaultValue={runbook?.version || "1.0"}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked={runbook?.isActive ?? true}
                className="rounded border-zinc-700"
              />
              <Label htmlFor="isActive">Runbook actif</Label>
            </div>
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
