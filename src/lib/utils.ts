import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BACKLOG: "bg-zinc-700 text-zinc-300",
    TODO: "bg-blue-900/50 text-blue-300",
    IN_PROGRESS: "bg-amber-900/50 text-amber-300",
    BLOCKED: "bg-red-900/50 text-red-300",
    DONE: "bg-emerald-900/50 text-emerald-300",
    DRAFT: "bg-zinc-700 text-zinc-300",
    IN_REVIEW: "bg-amber-900/50 text-amber-300",
    APPROVED: "bg-emerald-900/50 text-emerald-300",
    SENT: "bg-blue-900/50 text-blue-300",
    SIGNED: "bg-purple-900/50 text-purple-300",
  };
  return colors[status] || "bg-zinc-700 text-zinc-300";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-zinc-700 text-zinc-300",
    MEDIUM: "bg-blue-900/50 text-blue-300",
    HIGH: "bg-amber-900/50 text-amber-300",
    CRITICAL: "bg-red-900/50 text-red-300",
  };
  return colors[priority] || "bg-zinc-700 text-zinc-300";
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    ADMIN: "bg-purple-900/50 text-purple-300",
    PM: "bg-blue-900/50 text-blue-300",
    OPS: "bg-emerald-900/50 text-emerald-300",
    LEGAL: "bg-amber-900/50 text-amber-300",
    SALES: "bg-rose-900/50 text-rose-300",
    VIEWER: "bg-zinc-700 text-zinc-300",
  };
  return colors[role] || "bg-zinc-700 text-zinc-300";
}

export function calculateRiskScore(probability: number, impact: number): number {
  return probability * impact;
}

export function getRiskScoreColor(score: number): string {
  if (score >= 15) return "text-red-400";
  if (score >= 10) return "text-amber-400";
  if (score >= 5) return "text-yellow-400";
  return "text-emerald-400";
}
