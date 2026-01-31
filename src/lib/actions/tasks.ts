"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  status: z.string().default("BACKLOG"),
  priority: z.string().default("MEDIUM"),
  dueDate: z.string().optional(),
  workstreamId: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string(),
  tags: z.array(z.string()).optional(),
});

export async function createTask(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    status: formData.get("status") as string || "BACKLOG",
    priority: formData.get("priority") as string || "MEDIUM",
    dueDate: formData.get("dueDate") as string || undefined,
    workstreamId: formData.get("workstreamId") as string || undefined,
    assigneeId: formData.get("assigneeId") as string || undefined,
    projectId: formData.get("projectId") as string,
    tags: formData.getAll("tags") as string[],
  };

  const validated = TaskSchema.parse(data);

  await db.task.create({
    data: {
      title: validated.title,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      workstreamId: validated.workstreamId || null,
      assigneeId: validated.assigneeId || null,
      projectId: validated.projectId,
      tags: validated.tags ? JSON.stringify(validated.tags) : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    dueDate: formData.get("dueDate") as string || undefined,
    workstreamId: formData.get("workstreamId") as string || undefined,
    assigneeId: formData.get("assigneeId") as string || undefined,
  };

  await db.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      workstreamId: data.workstreamId || null,
      assigneeId: data.assigneeId || null,
      completedAt: data.status === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTask(id: string) {
  await db.task.delete({ where: { id } });
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: string) {
  await db.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}
