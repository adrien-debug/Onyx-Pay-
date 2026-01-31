"use client";

import { useState } from "react";
import { TasksTable } from "./tasks-table";
import { TaskFilters } from "./task-filters";
import { TaskForm } from "@/components/forms/task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Task, User, Workstream, Project, TaskChecklistItem } from "@prisma/client";

type TaskWithRelations = Task & {
  assignee: User | null;
  workstream: Workstream | null;
  project: Project;
  checklist: TaskChecklistItem[];
  _count: {
    comments: number;
    attachments: number;
  };
};

interface TasksClientProps {
  tasks: TaskWithRelations[];
  workstreams: Workstream[];
  users: User[];
  projectId: string;
}

export function TasksClient({
  tasks,
  workstreams,
  users,
  projectId,
}: TasksClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);

  const handleEdit = (task: TaskWithRelations) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Tâches</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestion des tâches du projet ONYX Dubai Launch
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      <TaskFilters workstreams={workstreams} users={users} />

      <TasksTable tasks={tasks} onEdit={handleEdit} />

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleClose}
        task={editingTask}
        projectId={projectId}
        workstreams={workstreams}
        users={users}
      />
    </div>
  );
}
