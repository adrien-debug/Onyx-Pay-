"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const MilestoneSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  targetDate: z.string(),
  ownerId: z.string().optional(),
  workstreamId: z.string().optional(),
  projectId: z.string(),
});

export async function createMilestone(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    targetDate: formData.get("targetDate") as string,
    ownerId: formData.get("ownerId") as string || undefined,
    workstreamId: formData.get("workstreamId") as string || undefined,
    projectId: formData.get("projectId") as string,
  };

  const validated = MilestoneSchema.parse(data);

  const count = await db.milestone.count({ where: { projectId: validated.projectId } });

  await db.milestone.create({
    data: {
      title: validated.title,
      description: validated.description,
      targetDate: new Date(validated.targetDate),
      ownerId: validated.ownerId || null,
      workstreamId: validated.workstreamId || null,
      projectId: validated.projectId,
      order: count + 1,
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateMilestone(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    targetDate: formData.get("targetDate") as string,
    ownerId: formData.get("ownerId") as string || undefined,
    workstreamId: formData.get("workstreamId") as string || undefined,
    completed: formData.get("completed") === "true",
  };

  await db.milestone.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      targetDate: new Date(data.targetDate),
      ownerId: data.ownerId || null,
      workstreamId: data.workstreamId || null,
      completedAt: data.completed ? new Date() : null,
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteMilestone(id: string) {
  await db.milestone.delete({ where: { id } });
  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleMilestoneComplete(id: string) {
  const milestone = await db.milestone.findUnique({ where: { id } });
  if (!milestone) return { success: false };

  await db.milestone.update({
    where: { id },
    data: {
      completedAt: milestone.completedAt ? null : new Date(),
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: true };
}
