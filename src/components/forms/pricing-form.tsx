"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createPricingPlan, updatePricingPlan, deletePricingPlan } from "@/lib/actions/pricing";
import { Loader2, Trash2 } from "lucide-react";

interface PricingFormProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: {
    id: string;
    name: string;
    description: string | null;
    hardwareModel: string | null;
    setupFee: number | null;
    monthlyFee: number | null;
    transactionFee: number | null;
    feeType: string | null;
    currency: string;
    inclusions: string | null;
    slaLevel: string | null;
    supportHours: string | null;
    isActive: boolean;
  } | null;
}

export function PricingForm({ isOpen, onClose, plan }: PricingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!plan;

  // Parse inclusions from JSON string to array for textarea
  let inclusionsText = "";
  if (plan?.inclusions) {
    try {
      const arr = JSON.parse(plan.inclusions);
      inclusionsText = Array.isArray(arr) ? arr.join("\n") : "";
    } catch {
      inclusionsText = "";
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (isEditing && plan) {
        await updatePricingPlan(plan.id, formData);
      } else {
        await createPricingPlan(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving pricing plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!plan || !confirm("Supprimer ce plan ?")) return;
    setIsDeleting(true);
    try {
      await deletePricingPlan(plan.id);
      onClose();
    } catch (error) {
      console.error("Error deleting pricing plan:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier le plan" : "Nouveau plan tarifaire"}
      size="lg"
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={plan?.name || ""}
              placeholder="PILOT, PREMIUM, ENTERPRISE..."
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hardwareModel">Modèle hardware</Label>
            <Select
              id="hardwareModel"
              name="hardwareModel"
              defaultValue={plan?.hardwareModel || ""}
              className="mt-1"
            >
              <option value="">Aucun</option>
              <option value="Rental (inclus)">Rental (inclus)</option>
              <option value="Achat">Achat</option>
              <option value="Rental ou Achat">Rental ou Achat</option>
              <option value="Flexible">Flexible</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={plan?.description || ""}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="setupFee">Setup Fee ($)</Label>
            <Input
              id="setupFee"
              name="setupFee"
              type="number"
              step="0.01"
              defaultValue={plan?.setupFee || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
            <Input
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              step="0.01"
              defaultValue={plan?.monthlyFee || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="transactionFee">Transaction Fee</Label>
            <Input
              id="transactionFee"
              name="transactionFee"
              type="number"
              step="0.01"
              defaultValue={plan?.transactionFee || ""}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="feeType">Type de fee transaction</Label>
            <Select
              id="feeType"
              name="feeType"
              defaultValue={plan?.feeType || "PERCENTAGE"}
              className="mt-1"
            >
              <option value="PERCENTAGE">Pourcentage (%)</option>
              <option value="FIXED">Fixe ($)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="slaLevel">Niveau SLA</Label>
            <Select
              id="slaLevel"
              name="slaLevel"
              defaultValue={plan?.slaLevel || ""}
              className="mt-1"
            >
              <option value="">Aucun</option>
              <option value="BASIC">Basic</option>
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="supportHours">Heures de support</Label>
          <Input
            id="supportHours"
            name="supportHours"
            defaultValue={plan?.supportHours || ""}
            placeholder="9h-18h, 24/7..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="inclusions">Inclusions (une par ligne)</Label>
          <Textarea
            id="inclusions"
            name="inclusions"
            defaultValue={inclusionsText}
            placeholder="1 device ONYX&#10;Installation sur site&#10;Formation staff..."
            className="mt-1"
            rows={5}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            value="true"
            defaultChecked={plan?.isActive ?? true}
            className="rounded border-zinc-700"
          />
          <Label htmlFor="isActive">Plan actif</Label>
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
