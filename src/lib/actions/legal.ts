"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const LegalDocSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  type: z.string().min(1, "Type requis"),
  status: z.string().default("DRAFT"),
  version: z.string().default("1.0"),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function createLegalDoc(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    status: formData.get("status") as string || "DRAFT",
    version: formData.get("version") as string || "1.0",
    content: formData.get("content") as string || undefined,
    fileUrl: formData.get("fileUrl") as string || undefined,
    notes: formData.get("notes") as string || undefined,
  };

  const validated = LegalDocSchema.parse(data);

  await db.legalDoc.create({
    data: validated,
  });

  revalidatePath("/legal");
  return { success: true };
}

export async function updateLegalDoc(id: string, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    status: formData.get("status") as string,
    version: formData.get("version") as string,
    content: formData.get("content") as string || null,
    fileUrl: formData.get("fileUrl") as string || null,
    notes: formData.get("notes") as string || null,
  };

  await db.legalDoc.update({
    where: { id },
    data,
  });

  revalidatePath("/legal");
  return { success: true };
}

export async function deleteLegalDoc(id: string) {
  await db.legalDoc.delete({ where: { id } });
  revalidatePath("/legal");
  return { success: true };
}

export async function updateLegalDocStatus(id: string, status: string) {
  const doc = await db.legalDoc.findUnique({ where: { id } });
  if (!doc) return { success: false };

  // Increment version on status change to APPROVED or SIGNED
  let newVersion = doc.version;
  if ((status === "APPROVED" || status === "SIGNED") && doc.status !== status) {
    const [major, minor] = doc.version.split(".").map(Number);
    newVersion = `${major}.${minor + 1}`;
  }

  await db.legalDoc.update({
    where: { id },
    data: { status, version: newVersion },
  });

  revalidatePath("/legal");
  return { success: true };
}
