"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

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
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!project;

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
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm("Supprimer ce projet ? Toutes les tâches, jalons et risques associés seront également supprimés.")) return;
    
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onSuccess?.();
      } else {
        const error = await res.json();
        setError(error.error || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
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

      <div className="flex justify-between pt-4 border-t border-zinc-800">
        {isEditing ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? "Sauvegarder" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
