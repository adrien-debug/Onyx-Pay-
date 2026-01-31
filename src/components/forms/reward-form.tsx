"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createRewardRule, updateRewardRule, deleteRewardRule } from "@/lib/actions/rewards";
import { Loader2, Trash2 } from "lucide-react";

interface RewardFormProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    formula: string | null;
    minThreshold: number | null;
    maxThreshold: number | null;
    capPerDay: number | null;
    capPerMonth: number | null;
    conditions: string | null;
    isActive: boolean;
    testPeriod: string | null;
    testLocation: string | null;
  } | null;
}

export function RewardForm({ isOpen, onClose, rule }: RewardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!rule;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && rule) {
        await updateRewardRule(rule.id, formData);
      } else {
        await createRewardRule(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving reward rule:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!rule || !confirm("Supprimer cette règle ?")) return;
    setIsDeleting(true);
    try {
      await deleteRewardRule(rule.id);
      onClose();
    } catch (error) {
      console.error("Error deleting reward rule:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier la règle" : "Nouvelle règle de reward"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={rule?.name || ""}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              id="type"
              name="type"
              defaultValue={rule?.type || ""}
              required
              className="mt-1"
            >
              <option value="">Sélectionner...</option>
              <option value="PER_TX">Per Transaction</option>
              <option value="PER_VOLUME">Per Volume</option>
              <option value="ADOPTION">Adoption</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={rule?.description || ""}
            className="mt-1"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="formula">Formule</Label>
          <Input
            id="formula"
            name="formula"
            defaultValue={rule?.formula || ""}
            placeholder="$0.50 par transaction, 0.1% du volume..."
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minThreshold">Seuil minimum ($)</Label>
            <Input
              id="minThreshold"
              name="minThreshold"
              type="number"
              step="0.01"
              defaultValue={rule?.minThreshold || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxThreshold">Seuil maximum ($)</Label>
            <Input
              id="maxThreshold"
              name="maxThreshold"
              type="number"
              step="0.01"
              defaultValue={rule?.maxThreshold || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capPerDay">Cap par jour ($)</Label>
            <Input
              id="capPerDay"
              name="capPerDay"
              type="number"
              step="0.01"
              defaultValue={rule?.capPerDay || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="capPerMonth">Cap par mois ($)</Label>
            <Input
              id="capPerMonth"
              name="capPerMonth"
              type="number"
              step="0.01"
              defaultValue={rule?.capPerMonth || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="conditions">Conditions / Anti-abus</Label>
          <Textarea
            id="conditions"
            name="conditions"
            defaultValue={rule?.conditions || ""}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="testPeriod">Période de test</Label>
            <Input
              id="testPeriod"
              name="testPeriod"
              defaultValue={rule?.testPeriod || ""}
              placeholder="2025-09-01 to 2025-09-15"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="testLocation">Lieu de test</Label>
            <Input
              id="testLocation"
              name="testLocation"
              defaultValue={rule?.testLocation || ""}
              placeholder="Dubai - venues pilotes"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            value="true"
            defaultChecked={rule?.isActive ?? true}
            className="rounded border-zinc-700"
          />
          <Label htmlFor="isActive">Règle active</Label>
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
