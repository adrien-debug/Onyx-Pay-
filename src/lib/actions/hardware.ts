"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const HardwareSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  brand: z.string().optional(),
  model: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().default("USD"),
  availability: z.string().optional(),
  specs: z.string().optional(),
  constraints: z.string().optional(),
  fieldNotes: z.string().optional(),
  score: z.number().min(1).max(10).optional(),
  recommendation: z.string().optional(),
  status: z.string().default("TODO"),
});

export async function createHardwareCandidate(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    brand: formData.get("brand") as string || undefined,
    model: formData.get("model") as string || undefined,
    price: formData.get("price") ? parseFloat(formData.get("price") as string) : undefined,
    currency: formData.get("currency") as string || "USD",
    availability: formData.get("availability") as string || undefined,
    specs: formData.get("specs") as string || undefined,
    constraints: formData.get("constraints") as string || undefined,
    fieldNotes: formData.get("fieldNotes") as string || undefined,
    score: formData.get("score") ? parseInt(formData.get("score") as string) : undefined,
    recommendation: formData.get("recommendation") as string || undefined,
    status: formData.get("status") as string || "TODO",
  };

  const validated = HardwareSchema.parse(data);

  await db.hardwareCandidate.create({
    data: validated,
  });

  revalidatePath("/hardware");
  return { success: true };
}

export async function updateHardwareCandidate(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    brand: formData.get("brand") as string || null,
    model: formData.get("model") as string || null,
    price: formData.get("price") ? parseFloat(formData.get("price") as string) : null,
    availability: formData.get("availability") as string || null,
    specs: formData.get("specs") as string || null,
    constraints: formData.get("constraints") as string || null,
    fieldNotes: formData.get("fieldNotes") as string || null,
    score: formData.get("score") ? parseInt(formData.get("score") as string) : null,
    recommendation: formData.get("recommendation") as string || null,
    status: formData.get("status") as string,
  };

  await db.hardwareCandidate.update({
    where: { id },
    data,
  });

  revalidatePath("/hardware");
  return { success: true };
}

export async function deleteHardwareCandidate(id: string) {
  await db.hardwareCandidate.delete({ where: { id } });
  revalidatePath("/hardware");
  return { success: true };
}

export async function setHardwareRecommendation(id: string, recommendation: string) {
  // If setting as PRIMARY, remove PRIMARY from others
  if (recommendation === "PRIMARY") {
    await db.hardwareCandidate.updateMany({
      where: { recommendation: "PRIMARY" },
      data: { recommendation: null },
    });
  }

  await db.hardwareCandidate.update({
    where: { id },
    data: { recommendation },
  });

  revalidatePath("/hardware");
  return { success: true };
}

// Accessory actions
const AccessorySchema = z.object({
  name: z.string().min(1, "Nom requis"),
  type: z.string(),
  description: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  branding: z.string().optional(),
  supplier: z.string().optional(),
  unitCost: z.number().optional(),
  currency: z.string().default("USD"),
  leadTime: z.string().optional(),
  status: z.string().default("TODO"),
});

export async function createAccessory(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string || undefined,
    materials: formData.get("materials") as string || undefined,
    dimensions: formData.get("dimensions") as string || undefined,
    branding: formData.get("branding") as string || undefined,
    supplier: formData.get("supplier") as string || undefined,
    unitCost: formData.get("unitCost") ? parseFloat(formData.get("unitCost") as string) : undefined,
    currency: formData.get("currency") as string || "USD",
    leadTime: formData.get("leadTime") as string || undefined,
    status: formData.get("status") as string || "TODO",
  };

  const validated = AccessorySchema.parse(data);

  await db.accessoryDesign.create({
    data: validated,
  });

  revalidatePath("/hardware");
  return { success: true };
}

export async function updateAccessory(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string || null,
    materials: formData.get("materials") as string || null,
    dimensions: formData.get("dimensions") as string || null,
    branding: formData.get("branding") as string || null,
    supplier: formData.get("supplier") as string || null,
    unitCost: formData.get("unitCost") ? parseFloat(formData.get("unitCost") as string) : null,
    leadTime: formData.get("leadTime") as string || null,
    status: formData.get("status") as string,
  };

  await db.accessoryDesign.update({
    where: { id },
    data,
  });

  revalidatePath("/hardware");
  return { success: true };
}

export async function deleteAccessory(id: string) {
  await db.accessoryDesign.delete({ where: { id } });
  revalidatePath("/hardware");
  return { success: true };
}
