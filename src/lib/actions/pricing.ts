"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const PricingPlanSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  hardwareModel: z.string().optional(),
  setupFee: z.number().optional(),
  monthlyFee: z.number().optional(),
  transactionFee: z.number().optional(),
  feeType: z.string().optional(),
  currency: z.string().default("USD"),
  inclusions: z.array(z.string()).optional(),
  slaLevel: z.string().optional(),
  supportHours: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function createPricingPlan(formData: FormData) {
  const inclusionsRaw = formData.get("inclusions") as string;
  const inclusions = inclusionsRaw ? inclusionsRaw.split("\n").filter(Boolean) : [];

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || undefined,
    hardwareModel: formData.get("hardwareModel") as string || undefined,
    setupFee: formData.get("setupFee") ? parseFloat(formData.get("setupFee") as string) : undefined,
    monthlyFee: formData.get("monthlyFee") ? parseFloat(formData.get("monthlyFee") as string) : undefined,
    transactionFee: formData.get("transactionFee") ? parseFloat(formData.get("transactionFee") as string) : undefined,
    feeType: formData.get("feeType") as string || undefined,
    currency: formData.get("currency") as string || "USD",
    inclusions,
    slaLevel: formData.get("slaLevel") as string || undefined,
    supportHours: formData.get("supportHours") as string || undefined,
    isActive: formData.get("isActive") === "true",
  };

  const validated = PricingPlanSchema.parse(data);
  const count = await db.pricingPlan.count();

  await db.pricingPlan.create({
    data: {
      ...validated,
      inclusions: JSON.stringify(validated.inclusions || []),
      order: count + 1,
    },
  });

  revalidatePath("/pricing");
  return { success: true };
}

export async function updatePricingPlan(id: string, formData: FormData) {
  const inclusionsRaw = formData.get("inclusions") as string;
  const inclusions = inclusionsRaw ? inclusionsRaw.split("\n").filter(Boolean) : [];

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string || null,
    hardwareModel: formData.get("hardwareModel") as string || null,
    setupFee: formData.get("setupFee") ? parseFloat(formData.get("setupFee") as string) : null,
    monthlyFee: formData.get("monthlyFee") ? parseFloat(formData.get("monthlyFee") as string) : null,
    transactionFee: formData.get("transactionFee") ? parseFloat(formData.get("transactionFee") as string) : null,
    feeType: formData.get("feeType") as string || null,
    slaLevel: formData.get("slaLevel") as string || null,
    supportHours: formData.get("supportHours") as string || null,
    isActive: formData.get("isActive") === "true",
    inclusions: JSON.stringify(inclusions),
  };

  await db.pricingPlan.update({
    where: { id },
    data,
  });

  revalidatePath("/pricing");
  return { success: true };
}

export async function deletePricingPlan(id: string) {
  await db.pricingPlan.delete({ where: { id } });
  revalidatePath("/pricing");
  return { success: true };
}

export async function togglePricingPlanActive(id: string) {
  const plan = await db.pricingPlan.findUnique({ where: { id } });
  if (!plan) return { success: false };

  await db.pricingPlan.update({
    where: { id },
    data: { isActive: !plan.isActive },
  });

  revalidatePath("/pricing");
  return { success: true };
}
