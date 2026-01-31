"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const RiskSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  probability: z.number().min(1).max(5).default(3),
  impact: z.number().min(1).max(5).default(3),
  mitigation: z.string().optional(),
  status: z.string().default("TODO"),
  projectId: z.string(),
  workstreamId: z.string().optional(),
  ownerId: z.string().optional(),
});

export async function createRisk(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || undefined,
    probability: formData.get("probability") ? parseInt(formData.get("probability") as string) : 3,
    impact: formData.get("impact") ? parseInt(formData.get("impact") as string) : 3,
    mitigation: formData.get("mitigation") as string || undefined,
    status: formData.get("status") as string || "TODO",
    projectId: formData.get("projectId") as string,
    workstreamId: formData.get("workstreamId") as string || undefined,
    ownerId: formData.get("ownerId") as string || undefined,
  };

  const validated = RiskSchema.parse(data);

  await db.risk.create({
    data: {
      ...validated,
      workstreamId: validated.workstreamId || null,
      ownerId: validated.ownerId || null,
    },
  });

  revalidatePath("/risks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateRisk(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    probability: parseInt(formData.get("probability") as string),
    impact: parseInt(formData.get("impact") as string),
    mitigation: formData.get("mitigation") as string || null,
    status: formData.get("status") as string,
    workstreamId: formData.get("workstreamId") as string || null,
    ownerId: formData.get("ownerId") as string || null,
  };

  await db.risk.update({
    where: { id },
    data,
  });

  revalidatePath("/risks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRisk(id: string) {
  await db.risk.delete({ where: { id } });
  revalidatePath("/risks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateRiskStatus(id: string, status: string) {
  await db.risk.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/risks");
  revalidatePath("/dashboard");
  return { success: true };
}
