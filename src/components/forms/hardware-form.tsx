"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createHardwareCandidate, updateHardwareCandidate, deleteHardwareCandidate } from "@/lib/actions/hardware";
import { Loader2, Trash2 } from "lucide-react";

interface HardwareFormProps {
  isOpen: boolean;
  onClose: () => void;
  hardware?: {
    id: string;
    name: string;
    brand: string | null;
    model: string | null;
    price: number | null;
    currency: string;
    availability: string | null;
    specs: string | null;
    constraints: string | null;
    fieldNotes: string | null;
    score: number | null;
    recommendation: string | null;
    status: string;
  } | null;
}

export function HardwareForm({ isOpen, onClose, hardware }: HardwareFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!hardware;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && hardware) {
        await updateHardwareCandidate(hardware.id, formData);
      } else {
        await createHardwareCandidate(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving hardware:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!hardware || !confirm("Supprimer ce device ?")) return;
    setIsDeleting(true);
    try {
      await deleteHardwareCandidate(hardware.id);
      onClose();
    } catch (error) {
      console.error("Error deleting hardware:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le device" : "Nouveau device candidat"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={hardware?.name || ""}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand">Marque</Label>
            <Input
              id="brand"
              name="brand"
              defaultValue={hardware?.brand || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model">Modèle</Label>
            <Input
              id="model"
              name="model"
              defaultValue={hardware?.model || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="price">Prix ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={hardware?.price || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="availability">Disponibilité</Label>
            <Input
              id="availability"
              name="availability"
              defaultValue={hardware?.availability || ""}
              placeholder="Disponible, 4-6 semaines..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="score">Score (1-10)</Label>
            <Input
              id="score"
              name="score"
              type="number"
              min="1"
              max="10"
              defaultValue={hardware?.score || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specs">Spécifications (JSON)</Label>
          <Textarea
            id="specs"
            name="specs"
            defaultValue={hardware?.specs || ""}
            placeholder='{"cpu": "...", "ram": "...", "storage": "..."}'
            className="mt-1 font-mono text-sm"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="constraints">Contraintes (JSON)</Label>
          <Textarea
            id="constraints"
            name="constraints"
            defaultValue={hardware?.constraints || ""}
            placeholder='{"maxTemp": "45°C", "waterResistance": "IP68"}'
            className="mt-1 font-mono text-sm"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="fieldNotes">Notes terrain</Label>
          <Textarea
            id="fieldNotes"
            name="fieldNotes"
            defaultValue={hardware?.fieldNotes || ""}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recommendation">Recommandation</Label>
            <Select
              id="recommendation"
              name="recommendation"
              defaultValue={hardware?.recommendation || ""}
              className="mt-1"
            >
              <option value="">En évaluation</option>
              <option value="PRIMARY">Primaire</option>
              <option value="BACKUP">Backup</option>
              <option value="REJECTED">Rejeté</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              id="status"
              name="status"
              defaultValue={hardware?.status || "TODO"}
              className="mt-1"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">À évaluer</option>
              <option value="IN_PROGRESS">En test</option>
              <option value="DONE">Validé</option>
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
