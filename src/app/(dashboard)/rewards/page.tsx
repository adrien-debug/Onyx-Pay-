"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RewardForm } from "@/components/forms/reward-form";
import { deleteRewardRule, toggleRewardRuleActive } from "@/lib/actions/rewards";
import {
  Gift,
  Calculator,
  Plus,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Edit,
  Trash2,
  Power,
} from "lucide-react";

type RewardRule = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  formula: string | null;
  minThreshold: number | null;
  maxThreshold: number | null;
  capPerDay: number | null;
  capPerMonth: number | null;
  conditions: string | null;
  isActive: boolean;
  testPeriod: string | null;
  testLocation: string | null;
};

function RewardSimulator() {
  const [transactions, setTransactions] = useState(100);
  const [volume, setVolume] = useState(5000);
  const [period, setPeriod] = useState(30);

  const perTxReward = 0.5;
  const volumeBonus = 0.001;
  const dailyCap = 50;
  const monthlyCap = 1000;

  const txReward = transactions * perTxReward;
  const volReward = volume * volumeBonus;
  const totalBeforeCap = txReward + volReward;

  const dailyReward = Math.min(totalBeforeCap / period, dailyCap);
  const totalReward = Math.min(dailyReward * period, monthlyCap);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-copper-400" />
          Simulateur de Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Nombre de transactions</Label>
              <Input
                type="number"
                value={transactions}
                onChange={(e) => setTransactions(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <Label>Volume total ($)</Label>
              <Input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <Label>Période (jours)</Label>
              <Input
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                min={1}
                max={30}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-zinc-300">Détail du calcul</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Reward par tx ({perTxReward}$/tx)</span>
                <span className="text-zinc-300">${txReward.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Bonus volume ({volumeBonus * 100}%)</span>
                <span className="text-zinc-300">${volReward.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="text-zinc-400">Total brut</span>
                <span className="text-zinc-200">${totalBeforeCap.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Cap journalier</span>
                <span>${dailyCap}/jour</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Cap mensuel</span>
                <span>${monthlyCap}/mois</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-copper-500/20 to-transparent border border-copper-800">
            <p className="text-sm text-copper-400">Reward estimé</p>
            <p className="text-4xl font-bold text-zinc-100 mt-2">
              ${totalReward.toFixed(2)}
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              soit ${(totalReward / period).toFixed(2)}/jour
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RewardsPage() {
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/rewards");
    const data = await res.json();
    setRules(data.rules || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (rule: RewardRule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingRule(null);
    fetchData();
  };

  const handleToggleActive = async (id: string) => {
    await toggleRewardRuleActive(id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette règle ?")) return;
    await deleteRewardRule(id);
    fetchData();
  };

  const activeRules = rules.filter((r) => r.isActive);
  const totalMonthlyCap = rules.reduce((sum, r) => sum + (r.capPerMonth || 0), 0);

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
          <h1 className="text-2xl font-bold text-zinc-100">Reward System Staff</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Règles d&apos;incentive pour les serveurs et staff des venues
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle règle
        </Button>
      </div>

      {/* Anti-abuse notice */}
      <Card className="border-amber-800 bg-amber-900/10">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-300">Anti-Abus & Compliance</h4>
            <p className="text-sm text-amber-200/70 mt-1">
              Toutes les règles incluent des plafonds (daily/monthly caps), des conditions
              minimum, et un monitoring pour détecter les comportements frauduleux.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-copper-500/20 flex items-center justify-center">
              <Gift className="h-5 w-5 text-copper-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{activeRules.length}</p>
              <p className="text-sm text-zinc-400">Règles actives</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">${totalMonthlyCap}</p>
              <p className="text-sm text-zinc-400">Cap total/mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{rules.length}</p>
              <p className="text-sm text-zinc-400">Total règles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">TBD</p>
              <p className="text-sm text-zinc-400">Staff éligibles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulator */}
      <RewardSimulator />

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de Reward</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Aucune règle. Créez votre première règle de reward.
            </p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group ${
                    !rule.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-copper-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-zinc-200">{rule.name}</h4>
                          <Badge
                            variant={
                              rule.type === "PER_TX"
                                ? "info"
                                : rule.type === "PER_VOLUME"
                                ? "success"
                                : "copper"
                            }
                          >
                            {rule.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(rule.id)}
                      >
                        <Power className={`h-4 w-4 ${rule.isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500 block">Formule</span>
                      <span className="text-zinc-300">{rule.formula || "-"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Cap/jour</span>
                      <span className="text-zinc-300">
                        {rule.capPerDay ? `$${rule.capPerDay}` : "Illimité"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Cap/mois</span>
                      <span className="text-zinc-300">
                        {rule.capPerMonth ? `$${rule.capPerMonth}` : "Illimité"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Conditions</span>
                      <span className="text-zinc-300">{rule.conditions || "-"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RewardForm
        isOpen={isFormOpen}
        onClose={handleClose}
        rule={editingRule}
      />
    </div>
  );
}
