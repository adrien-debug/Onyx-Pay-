import { Suspense } from "react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Zap,
} from "lucide-react";
import { formatDate, getStatusColor, getRiskScoreColor, calculateRiskScore } from "@/lib/utils";

async function getStats() {
  const [
    totalTasks,
    tasksByStatus,
    blockedTasks,
    overdueTasks,
    upcomingTasks,
    milestones,
    risks,
    recentTasks,
  ] = await Promise.all([
    db.task.count(),
    db.task.groupBy({
      by: ["status"],
      _count: true,
    }),
    db.task.count({ where: { status: "BLOCKED" } }),
    db.task.count({
      where: {
        dueDate: { lt: new Date() },
        status: { notIn: ["DONE"] },
      },
    }),
    db.task.count({
      where: {
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        status: { notIn: ["DONE"] },
      },
    }),
    db.milestone.findMany({
      orderBy: { targetDate: "asc" },
      take: 5,
      include: { owner: true },
    }),
    db.risk.findMany({
      where: { status: { notIn: ["DONE"] } },
      orderBy: [{ impact: "desc" }, { probability: "desc" }],
      take: 5,
    }),
    db.task.findMany({
      where: { status: { notIn: ["DONE"] } },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 10,
      include: { assignee: true, workstream: true },
    }),
  ]);

  const statusCounts = tasksByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count;
      return acc;
    },
    {} as Record<string, number>
  );

  const doneTasks = statusCounts["DONE"] || 0;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    statusCounts,
    blockedTasks,
    overdueTasks,
    upcomingTasks,
    progress,
    milestones,
    risks,
    recentTasks,
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "copper",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color?: "copper" | "red" | "amber" | "emerald" | "blue";
}) {
  const colorClasses = {
    copper: "from-copper-500/20 to-transparent border-copper-800/50 text-copper-400",
    red: "from-red-500/20 to-transparent border-red-800/50 text-red-400",
    amber: "from-amber-500/20 to-transparent border-amber-800/50 text-amber-400",
    emerald: "from-emerald-500/20 to-transparent border-emerald-800/50 text-emerald-400",
    blue: "from-blue-500/20 to-transparent border-blue-800/50 text-blue-400",
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} card-hover`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">{value}</p>
            {trend && <p className="text-xs text-zinc-500 mt-1">{trend}</p>}
          </div>
          <div className="h-12 w-12 rounded-xl bg-zinc-800/50 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function DashboardContent() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            ONYX Dubai Launch - Septembre 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="copper" className="text-sm px-3 py-1">
            <Target className="h-3 w-3 mr-1" />
            {stats.progress}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-zinc-100">Progression du lancement</h3>
              <p className="text-sm text-zinc-400">Dubai - Septembre 2025</p>
            </div>
            <span className="text-2xl font-bold text-copper-400">{stats.progress}%</span>
          </div>
          <Progress value={stats.progress} />
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tâches totales"
          value={stats.totalTasks}
          icon={CheckSquare}
          trend={`${stats.statusCounts["DONE"] || 0} terminées`}
          color="copper"
        />
        <StatCard
          title="Bloquantes"
          value={stats.blockedTasks}
          icon={AlertTriangle}
          trend="Nécessitent une action"
          color="red"
        />
        <StatCard
          title="En retard"
          value={stats.overdueTasks}
          icon={Clock}
          trend="Date dépassée"
          color="amber"
        />
        <StatCard
          title="Cette semaine"
          value={stats.upcomingTasks}
          icon={Calendar}
          trend="7 prochains jours"
          color="blue"
        />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-5 gap-4">
        {["BACKLOG", "TODO", "IN_PROGRESS", "BLOCKED", "DONE"].map((status) => (
          <Card key={status} className="bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {stats.statusCounts[status] || 0}
              </p>
              <Badge className={`mt-2 ${getStatusColor(status)}`}>
                {status.replace("_", " ")}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-copper-400" />
              Prochaines actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentTasks.length === 0 ? (
                <p className="text-zinc-500 text-sm">Aucune tâche en cours</p>
              ) : (
                stats.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.workstream && (
                          <span className="text-xs text-zinc-500">
                            {task.workstream.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-zinc-500">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Registre des risques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.risks.length === 0 ? (
                <p className="text-zinc-500 text-sm">Aucun risque identifié</p>
              ) : (
                stats.risks.map((risk) => {
                  const score = calculateRiskScore(risk.probability, risk.impact);
                  return (
                    <div
                      key={risk.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {risk.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          P:{risk.probability} × I:{risk.impact}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getRiskScoreColor(score)}`}>
                          {score}
                        </span>
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-copper-400" />
              Jalons clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800" />

              <div className="space-y-4">
                {stats.milestones.length === 0 ? (
                  <p className="text-zinc-500 text-sm ml-10">Aucun jalon défini</p>
                ) : (
                  stats.milestones.map((milestone, index) => {
                    const isPast = new Date(milestone.targetDate) < new Date();
                    const isCompleted = !!milestone.completedAt;

                    return (
                      <div key={milestone.id} className="relative flex gap-4 ml-1">
                        {/* Dot */}
                        <div
                          className={`relative z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500"
                              : isPast
                              ? "bg-red-500 border-red-500"
                              : "bg-zinc-900 border-copper-500"
                          }`}
                        >
                          {isCompleted && (
                            <CheckSquare className="h-3 w-3 text-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-zinc-200">
                              {milestone.title}
                            </h4>
                            <span className="text-sm text-zinc-400">
                              {formatDate(milestone.targetDate)}
                            </span>
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-zinc-500 mt-1">
                              {milestone.description}
                            </p>
                          )}
                          {milestone.owner && (
                            <div className="flex items-center gap-1 mt-2">
                              <Users className="h-3 w-3 text-zinc-500" />
                              <span className="text-xs text-zinc-500">
                                {milestone.owner.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-800 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
