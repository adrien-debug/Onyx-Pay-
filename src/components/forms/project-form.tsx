"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    description?: string | null;
    targetDate?: Date | null;
    status: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      targetDate: formData.get("targetDate") as string,
      status: formData.get("status") as string,
    };

    try {
      if (project) {
        // Update via API
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          onSuccess?.();
        } else {
          const error = await res.json();
          setError(error.error || "Une erreur est survenue");
        }
      } else {
        // Create via API
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          onSuccess?.();
        } else {
          const error = await res.json();
          setError(error.error || "Une erreur est survenue");
        }
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom du projet *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          placeholder="Ex: ONYX Dubai Launch"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Description du projet..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetDate">Date cible</Label>
          <Input
            id="targetDate"
            name="targetDate"
            type="date"
            defaultValue={
              project?.targetDate
                ? new Date(project.targetDate).toISOString().split("T")[0]
                : ""
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            id="status"
            name="status"
            defaultValue={project?.status || "TODO"}
          >
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="BLOCKED">Bloqué</option>
            <option value="DONE">Terminé</option>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Enregistrement..." : project ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
