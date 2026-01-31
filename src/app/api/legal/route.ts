import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const docs = await db.legalDoc.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ docs });
}
