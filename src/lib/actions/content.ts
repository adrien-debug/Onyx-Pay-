"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function saveContentItem(data: {
  title: string;
  type: string;
  rawHtml: string;
  extractedJson: string;
  markdownProposal: string;
  tags: string[];
}) {
  await db.contentItem.create({
    data: {
      title: data.title,
      type: data.type,
      rawHtml: data.rawHtml,
      extractedJson: data.extractedJson,
      markdownProposal: data.markdownProposal,
      tags: JSON.stringify(data.tags),
      status: "DONE",
    },
  });

  revalidatePath("/content");
  return { success: true };
}

export async function deleteContentItem(id: string) {
  await db.contentItem.delete({ where: { id } });
  revalidatePath("/content");
  return { success: true };
}

export async function getContentItems() {
  return await db.contentItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}
