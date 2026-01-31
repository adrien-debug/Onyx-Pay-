"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HardwareForm } from "@/components/forms/hardware-form";
import { setHardwareRecommendation, deleteHardwareCandidate } from "@/lib/actions/hardware";
import { getStatusColor } from "@/lib/utils";
import {
  Cpu,
  Box,
  Package,
  Plus,
  Star,
  DollarSign,
  Trash2,
  Edit,
  Check,
} from "lucide-react";

type HardwareCandidate = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  price: number | null;
  currency: string;
  availability: string | null;
  specs: string | null;
  constraints: string | null;
  fieldNotes: string | null;
  score: number | null;
  recommendation: string | null;
  status: string;
};

function ScoreStars({ score }: { score: number | null }) {
  if (!score) return <span className="text-zinc-600 text-sm">Non noté</span>;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.round(score / 2)
              ? "text-copper-400 fill-copper-400"
              : "text-zinc-700"
          }`}
        />
      ))}
      <span className="text-sm text-zinc-400 ml-1">{score}/10</span>
    </div>
  );
}

export default function HardwarePage() {
  const [candidates, setCandidates] = useState<HardwareCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState<HardwareCandidate | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/hardware");
    const data = await res.json();
    setCandidates(data.candidates || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (hw: HardwareCandidate) => {
    setEditingHardware(hw);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingHardware(null);
    fetchData();
  };

  const handleSetPrimary = async (id: string) => {
    await setHardwareRecommendation(id, "PRIMARY");
    fetchData();
  };

  const handleSetBackup = async (id: string) => {
    await setHardwareRecommendation(id, "BACKUP");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce device ?")) return;
    await deleteHardwareCandidate(id);
    fetchData();
  };

  const primaryDevice = candidates.find((c) => c.recommendation === "PRIMARY");
  const backupDevice = candidates.find((c) => c.recommendation === "BACKUP");

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
          <h1 className="text-2xl font-bold text-zinc-100">Hardware Research Hub</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Devices Android, coques, supports et bundles pour le lancement
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau device
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-copper-500/20 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-copper-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{candidates.length}</p>
              <p className="text-sm text-zinc-400">Devices évalués</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {primaryDevice ? "Oui" : "Non"}
              </p>
              <p className="text-sm text-zinc-400">Device primaire</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Box className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {backupDevice ? "Oui" : "Non"}
              </p>
              <p className="text-sm text-zinc-400">Device backup</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {candidates.filter((c) => c.score && c.score >= 7).length}
              </p>
              <p className="text-sm text-zinc-400">Score 7+</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary & Backup highlight */}
      {(primaryDevice || backupDevice) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {primaryDevice && (
            <Card className="border-copper-800 bg-gradient-to-br from-copper-900/20 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-copper-400 fill-copper-400" />
                  Device Primaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold text-zinc-100">
                  {primaryDevice.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {primaryDevice.brand} {primaryDevice.model}
                </p>
                <div className="mt-4">
                  <ScoreStars score={primaryDevice.score} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-zinc-500" />
                  <span className="text-lg font-semibold text-zinc-200">
                    {primaryDevice.price} {primaryDevice.currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          {backupDevice && (
            <Card className="border-zinc-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-zinc-400" />
                  Device Backup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold text-zinc-100">
                  {backupDevice.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {backupDevice.brand} {backupDevice.model}
                </p>
                <div className="mt-4">
                  <ScoreStars score={backupDevice.score} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-zinc-500" />
                  <span className="text-lg font-semibold text-zinc-200">
                    {backupDevice.price} {backupDevice.currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* All candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les devices candidats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">
                Aucun device candidat. Ajoutez votre premier device.
              </p>
            ) : (
              candidates.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-zinc-700 flex items-center justify-center">
                      <Cpu className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-zinc-200">
                          {device.name}
                        </h4>
                        {device.recommendation === "PRIMARY" && (
                          <Badge variant="copper">Primaire</Badge>
                        )}
                        {device.recommendation === "BACKUP" && (
                          <Badge variant="info">Backup</Badge>
                        )}
                        {device.recommendation === "REJECTED" && (
                          <Badge variant="danger">Rejeté</Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {device.brand} {device.model}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <ScoreStars score={device.score} />
                        {device.price && (
                          <span className="text-sm text-zinc-400">
                            {device.price} {device.currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(device.status)}>
                      {device.status.replace("_", " ")}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {device.recommendation !== "PRIMARY" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetPrimary(device.id)}
                        >
                          Primaire
                        </Button>
                      )}
                      {device.recommendation !== "BACKUP" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetBackup(device.id)}
                        >
                          Backup
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(device)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(device.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <HardwareForm
        isOpen={isFormOpen}
        onClose={handleClose}
        hardware={editingHardware}
      />
    </div>
  );
}
