import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  status: z.string().default("BACKLOG"),
  priority: z.string().default("MEDIUM"),
  dueDate: z.string().optional(),
  workstreamId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string(),
  tags: z.array(z.string()).optional(),
});

// GET /api/tasks - Liste des tâches
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assigneeId = searchParams.get("assigneeId");
    const workstreamId = searchParams.get("workstreamId");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (workstreamId) where.workstreamId = workstreamId;

    const tasks = await db.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        workstream: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        checklist: true,
        _count: { select: { comments: true, attachments: true } },
      },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/tasks - Créer une tâche
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const data = TaskSchema.parse(body);

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        workstreamId: data.workstreamId || null,
        assigneeId: data.assigneeId || null,
        projectId: data.projectId,
        creatorId: session.user.id,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
