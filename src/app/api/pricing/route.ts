import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const plans = await db.pricingPlan.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ plans });
}
