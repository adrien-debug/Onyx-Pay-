import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        workstreams: {
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        },
        tasks: {
          select: { status: true },
        },
        milestones: {
          select: { id: true, completedAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        status: body.status || "TODO",
      },
      include: {
        workstreams: {
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        },
        tasks: {
          select: { status: true },
        },
        milestones: {
          select: { id: true, completedAt: true },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
}
