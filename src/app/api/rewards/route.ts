import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rules = await db.rewardRule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ rules });
}
