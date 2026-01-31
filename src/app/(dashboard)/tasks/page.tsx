import { Suspense } from "react";
import { db } from "@/lib/db";
import { TasksClient } from "./tasks-client";

async function getTasks() {
  const tasks = await db.task.findMany({
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    include: {
      assignee: true,
      workstream: true,
      project: true,
      checklist: true,
      _count: {
        select: { comments: true, attachments: true },
      },
    },
  });

  const workstreams = await db.workstream.findMany({
    orderBy: { name: "asc" },
  });

  const users = await db.user.findMany({
    orderBy: { name: "asc" },
  });

  const project = await db.project.findFirst();

  return { tasks, workstreams, users, projectId: project?.id || "" };
}

async function TasksContent() {
  const { tasks, workstreams, users, projectId } = await getTasks();

  return (
    <TasksClient
      tasks={tasks}
      workstreams={workstreams}
      users={users}
      projectId={projectId}
    />
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="h-96 bg-zinc-800 rounded-xl shimmer" />
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
