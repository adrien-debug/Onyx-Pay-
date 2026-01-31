"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LegalForm } from "@/components/forms/legal-form";
import { updateLegalDocStatus, deleteLegalDoc } from "@/lib/actions/legal";
import { getStatusColor, formatDate } from "@/lib/utils";
import {
  Scale,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Edit,
  Trash2,
} from "lucide-react";

type LegalDoc = {
  id: string;
  title: string;
  type: string;
  status: string;
  version: string;
  content: string | null;
  fileUrl: string | null;
  notes: string | null;
  updatedAt: Date;
};

export default function LegalPage() {
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDoc | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/legal");
    const data = await res.json();
    setDocs(data.docs || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (doc: LegalDoc) => {
    setEditingDoc(doc);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingDoc(null);
    fetchData();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateLegalDocStatus(id, status);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    await deleteLegalDoc(id);
    fetchData();
  };

  const byStatus = docs.reduce(
    (acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const signedDocs = byStatus["SIGNED"] || 0;
  const approvedDocs = byStatus["APPROVED"] || 0;
  const progress = docs.length > 0 
    ? Math.round(((signedDocs + approvedDocs) / docs.length) * 100) 
    : 0;

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
          <h1 className="text-2xl font-bold text-zinc-100">Legal & Contract Pack</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Documents juridiques et contrats pour le lancement Dubai
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      {/* Important notice */}
      <Card className="border-amber-800 bg-amber-900/10">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-300">
              Modèle White-Label Régulé
            </h4>
            <p className="text-sm text-amber-200/70 mt-1">
              ONYX est un fournisseur tech + hardware. Les services de paiement/crypto 
              sont fournis en white-label par un partenaire régulé (VARA Dubai + PSAN 
              Europe + EMI Irlande). ONYX n&apos;est pas l&apos;entité régulée.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-zinc-100">Progression légale</h3>
              <p className="text-sm text-zinc-400">Documents approuvés ou signés</p>
            </div>
            <span className="text-2xl font-bold text-copper-400">{progress}%</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-copper-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-copper-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{docs.length}</p>
              <p className="text-sm text-zinc-400">Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{signedDocs}</p>
              <p className="text-sm text-zinc-400">Signés</p>
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
                {byStatus["IN_REVIEW"] || 0}
              </p>
              <p className="text-sm text-zinc-400">En revue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {byStatus["DRAFT"] || 0}
              </p>
              <p className="text-sm text-zinc-400">Brouillons</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents list */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les documents</CardTitle>
        </CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Aucun document. Ajoutez votre premier document légal.
            </p>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-200">{doc.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-500 uppercase">
                          {doc.type}
                        </span>
                        <span className="text-xs text-zinc-500">
                          v{doc.version}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatDate(doc.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={doc.status}
                      onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                      className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                    >
                      <option value="DRAFT">Brouillon</option>
                      <option value="IN_REVIEW">En revue</option>
                      <option value="APPROVED">Approuvé</option>
                      <option value="SENT">Envoyé</option>
                      <option value="SIGNED">Signé</option>
                    </select>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LegalForm
        isOpen={isFormOpen}
        onClose={handleClose}
        doc={editingDoc}
      />
    </div>
  );
}
