"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const RunbookSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  type: z.string().min(1, "Type requis"),
  content: z.string().default(""),
  checklist: z.string().optional(),
  version: z.string().default("1.0"),
  isActive: z.boolean().default(true),
});

export async function createRunbook(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    content: (formData.get("content") as string) || "",
    checklist: formData.get("checklist") as string | null,
    version: formData.get("version") as string || "1.0",
    isActive: formData.get("isActive") === "true",
  };

  const validated = RunbookSchema.parse(data);

  await db.runbook.create({
    data: {
      title: validated.title,
      type: validated.type,
      content: validated.content,
      checklist: validated.checklist || null,
      version: validated.version,
      isActive: validated.isActive,
    },
  });

  revalidatePath("/ops");
  return { success: true };
}

export async function updateRunbook(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    content: formData.get("content") as string || "",
    checklist: formData.get("checklist") as string || null,
    version: formData.get("version") as string || "1.0",
    isActive: formData.get("isActive") === "true",
  };

  await db.runbook.update({
    where: { id },
    data,
  });

  revalidatePath("/ops");
  return { success: true };
}

export async function deleteRunbook(id: string) {
  await db.runbook.delete({ where: { id } });
  revalidatePath("/ops");
  return { success: true };
}

export async function toggleRunbookActive(id: string) {
  const runbook = await db.runbook.findUnique({ where: { id } });
  if (!runbook) return { success: false };

  await db.runbook.update({
    where: { id },
    data: { isActive: !runbook.isActive },
  });

  revalidatePath("/ops");
  return { success: true };
}
