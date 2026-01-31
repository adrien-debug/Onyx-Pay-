"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const CreateUserSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(1, "Nom requis"),
  password: z.string().min(6, "Minimum 6 caractères"),
  role: z.enum(["ADMIN", "PM", "OPS", "LEGAL", "SALES", "VIEWER"]),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1, "Nom requis").optional(),
  role: z.enum(["ADMIN", "PM", "OPS", "LEGAL", "SALES", "VIEWER"]).optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié" };
  }

  try {
    const data = UpdateProfileSchema.parse({
      name: formData.get("name"),
    });

    await db.user.update({
      where: { id: session.user.id },
      data: { name: data.name },
    });

    revalidatePath("/settings");
    return { success: true, message: "Profil mis à jour" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error updating profile:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié" };
  }

  try {
    const data = ChangePasswordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Mot de passe actuel incorrect" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Mot de passe modifié" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error changing password:", error);
    return { success: false, error: "Erreur lors du changement" };
  }
}

export async function createUser(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Non autorisé" };
  }

  try {
    const data = CreateUserSchema.parse({
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    const existing = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "Cet email est déjà utilisé" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
      },
    });

    revalidatePath("/settings");
    return { success: true, message: "Utilisateur créé" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating user:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Non autorisé" };
  }

  try {
    const data = UpdateUserSchema.parse({
      name: formData.get("name") || undefined,
      role: formData.get("role") || undefined,
    });

    await db.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/settings");
    return { success: true, message: "Utilisateur mis à jour" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error updating user:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Non autorisé" };
  }

  if (userId === session.user.id) {
    return { success: false, error: "Impossible de supprimer votre propre compte" };
  }

  try {
    await db.user.delete({ where: { id: userId } });
    revalidatePath("/settings");
    return { success: true, message: "Utilisateur supprimé" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
