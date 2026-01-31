"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RunbookForm } from "@/components/forms/runbook-form";
import { deleteRunbook, toggleRunbookActive } from "@/lib/actions/runbooks";
import {
  BookOpen,
  Plus,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Phone,
  Wrench,
  Edit,
  Trash2,
  Power,
} from "lucide-react";

type Runbook = {
  id: string;
  title: string;
  type: string;
  content: string;
  checklist: string | null;
  version: string;
  isActive: boolean;
  createdAt: Date;
};

type Section = {
  name: string;
  items: string[];
};

function parseChecklist(checklist: string | null): Section[] {
  if (!checklist) return [];
  try {
    return JSON.parse(checklist);
  } catch {
    return [];
  }
}

const typeIcons: Record<string, React.ElementType> = {
  venue_launch: Wrench,
  incident: AlertTriangle,
  onboarding: Users,
  maintenance: Wrench,
  escalation: Phone,
  other: BookOpen,
};

const typeColors: Record<string, string> = {
  venue_launch: "text-copper-400",
  incident: "text-amber-400",
  onboarding: "text-blue-400",
  maintenance: "text-emerald-400",
  escalation: "text-red-400",
  other: "text-zinc-400",
};

export default function OpsPage() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRunbook, setEditingRunbook] = useState<Runbook | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/runbooks");
    const data = await res.json();
    setRunbooks(data.runbooks || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (runbook: Runbook) => {
    setEditingRunbook(runbook);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingRunbook(null);
    fetchData();
  };

  const handleToggleActive = async (id: string) => {
    await toggleRunbookActive(id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce runbook ?")) return;
    await deleteRunbook(id);
    fetchData();
  };

  const activeRunbooks = runbooks.filter((r) => r.isActive);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-zinc-800 rounded shimmer" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-800 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Ops Kit (Runbooks)</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Procédures opérationnelles pour le lancement et la gestion terrain
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau runbook
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-copper-500/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-copper-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{runbooks.length}</p>
              <p className="text-sm text-zinc-400">Runbooks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{activeRunbooks.length}</p>
              <p className="text-sm text-zinc-400">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {runbooks.filter((r) => r.type === "incident").length}
              </p>
              <p className="text-sm text-zinc-400">Guides incident</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {runbooks.filter((r) => r.type === "onboarding").length}
              </p>
              <p className="text-sm text-zinc-400">Scripts formation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Runbooks */}
      {runbooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-zinc-500">
            Aucun runbook. Créez votre premier runbook opérationnel.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {runbooks.map((runbook) => {
            const Icon = typeIcons[runbook.type] || BookOpen;
            const iconColor = typeColors[runbook.type] || "text-zinc-400";
            const sections = parseChecklist(runbook.checklist);

            return (
              <Card
                key={runbook.id}
                className={`overflow-hidden ${!runbook.isActive ? "opacity-50" : ""}`}
              >
                <CardHeader className="bg-zinc-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{runbook.title}</CardTitle>
                        <p className="text-sm text-zinc-400 mt-0.5">
                          v{runbook.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="default">{runbook.type}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(runbook.id)}
                      >
                        <Power
                          className={`h-4 w-4 ${
                            runbook.isActive ? "text-emerald-400" : "text-zinc-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {sections.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {sections.map((section, sIdx) => (
                        <div key={sIdx} className="border-b border-zinc-800 last:border-0">
                          <div className="px-4 py-2 bg-zinc-800/30">
                            <h4 className="text-sm font-medium text-zinc-300">
                              {section.name}
                            </h4>
                          </div>
                          <ul className="px-4 py-2 space-y-1">
                            {section.items.map((item, iIdx) => (
                              <li
                                key={iIdx}
                                className="flex items-start gap-2 text-sm text-zinc-400"
                              >
                                <CheckCircle className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : runbook.content ? (
                    <div className="p-4 max-h-[200px] overflow-y-auto">
                      <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-mono">
                        {runbook.content}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-zinc-500">Aucun contenu</div>
                  )}
                  <div className="p-4 border-t border-zinc-800 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileDown className="h-4 w-4 mr-1" />
                      Export MD
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(runbook)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Éditer
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(runbook.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <RunbookForm
        isOpen={isFormOpen}
        onClose={handleClose}
        runbook={editingRunbook}
      />
    </div>
  );
}
