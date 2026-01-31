import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const UpdateRiskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  probability: z.number().min(1).max(5).optional(),
  impact: z.number().min(1).max(5).optional(),
  mitigation: z.string().optional().nullable(),
  status: z.string().optional(),
  workstreamId: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

// GET /api/risks/[id]
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
    const risk = await db.risk.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        workstream: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!risk) {
      return NextResponse.json({ error: "Risque non trouvé" }, { status: 404 });
    }

    return NextResponse.json(risk);
  } catch (error) {
    console.error("GET /api/risks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/risks/[id]
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
    const data = UpdateRiskSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.probability !== undefined) updateData.probability = data.probability;
    if (data.impact !== undefined) updateData.impact = data.impact;
    if (data.mitigation !== undefined) updateData.mitigation = data.mitigation;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.workstreamId !== undefined) updateData.workstreamId = data.workstreamId;
    if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;

    const risk = await db.risk.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(risk);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("PUT /api/risks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/risks/[id]
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
    await db.risk.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/risks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/risks/[id] - Update status or score quickly
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

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.probability) updateData.probability = body.probability;
    if (body.impact) updateData.impact = body.impact;

    const risk = await db.risk.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(risk);
  } catch (error) {
    console.error("PATCH /api/risks/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
