"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { RiskForm } from "@/components/forms/risk-form";
import { deleteRisk, updateRiskStatus } from "@/lib/actions/risks";
import { getStatusColor, calculateRiskScore, getRiskScoreColor } from "@/lib/utils";
import {
  AlertTriangle,
  Plus,
  TrendingUp,
  Minus,
  Shield,
  Edit,
  Trash2,
} from "lucide-react";
import type { Risk, User, Workstream, Project } from "@prisma/client";

type RiskWithRelations = Risk & {
  owner: User | null;
  workstream: Workstream | null;
  project: Project;
};

interface RisksClientProps {
  risks: RiskWithRelations[];
  workstreams: Workstream[];
  users: User[];
  projectId: string;
}

function RiskMatrix({ risks }: { risks: RiskWithRelations[] }) {
  const matrix: RiskWithRelations[][][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null).map(() => []));

  risks.forEach((risk) => {
    const pIdx = Math.min(risk.probability - 1, 4);
    const iIdx = Math.min(risk.impact - 1, 4);
    matrix[4 - pIdx][iIdx].push(risk);
  });

  const getCellColor = (p: number, i: number) => {
    const score = (5 - p) * (i + 1);
    if (score >= 15) return "bg-red-900/30";
    if (score >= 10) return "bg-amber-900/30";
    if (score >= 5) return "bg-yellow-900/30";
    return "bg-emerald-900/30";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          Matrice des Risques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-zinc-500 whitespace-nowrap">
            Probabilité
          </div>

          <div className="ml-8">
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              {matrix.map((row, pIdx) => (
                <div key={pIdx} className="flex">
                  <div className="w-8 flex items-center justify-center text-xs text-zinc-500 bg-zinc-900 border-r border-zinc-800">
                    {5 - pIdx}
                  </div>
                  {row.map((cell, iIdx) => (
                    <div
                      key={iIdx}
                      className={`flex-1 min-h-[60px] p-1 border-r border-b border-zinc-800 last:border-r-0 ${getCellColor(
                        pIdx,
                        iIdx
                      )}`}
                    >
                      <div className="flex flex-wrap gap-1">
                        {cell.map((risk) => (
                          <div
                            key={risk.id}
                            className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 cursor-pointer hover:bg-zinc-600"
                            title={risk.title}
                          >
                            R
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex bg-zinc-900">
                <div className="w-8" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex-1 text-center py-1 text-xs text-zinc-500 border-r border-zinc-800 last:border-r-0"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-zinc-500">Impact</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-900/30" />
            <span className="text-zinc-400">Critique (15-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-900/30" />
            <span className="text-zinc-400">Élevé (10-14)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-900/30" />
            <span className="text-zinc-400">Moyen (5-9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-900/30" />
            <span className="text-zinc-400">Faible (1-4)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RisksClient({
  risks,
  workstreams,
  users,
  projectId,
}: RisksClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskWithRelations | null>(null);

  const handleEdit = (risk: RiskWithRelations) => {
    setEditingRisk(risk);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingRisk(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce risque ?")) return;
    await deleteRisk(id);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateRiskStatus(id, status);
  };

  const activeRisks = risks.filter((r) => r.status !== "DONE");
  const criticalRisks = risks.filter(
    (r) => calculateRiskScore(r.probability, r.impact) >= 15
  );
  const highRisks = risks.filter((r) => {
    const score = calculateRiskScore(r.probability, r.impact);
    return score >= 10 && score < 15;
  });
  const mitigatedRisks = risks.filter((r) => r.status === "DONE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Registre des Risques</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Identification et suivi des risques projet
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau risque
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{activeRisks.length}</p>
              <p className="text-sm text-zinc-400">Risques actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{criticalRisks.length}</p>
              <p className="text-sm text-zinc-400">Critiques</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Minus className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{highRisks.length}</p>
              <p className="text-sm text-zinc-400">Élevés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{mitigatedRisks.length}</p>
              <p className="text-sm text-zinc-400">Mitigés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk matrix */}
      <RiskMatrix risks={risks} />

      {/* Risks list */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des risques</CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Aucun risque identifié. Ajoutez votre premier risque.
            </p>
          ) : (
            <div className="space-y-4">
              {risks.map((risk) => {
                const score = calculateRiskScore(risk.probability, risk.impact);

                return (
                  <div
                    key={risk.id}
                    className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold ${
                            score >= 15
                              ? "bg-red-900/50 text-red-400"
                              : score >= 10
                              ? "bg-amber-900/50 text-amber-400"
                              : score >= 5
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-emerald-900/50 text-emerald-400"
                          }`}
                        >
                          {score}
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-200">{risk.title}</h4>
                          {risk.description && (
                            <p className="text-sm text-zinc-400 mt-1">
                              {risk.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            {risk.workstream && (
                              <Badge variant="default">{risk.workstream.name}</Badge>
                            )}
                            <span className="text-xs text-zinc-500">
                              P:{risk.probability} × I:{risk.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {risk.owner && (
                          <div className="flex items-center gap-2">
                            <Avatar fallback={risk.owner.name || "?"} size="sm" />
                            <span className="text-xs text-zinc-400">
                              {risk.owner.name}
                            </span>
                          </div>
                        )}
                        <select
                          value={risk.status}
                          onChange={(e) => handleStatusChange(risk.id, e.target.value)}
                          className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="BACKLOG">Identifié</option>
                          <option value="TODO">À traiter</option>
                          <option value="IN_PROGRESS">En mitigation</option>
                          <option value="DONE">Mitigé</option>
                        </select>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(risk)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(risk.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {risk.mitigation && (
                      <div className="mt-3 pt-3 border-t border-zinc-700">
                        <p className="text-xs text-zinc-500 uppercase mb-1">
                          Plan de mitigation
                        </p>
                        <p className="text-sm text-zinc-300">{risk.mitigation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <RiskForm
        isOpen={isFormOpen}
        onClose={handleClose}
        risk={editingRisk}
        projectId={projectId}
        workstreams={workstreams}
        users={users}
      />
    </div>
  );
}
