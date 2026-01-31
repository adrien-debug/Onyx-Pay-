import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const candidates = await db.hardwareCandidate.findMany({
    orderBy: [{ score: "desc" }, { name: "asc" }],
  });

  const accessories = await db.accessoryDesign.findMany({
    orderBy: { name: "asc" },
  });

  const bundles = await db.bundle.findMany({
    include: {
      items: {
        include: {
          hardwareCandidate: true,
          accessoryDesign: true,
        },
      },
    },
  });

  return NextResponse.json({ candidates, accessories, bundles });
}
