import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const runbooks = await db.runbook.findMany({
    orderBy: [{ type: "asc" }, { title: "asc" }],
  });

  return NextResponse.json({ runbooks });
}
