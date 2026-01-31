import { Suspense } from "react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
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
} from "lucide-react";

async function getRunbooks() {
  const runbooks = await db.runbook.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });

  return { runbooks };
}

// Default runbook templates
const defaultRunbooks = [
  {
    id: "venue-launch",
    title: "Venue Launch Checklist",
    type: "venue_launch",
    description: "Checklist complète pour l'installation ONYX dans une venue",
    sections: [
      {
        name: "Pré-installation (J-7)",
        items: [
          "Confirmer date et heure avec le venue manager",
          "Vérifier la disponibilité du kit ONYX (device + coque + support + chargeur)",
          "Préparer documentation de formation",
          "Coordonner avec l'équipe technique locale",
        ],
      },
      {
        name: "Installation (15 min)",
        items: [
          "Positionner le support sur le comptoir/table",
          "Installer le device dans la coque",
          "Connecter le chargeur",
          "Vérifier la connexion WiFi/4G",
          "Tester l'application ONYX",
        ],
      },
      {
        name: "Configuration (15 min)",
        items: [
          "Créer le compte venue dans le backoffice",
          "Configurer les paramètres de paiement",
          "Ajouter les serveurs/staff",
          "Configurer les notifications",
        ],
      },
      {
        name: "Formation Staff (30 min)",
        items: [
          "Présentation de l'interface",
          "Processus de paiement standard",
          "Gestion des incidents (refus, annulation)",
          "Q&A avec l'équipe",
        ],
      },
    ],
  },
  {
    id: "incident-guide",
    title: "Guide Incident",
    type: "incident",
    description: "Procédures en cas de problème technique ou opérationnel",
    sections: [
      {
        name: "Niveau 1: Auto-résolution",
        items: [
          "Device ne répond pas → Redémarrage forcé (10s power button)",
          "Pas de connexion → Vérifier WiFi, basculer sur 4G",
          "Transaction échouée → Vérifier la carte, réessayer",
          "App freeze → Fermer et relancer l'app",
        ],
      },
      {
        name: "Niveau 2: Support à distance",
        items: [
          "Contacter le support ONYX via chat in-app",
          "Fournir: ID venue, description problème, screenshots si possible",
          "Temps de réponse cible: 15 min (heures ouvrées)",
        ],
      },
      {
        name: "Niveau 3: Intervention terrain",
        items: [
          "Si problème non résolu après 30 min",
          "Escalader au responsable technique local",
          "Prévoir remplacement device si nécessaire",
        ],
      },
    ],
  },
  {
    id: "onboarding-script",
    title: "Script Onboarding Staff",
    type: "onboarding",
    description: "Script de formation pour les nouveaux serveurs",
    sections: [
      {
        name: "Introduction (5 min)",
        items: [
          '"Bienvenue dans la formation ONYX Pay"',
          "Présenter ONYX: paiements modernes pour le hospitality premium",
          "Avantages pour le staff: tips digitaux, suivi des performances",
        ],
      },
      {
        name: "Démonstration (10 min)",
        items: [
          "Montrer le processus de paiement complet",
          "Expliquer le QR code et le paiement sans contact",
          "Démontrer la gestion des tips",
        ],
      },
      {
        name: "Pratique (10 min)",
        items: [
          "Le staff effectue 2-3 transactions test",
          "Simuler un scénario de refus de carte",
          "Répondre aux questions",
        ],
      },
      {
        name: "Récapitulatif (5 min)",
        items: [
          "Points clés à retenir",
          "Où trouver de l'aide (support in-app)",
          "Remise du guide quick-reference",
        ],
      },
    ],
  },
];

// Escalation matrix
const escalationMatrix = [
  {
    category: "Technique (device/app)",
    l1: "Auto-résolution (guide in-app)",
    l2: "Support ONYX (chat/email)",
    l3: "Tech Lead terrain",
    sla: "15 min / 2h / 24h",
  },
  {
    category: "Paiement (transaction)",
    l1: "Retry / alternative payment",
    l2: "Support partenaire régulé",
    l3: "Finance Manager",
    sla: "Immédiat / 1h / 4h",
  },
  {
    category: "Staff (formation/accès)",
    l1: "Manager venue",
    l2: "Ops ONYX",
    l3: "Account Manager",
    sla: "Immédiat / 2h / 24h",
  },
  {
    category: "Sécurité/Fraude",
    l1: "Suspendre transaction",
    l2: "Compliance ONYX",
    l3: "Partenaire régulé + Legal",
    sla: "Immédiat / 1h / 4h",
  },
];

async function OpsContent() {
  const { runbooks } = await getRunbooks();

  // Combine DB runbooks with defaults
  const allRunbooks =
    runbooks.length > 0
      ? runbooks
      : defaultRunbooks.map((r) => ({
          ...r,
          content: JSON.stringify(r.sections),
          isActive: true,
          version: "1.0",
          checklist: r.sections,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ops Kit (Runbooks)"
        description="Procédures opérationnelles pour le lancement et la gestion terrain"
        action={{ label: "Nouveau runbook" }}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-copper-500/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-copper-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {allRunbooks.length}
              </p>
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
              <p className="text-2xl font-bold text-zinc-100">3</p>
              <p className="text-sm text-zinc-400">Checklists</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">4</p>
              <p className="text-sm text-zinc-400">Niveaux escalade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">15 min</p>
              <p className="text-sm text-zinc-400">SLA L1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Runbooks grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {defaultRunbooks.map((runbook) => (
          <Card key={runbook.id} className="overflow-hidden">
            <CardHeader className="bg-zinc-900/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    {runbook.type === "venue_launch" ? (
                      <Wrench className="h-5 w-5 text-copper-400" />
                    ) : runbook.type === "incident" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Users className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{runbook.title}</CardTitle>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {runbook.description}
                    </p>
                  </div>
                </div>
                <Badge variant="default">{runbook.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto">
                {runbook.sections.map((section, sIdx) => (
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
              <div className="p-4 border-t border-zinc-800 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileDown className="h-4 w-4 mr-1" />
                  Export MD
                </Button>
                <Button variant="ghost" size="sm">
                  Éditer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Escalation matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-copper-400" />
            Matrice d&apos;Escalation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Catégorie
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Niveau 1
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Niveau 2
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Niveau 3
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    SLA (L1/L2/L3)
                  </th>
                </tr>
              </thead>
              <tbody>
                {escalationMatrix.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800 last:border-0">
                    <td className="py-3 px-4 text-zinc-200 font-medium">
                      {row.category}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{row.l1}</td>
                    <td className="py-3 px-4 text-zinc-400">{row.l2}</td>
                    <td className="py-3 px-4 text-zinc-400">{row.l3}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{row.sla}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OpsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      }
    >
      <OpsContent />
    </Suspense>
  );
}
