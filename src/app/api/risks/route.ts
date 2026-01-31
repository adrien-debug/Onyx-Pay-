import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const RiskSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  probability: z.number().min(1).max(5).default(3),
  impact: z.number().min(1).max(5).default(3),
  mitigation: z.string().optional(),
  status: z.string().default("TODO"),
  projectId: z.string(),
  workstreamId: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

// GET /api/risks - Liste des risques
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const minScore = searchParams.get("minScore");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    let risks = await db.risk.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        workstream: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Filtrer par score minimum si spécifié
    if (minScore) {
      const min = parseInt(minScore);
      risks = risks.filter((r) => r.probability * r.impact >= min);
    }

    // Trier par score décroissant
    risks.sort((a, b) => b.probability * b.impact - a.probability * a.impact);

    return NextResponse.json(risks);
  } catch (error) {
    console.error("GET /api/risks error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/risks - Créer un risque
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const data = RiskSchema.parse(body);

    const risk = await db.risk.create({
      data: {
        title: data.title,
        description: data.description,
        probability: data.probability,
        impact: data.impact,
        mitigation: data.mitigation,
        status: data.status,
        projectId: data.projectId,
        workstreamId: data.workstreamId || null,
        ownerId: data.ownerId || null,
      },
      include: {
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("POST /api/risks error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
