import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const UpdateWorkstreamSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
});

// GET /api/workstreams/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const workstream = await db.workstream.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        tasks: {
          select: { id: true, title: true, status: true, priority: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        milestones: {
          select: { id: true, title: true, targetDate: true, completedAt: true },
          orderBy: { targetDate: "asc" },
        },
        risks: {
          select: { id: true, title: true, probability: true, impact: true, status: true },
        },
        _count: {
          select: { tasks: true, milestones: true, risks: true },
        },
      },
    });

    if (!workstream) {
      return NextResponse.json({ error: "Workstream non trouvé" }, { status: 404 });
    }

    return NextResponse.json(workstream);
  } catch (error) {
    console.error("GET /api/workstreams/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/workstreams/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = UpdateWorkstreamSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.objectives !== undefined) updateData.objectives = data.objectives;

    const workstream = await db.workstream.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(workstream);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("PUT /api/workstreams/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/workstreams/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    await db.workstream.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workstreams/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
