import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const UpdateMilestoneSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  targetDate: z.string().optional(),
  completedAt: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  workstreamId: z.string().optional().nullable(),
  order: z.number().optional(),
});

// GET /api/milestones/[id]
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
    const milestone = await db.milestone.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        workstream: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
        checklist: { orderBy: { order: "asc" } },
        dependencies: {
          include: { dependsOn: { select: { id: true, title: true } } },
        },
        dependents: {
          include: { milestone: { select: { id: true, title: true } } },
        },
      },
    });

    if (!milestone) {
      return NextResponse.json({ error: "Jalon non trouvé" }, { status: 404 });
    }

    return NextResponse.json(milestone);
  } catch (error) {
    console.error("GET /api/milestones/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/milestones/[id]
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
    const data = UpdateMilestoneSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.targetDate !== undefined) updateData.targetDate = new Date(data.targetDate);
    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    }
    if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;
    if (data.workstreamId !== undefined) updateData.workstreamId = data.workstreamId;
    if (data.order !== undefined) updateData.order = data.order;

    const milestone = await db.milestone.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(milestone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("PUT /api/milestones/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/milestones/[id]
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
    await db.milestone.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/milestones/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/milestones/[id] - Toggle completion
export async function PATCH(
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

    const milestone = await db.milestone.findUnique({ where: { id } });
    if (!milestone) {
      return NextResponse.json({ error: "Jalon non trouvé" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.toggle === "completion") {
      updateData.completedAt = milestone.completedAt ? null : new Date();
    }

    const updated = await db.milestone.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/milestones/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
