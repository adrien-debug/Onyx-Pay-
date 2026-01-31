"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createLegalDoc, updateLegalDoc, deleteLegalDoc } from "@/lib/actions/legal";
import { Loader2, Trash2 } from "lucide-react";

interface LegalFormProps {
  isOpen: boolean;
  onClose: () => void;
  doc?: {
    id: string;
    title: string;
    type: string;
    status: string;
    version: string;
    content: string | null;
    fileUrl: string | null;
    notes: string | null;
  } | null;
}

export function LegalForm({ isOpen, onClose, doc }: LegalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!doc;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && doc) {
        await updateLegalDoc(doc.id, formData);
      } else {
        await createLegalDoc(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving legal doc:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!doc || !confirm("Supprimer ce document ?")) return;
    setIsDeleting(true);
    try {
      await deleteLegalDoc(doc.id);
      onClose();
    } catch (error) {
      console.error("Error deleting legal doc:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le document" : "Nouveau document légal"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={doc?.title || ""}
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              id="type"
              name="type"
              defaultValue={doc?.type || ""}
              required
              className="mt-1"
            >
              <option value="">Sélectionner...</option>
              <option value="MSA">MSA (Master Service Agreement)</option>
              <option value="SLA">SLA (Service Level Agreement)</option>
              <option value="DPA">DPA (Data Processing Agreement)</option>
              <option value="Terms">Terms of Service</option>
              <option value="Privacy">Privacy Policy</option>
              <option value="Disclaimer">Disclaimer</option>
              <option value="NDA">NDA</option>
              <option value="Other">Autre</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              id="status"
              name="status"
              defaultValue={doc?.status || "DRAFT"}
              className="mt-1"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="IN_REVIEW">En revue</option>
              <option value="APPROVED">Approuvé</option>
              <option value="SENT">Envoyé</option>
              <option value="SIGNED">Signé</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              name="version"
              defaultValue={doc?.version || "1.0"}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fileUrl">URL du fichier</Label>
            <Input
              id="fileUrl"
              name="fileUrl"
              type="url"
              defaultValue={doc?.fileUrl || ""}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Contenu / Résumé</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={doc?.content || ""}
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes internes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={doc?.notes || ""}
            className="mt-1"
            rows={2}
          />
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
