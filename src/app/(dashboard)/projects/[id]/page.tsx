"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { ProjectForm } from "@/components/forms/project-form";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Edit,
  FolderKanban,
  Plus,
  Target,
  Trash2,
  Users,
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  targetDate: Date | null;
  status: string;
  workstreams: Array<{
    id: string;
    name: string;
    description: string | null;
    _count: { tasks: number };
  }>;
  tasks: Array<{ status: string }>;
  milestones: Array<{ id: string; completedAt: Date | null }>;
};

async function fetchProject(id: string): Promise<Project | null> {
  const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    const data = await fetchProject(projectId);
    setProject(data);
    setLoading(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    loadProject();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
        <div className="h-64 bg-zinc-800 rounded-xl shimmer" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100">Projet introuvable</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-zinc-500">
            Ce projet n'existe pas ou a été supprimé.
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.completedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-zinc-100">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-zinc-400">{project.description}</p>
            )}
          </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le projet"
        description="Mettre à jour les informations du projet"
      >
        <ProjectForm
          project={project}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Tâches</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {doneTasks}/{totalTasks}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-copper-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-copper-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Jalons</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {completedMilestones}/{totalMilestones}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Workstreams</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {project.workstreams.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Date cible</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {project.targetDate ? formatDate(project.targetDate) : "Non définie"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workstreams */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workstreams</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau workstream
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {project.workstreams.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              Aucun workstream. Créez-en un pour organiser les tâches.
            </div>
          ) : (
            <div className="space-y-3">
              {project.workstreams.map((ws) => (
                <div
                  key={ws.id}
                  className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-zinc-100 mb-1">{ws.name}</h4>
                      {ws.description && (
                        <p className="text-sm text-zinc-400 mb-2">{ws.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <CheckSquare className="h-4 w-4" />
                        {ws._count.tasks} tâche{ws._count.tasks !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/tasks?project=${project.id}`}>
          <Card className="card-hover cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Tâches</h3>
                  <p className="text-sm text-zinc-400">Gérer les tâches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/roadmap?project=${project.id}`}>
          <Card className="card-hover cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-copper-500 to-brown-600 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Roadmap</h3>
                  <p className="text-sm text-zinc-400">Voir les jalons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/risks?project=${project.id}`}>
          <Card className="card-hover cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Risques</h3>
                  <p className="text-sm text-zinc-400">Gérer les risques</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
