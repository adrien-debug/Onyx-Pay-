import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const MilestoneSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  targetDate: z.string(),
  ownerId: z.string().optional().nullable(),
  projectId: z.string(),
  workstreamId: z.string().optional().nullable(),
  order: z.number().optional(),
});

// GET /api/milestones - Liste des jalons
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const workstreamId = searchParams.get("workstreamId");
    const completed = searchParams.get("completed");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (workstreamId) where.workstreamId = workstreamId;
    if (completed === "true") {
      where.completedAt = { not: null };
    } else if (completed === "false") {
      where.completedAt = null;
    }

    const milestones = await db.milestone.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        workstream: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
        checklist: { orderBy: { order: "asc" } },
        _count: { select: { dependencies: true, dependents: true } },
      },
      orderBy: [{ targetDate: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(milestones);
  } catch (error) {
    console.error("GET /api/milestones error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/milestones - Créer un jalon
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const data = MilestoneSchema.parse(body);

    const milestone = await db.milestone.create({
      data: {
        title: data.title,
        description: data.description,
        targetDate: new Date(data.targetDate),
        ownerId: data.ownerId || null,
        projectId: data.projectId,
        workstreamId: data.workstreamId || null,
        order: data.order ?? 0,
      },
      include: {
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("POST /api/milestones error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
