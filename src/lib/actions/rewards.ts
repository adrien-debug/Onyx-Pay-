"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const RewardRuleSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  type: z.string().min(1, "Type requis"),
  description: z.string().optional(),
  formula: z.string().optional(),
  minThreshold: z.number().optional(),
  maxThreshold: z.number().optional(),
  capPerDay: z.number().optional(),
  capPerMonth: z.number().optional(),
  conditions: z.string().optional(),
  isActive: z.boolean().default(true),
  testPeriod: z.string().optional(),
  testLocation: z.string().optional(),
});

export async function createRewardRule(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string || undefined,
    formula: formData.get("formula") as string || undefined,
    minThreshold: formData.get("minThreshold") ? parseFloat(formData.get("minThreshold") as string) : undefined,
    maxThreshold: formData.get("maxThreshold") ? parseFloat(formData.get("maxThreshold") as string) : undefined,
    capPerDay: formData.get("capPerDay") ? parseFloat(formData.get("capPerDay") as string) : undefined,
    capPerMonth: formData.get("capPerMonth") ? parseFloat(formData.get("capPerMonth") as string) : undefined,
    conditions: formData.get("conditions") as string || undefined,
    isActive: formData.get("isActive") === "true",
    testPeriod: formData.get("testPeriod") as string || undefined,
    testLocation: formData.get("testLocation") as string || undefined,
  };

  const validated = RewardRuleSchema.parse(data);

  await db.rewardRule.create({
    data: validated,
  });

  revalidatePath("/rewards");
  return { success: true };
}

export async function updateRewardRule(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string || null,
    formula: formData.get("formula") as string || null,
    minThreshold: formData.get("minThreshold") ? parseFloat(formData.get("minThreshold") as string) : null,
    maxThreshold: formData.get("maxThreshold") ? parseFloat(formData.get("maxThreshold") as string) : null,
    capPerDay: formData.get("capPerDay") ? parseFloat(formData.get("capPerDay") as string) : null,
    capPerMonth: formData.get("capPerMonth") ? parseFloat(formData.get("capPerMonth") as string) : null,
    conditions: formData.get("conditions") as string || null,
    isActive: formData.get("isActive") === "true",
    testPeriod: formData.get("testPeriod") as string || null,
    testLocation: formData.get("testLocation") as string || null,
  };

  await db.rewardRule.update({
    where: { id },
    data,
  });

  revalidatePath("/rewards");
  return { success: true };
}

export async function deleteRewardRule(id: string) {
  await db.rewardRule.delete({ where: { id } });
  revalidatePath("/rewards");
  return { success: true };
}

export async function toggleRewardRuleActive(id: string) {
  const rule = await db.rewardRule.findUnique({ where: { id } });
  if (!rule) return { success: false };

  await db.rewardRule.update({
    where: { id },
    data: { isActive: !rule.isActive },
  });

  revalidatePath("/rewards");
  return { success: true };
}
