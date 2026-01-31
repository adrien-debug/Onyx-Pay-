"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MilestoneForm } from "@/components/forms/milestone-form";
import { toggleMilestoneComplete, deleteMilestone } from "@/lib/actions/milestones";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Target,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import type { Milestone, User, Workstream, Project, MilestoneChecklistItem } from "@prisma/client";

type MilestoneWithRelations = Milestone & {
  owner: User | null;
  workstream: Workstream | null;
  project: Project;
  checklist: MilestoneChecklistItem[];
};

interface RoadmapClientProps {
  milestones: MilestoneWithRelations[];
  workstreams: Workstream[];
  users: User[];
  projectId: string;
}

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

export function RoadmapClient({
  milestones,
  workstreams,
  users,
  projectId,
}: RoadmapClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneWithRelations | null>(null);

  const handleEdit = (milestone: MilestoneWithRelations) => {
    setEditingMilestone(milestone);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingMilestone(null);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleMilestoneComplete(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce jalon ?")) return;
    await deleteMilestone(id);
  };

  const now = new Date();
  const currentWeek = getWeekNumber(now);

  const weeks: number[] = [];
  for (let i = 0; i < 12; i++) {
    weeks.push(currentWeek + i);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Roadmap</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Timeline du lancement ONYX Dubai - Septembre 2025
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau jalon
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-copper-400" />
              Timeline Septembre 2025
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-zinc-400">Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-copper-400" />
                <span className="text-zinc-400">En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-400">À venir</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-zinc-400">En retard</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto pb-4">
            <div className="min-w-[800px]">
              {/* Week headers */}
              <div className="flex border-b border-zinc-800 mb-4">
                {weeks.map((week) => (
                  <div
                    key={week}
                    className={`flex-1 p-3 text-center border-r border-zinc-800 last:border-r-0 ${
                      week === currentWeek ? "bg-copper-900/20" : ""
                    }`}
                  >
                    <span className="text-xs font-medium text-zinc-400">
                      Sem {week - currentWeek + 1}
                    </span>
                    {week === currentWeek && (
                      <Badge variant="copper" className="ml-2 text-[10px]">
                        Now
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Milestones rows */}
              <div className="relative min-h-[200px]">
                <div className="absolute inset-0 flex">
                  {weeks.map((week) => (
                    <div
                      key={week}
                      className={`flex-1 border-r border-zinc-800/50 last:border-r-0 ${
                        week === currentWeek ? "bg-copper-900/10" : ""
                      }`}
                    />
                  ))}
                </div>

                {milestones.length === 0 ? (
                  <div className="relative z-10 flex items-center justify-center h-[200px]">
                    <p className="text-zinc-500">Aucun jalon défini</p>
                  </div>
                ) : (
                  <div className="relative z-10 space-y-3 p-2">
                    {milestones.map((milestone) => {
                      const milestoneWeek = getWeekNumber(new Date(milestone.targetDate));
                      const weekIndex = milestoneWeek - currentWeek;
                      const isPast = new Date(milestone.targetDate) < now && !milestone.completedAt;
                      const isComplete = !!milestone.completedAt;
                      const isCurrent = milestoneWeek === currentWeek || (milestoneWeek === currentWeek + 1 && !isComplete);
                      const leftPercent = Math.max(0, Math.min(100, (weekIndex / 12) * 100));

                      return (
                        <div
                          key={milestone.id}
                          className={`
                            relative p-3 rounded-lg border transition-all cursor-pointer group
                            hover:scale-[1.02] hover:shadow-lg
                            ${
                              isComplete
                                ? "bg-emerald-900/20 border-emerald-800"
                                : isPast
                                ? "bg-red-900/20 border-red-800"
                                : isCurrent
                                ? "bg-copper-900/20 border-copper-800"
                                : "bg-zinc-800/50 border-zinc-700"
                            }
                          `}
                          style={{
                            marginLeft: `${leftPercent}%`,
                            maxWidth: "300px",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleToggleComplete(milestone.id)}>
                                {isComplete ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                                ) : isPast ? (
                                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                                ) : isCurrent ? (
                                  <Target className="h-4 w-4 text-copper-400 shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-zinc-500 shrink-0" />
                                )}
                              </button>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-200">
                                  {milestone.title}
                                </h4>
                                {milestone.workstream && (
                                  <span className="text-xs text-zinc-500">
                                    {milestone.workstream.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-zinc-400 whitespace-nowrap">
                                {formatDate(milestone.targetDate)}
                              </span>
                              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(milestone);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(milestone.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {milestone.owner && (
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar fallback={milestone.owner.name || "?"} size="sm" />
                              <span className="text-xs text-zinc-400">
                                {milestone.owner.name}
                              </span>
                            </div>
                          )}

                          {milestone.checklist.length > 0 && (
                            <div className="mt-2 text-xs text-zinc-500">
                              {milestone.checklist.filter((c) => c.completed).length}/
                              {milestone.checklist.length} checklist items
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones list */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les jalons</CardTitle>
        </CardHeader>
        <CardContent>
          {milestones.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Aucun jalon défini. Créez votre premier jalon.
            </p>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => {
                const isPast = new Date(milestone.targetDate) < now && !milestone.completedAt;
                const isComplete = !!milestone.completedAt;

                return (
                  <div
                    key={milestone.id}
                    className={`
                      flex items-center justify-between p-4 rounded-lg group
                      ${
                        isComplete
                          ? "bg-emerald-900/20 border border-emerald-800"
                          : isPast
                          ? "bg-red-900/20 border border-red-800"
                          : "bg-zinc-800/50 border border-zinc-700"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleComplete(milestone.id)}
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isComplete
                            ? "bg-emerald-500"
                            : isPast
                            ? "bg-red-500"
                            : "bg-zinc-700"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : isPast ? (
                          <AlertCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Target className="h-5 w-5 text-zinc-400" />
                        )}
                      </button>
                      <div>
                        <h4 className="font-medium text-zinc-200">
                          {milestone.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          {milestone.workstream && (
                            <Badge variant="default">
                              {milestone.workstream.name}
                            </Badge>
                          )}
                          {milestone.owner && (
                            <div className="flex items-center gap-1">
                              <Avatar fallback={milestone.owner.name || "?"} size="sm" />
                              <span className="text-xs text-zinc-400">
                                {milestone.owner.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-zinc-300">
                          {formatDate(milestone.targetDate)}
                        </p>
                        {milestone.checklist.length > 0 && (
                          <p className="text-xs text-zinc-500 mt-1">
                            {milestone.checklist.filter((c) => c.completed).length}/
                            {milestone.checklist.length} items
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(milestone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <MilestoneForm
        isOpen={isFormOpen}
        onClose={handleClose}
        milestone={editingMilestone}
        projectId={projectId}
        workstreams={workstreams}
        users={users}
      />
    </div>
  );
}
