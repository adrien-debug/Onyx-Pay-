"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/ui/modal";
import { ProjectForm } from "@/components/forms/project-form";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  FolderKanban,
  Calendar,
  Users,
  CheckSquare,
  ArrowRight,
  Target,
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
    _count: { tasks: number };
  }>;
  tasks: Array<{ status: string }>;
  milestones: Array<{ id: string; completedAt: Date | null }>;
};

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadProjects();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
        <div className="h-64 bg-zinc-800 rounded-xl shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Projets et workstreams ONYX"
        action={{ label: "Nouveau projet", onClick: () => setIsModalOpen(true) }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau projet"
        description="Créer un nouveau projet ONYX"
      >
        <ProjectForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* Projects list */}
      <div className="space-y-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              Aucun projet. Créez votre premier projet pour commencer.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const totalTasks = project.tasks.length;
            const doneTasks = project.tasks.filter(
              (t) => t.status === "DONE"
            ).length;
            const progress =
              totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            const totalMilestones = project.milestones.length;
            const completedMilestones = project.milestones.filter(
              (m) => m.completedAt
            ).length;

            return (
              <Card key={project.id} className="overflow-hidden card-hover">
                <CardHeader className="bg-gradient-to-r from-copper-900/20 to-transparent border-b border-zinc-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-copper-500 to-brown-600 flex items-center justify-center">
                        <FolderKanban className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        {project.description && (
                          <p className="text-sm text-zinc-400 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace("_", " ")}
                      </Badge>
                      {project.targetDate && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Calendar className="h-4 w-4" />
                          {formatDate(project.targetDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-400">Progression</span>
                      <span className="text-sm font-medium text-copper-400">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <CheckSquare className="h-4 w-4" />
                        <span className="text-xs">Tâches</span>
                      </div>
                      <p className="text-lg font-semibold text-zinc-200">
                        {doneTasks}/{totalTasks}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Target className="h-4 w-4" />
                        <span className="text-xs">Jalons</span>
                      </div>
                      <p className="text-lg font-semibold text-zinc-200">
                        {completedMilestones}/{totalMilestones}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <FolderKanban className="h-4 w-4" />
                        <span className="text-xs">Workstreams</span>
                      </div>
                      <p className="text-lg font-semibold text-zinc-200">
                        {project.workstreams.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Équipe</span>
                      </div>
                      <p className="text-lg font-semibold text-zinc-200">-</p>
                    </div>
                  </div>

                  {/* Workstreams */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">
                      Workstreams
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.workstreams.map((ws) => (
                        <Badge key={ws.id} variant="default">
                          {ws.name}
                          <span className="ml-1 text-zinc-500">
                            ({ws._count.tasks})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Voir le projet
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href={`/projects/${project.id}/roadmap`}>
                      <Button variant="ghost">
                        <Calendar className="h-4 w-4 mr-2" />
                        Roadmap
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
