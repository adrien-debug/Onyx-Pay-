"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createProject(data: {
  name: string;
  description?: string;
  targetDate?: Date;
  status?: string;
}) {
  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        description: data.description,
        targetDate: data.targetDate,
        status: data.status || "TODO",
      },
    });

    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Échec de la création du projet" };
  }
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    targetDate?: Date;
    status?: string;
  }
) {
  try {
    const project = await db.project.update({
      where: { id },
      data,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Échec de la mise à jour du projet" };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({
      where: { id },
    });

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Échec de la suppression du projet" };
  }
}

export async function createWorkstream(data: {
  name: string;
  description?: string;
  objectives?: string;
  projectId: string;
}) {
  try {
    const workstream = await db.workstream.create({
      data,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${data.projectId}`);
    return { success: true, data: workstream };
  } catch (error) {
    console.error("Error creating workstream:", error);
    return { success: false, error: "Échec de la création du workstream" };
  }
}

export async function updateWorkstream(
  id: string,
  data: {
    name?: string;
    description?: string;
    objectives?: string;
  }
) {
  try {
    const workstream = await db.workstream.update({
      where: { id },
      data,
      include: { project: true },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${workstream.projectId}`);
    return { success: true, data: workstream };
  } catch (error) {
    console.error("Error updating workstream:", error);
    return { success: false, error: "Échec de la mise à jour du workstream" };
  }
}

export async function deleteWorkstream(id: string) {
  try {
    const workstream = await db.workstream.findUnique({
      where: { id },
      select: { projectId: true },
    });

    await db.workstream.delete({
      where: { id },
    });

    revalidatePath("/projects");
    if (workstream) {
      revalidatePath(`/projects/${workstream.projectId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting workstream:", error);
    return { success: false, error: "Échec de la suppression du workstream" };
  }
}
