"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

// Helper pour parser une date de façon sécurisée
function parseDate(dateStr: string): Date {
  // Format attendu: YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error("Format de date invalide. Utilisez YYYY-MM-DD");
  }
  const [, year, month, day] = match;
  const yearNum = parseInt(year, 10);
  // Validation de l'année (entre 2000 et 2100)
  if (yearNum < 2000 || yearNum > 2100) {
    throw new Error("Année invalide. Doit être entre 2000 et 2100");
  }
  return new Date(yearNum, parseInt(month, 10) - 1, parseInt(day, 10));
}

const MilestoneSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
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
      targetDate: parseDate(validated.targetDate),
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
      targetDate: parseDate(data.targetDate),
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
