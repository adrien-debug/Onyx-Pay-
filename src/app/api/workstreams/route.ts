import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const WorkstreamSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  objectives: z.string().optional(),
  projectId: z.string(),
});

// GET /api/workstreams - Liste des workstreams
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;

    const workstreams = await db.workstream.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        _count: {
          select: {
            tasks: true,
            milestones: true,
            risks: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(workstreams);
  } catch (error) {
    console.error("GET /api/workstreams error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/workstreams - Créer un workstream
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const data = WorkstreamSchema.parse(body);

    const workstream = await db.workstream.create({
      data: {
        name: data.name,
        description: data.description,
        objectives: data.objectives,
        projectId: data.projectId,
      },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(workstream, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("POST /api/workstreams error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
