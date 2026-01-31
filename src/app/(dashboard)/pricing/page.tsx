"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingForm } from "@/components/forms/pricing-form";
import { deletePricingPlan, togglePricingPlanActive } from "@/lib/actions/pricing";
import {
  BadgeDollarSign,
  Check,
  Plus,
  FileDown,
  Zap,
  Crown,
  Building,
  Edit,
  Trash2,
  Power,
} from "lucide-react";

type PricingPlan = {
  id: string;
  name: string;
  description: string | null;
  hardwareModel: string | null;
  setupFee: number | null;
  monthlyFee: number | null;
  transactionFee: number | null;
  feeType: string | null;
  currency: string;
  inclusions: string | null;
  slaLevel: string | null;
  supportHours: string | null;
  isActive: boolean;
  order: number;
};

const planIcons: Record<string, React.ElementType> = {
  PILOT: Zap,
  PREMIUM: Crown,
  ENTERPRISE: Building,
};

const planColors: Record<string, string> = {
  PILOT: "from-blue-500/20 to-transparent border-blue-800",
  PREMIUM: "from-copper-500/20 to-transparent border-copper-800",
  ENTERPRISE: "from-purple-500/20 to-transparent border-purple-800",
};

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/pricing");
    const data = await res.json();
    setPlans(data.plans || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
    fetchData();
  };

  const handleToggleActive = async (id: string) => {
    await togglePricingPlanActive(id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce plan ?")) return;
    await deletePricingPlan(id);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-zinc-800 rounded shimmer" />
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-zinc-800 rounded-xl shimmer" />
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
          <h1 className="text-2xl font-bold text-zinc-100">Pricing & Packaging</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Plans tarifaires pour les venues partenaires
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-zinc-500">
              Aucun plan tarifaire. Créez votre premier plan.
            </CardContent>
          </Card>
        ) : (
          plans.map((plan) => {
            const Icon = planIcons[plan.name] || BadgeDollarSign;
            const colorClass = planColors[plan.name] || planColors.PILOT;
            let inclusions: string[] = [];
            try {
              inclusions = plan.inclusions ? JSON.parse(plan.inclusions) : [];
            } catch {
              inclusions = [];
            }

            return (
              <Card
                key={plan.id}
                className={`bg-gradient-to-br ${colorClass} card-hover relative ${
                  !plan.isActive ? "opacity-50" : ""
                }`}
              >
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(plan.id)}
                    title={plan.isActive ? "Désactiver" : "Activer"}
                  >
                    <Power className={`h-4 w-4 ${plan.isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>

                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-copper-400" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.description && (
                    <p className="text-sm text-zinc-400">{plan.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Pricing */}
                  <div className="text-center py-4 border-y border-zinc-800 my-4">
                    {plan.setupFee !== null && plan.setupFee > 0 && (
                      <p className="text-sm text-zinc-500">
                        Setup: {plan.setupFee} {plan.currency}
                      </p>
                    )}
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-4xl font-bold text-zinc-100">
                        {plan.monthlyFee || 0}
                      </span>
                      <span className="text-zinc-400">
                        {plan.currency}/mois
                      </span>
                    </div>
                    {plan.transactionFee !== null && plan.transactionFee > 0 && (
                      <p className="text-sm text-zinc-500 mt-2">
                        + {plan.transactionFee}
                        {plan.feeType === "PERCENTAGE" ? "%" : ` ${plan.currency}`} / tx
                      </p>
                    )}
                  </div>

                  {/* Hardware model */}
                  {plan.hardwareModel && (
                    <div className="mb-4">
                      <Badge variant="default" className="w-full justify-center">
                        Hardware: {plan.hardwareModel}
                      </Badge>
                    </div>
                  )}

                  {/* Inclusions */}
                  <div className="space-y-2">
                    {inclusions.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* SLA */}
                  {plan.slaLevel && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">SLA</span>
                        <Badge variant="copper">{plan.slaLevel}</Badge>
                      </div>
                      {plan.supportHours && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-zinc-500">Support</span>
                          <span className="text-zinc-300">{plan.supportHours}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* One-pager export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-copper-400" />
            Pricing One-Pager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 mb-4">
            Générez un document PDF présentant les offres ONYX pour vos prospects.
          </p>
          <div className="flex gap-3">
            <Button variant="premium">
              <FileDown className="h-4 w-4 mr-2" />
              Générer PDF
            </Button>
            <Button variant="outline">Aperçu web</Button>
          </div>
        </CardContent>
      </Card>

      <PricingForm
        isOpen={isFormOpen}
        onClose={handleClose}
        plan={editingPlan}
      />
    </div>
  );
}
