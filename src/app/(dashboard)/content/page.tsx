"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveContentItem, deleteContentItem } from "@/lib/actions/content";
import { formatDate } from "@/lib/utils";
import {
  FileCode,
  Upload,
  Sparkles,
  Copy,
  Check,
  FileText,
  Globe,
  HelpCircle,
  DollarSign,
  Megaphone,
  Trash2,
  Save,
  Eye,
} from "lucide-react";

type ContentItem = {
  id: string;
  title: string | null;
  type: string;
  rawHtml: string;
  extractedJson: string | null;
  markdownProposal: string | null;
  tags: string | null;
  status: string;
  createdAt: Date;
};

function extractFromHtml(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const extract = {
    title: doc.querySelector("title")?.textContent || "",
    h1: Array.from(doc.querySelectorAll("h1")).map((el) => el.textContent),
    h2: Array.from(doc.querySelectorAll("h2")).map((el) => el.textContent),
    paragraphs: Array.from(doc.querySelectorAll("p"))
      .map((el) => el.textContent)
      .filter((t) => t && t.length > 50)
      .slice(0, 10),
    links: Array.from(doc.querySelectorAll("a[href]"))
      .map((el) => ({
        text: el.textContent,
        href: el.getAttribute("href"),
      }))
      .filter((l) => l.text && l.text.length > 2)
      .slice(0, 10),
    ctas: Array.from(
      doc.querySelectorAll("button, .btn, [class*='button'], a[class*='cta']")
    )
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .slice(0, 5),
  };

  return extract;
}

function generateMarkdownProposal(extract: ReturnType<typeof extractFromHtml>) {
  let md = "# Proposition Structurée\n\n";

  if (extract.h1.length > 0) {
    md += "## Headlines Principales\n";
    extract.h1.forEach((h) => {
      md += `- ${h}\n`;
    });
    md += "\n";
  }

  if (extract.h2.length > 0) {
    md += "## Sections Identifiées\n";
    extract.h2.forEach((h) => {
      md += `- ${h}\n`;
    });
    md += "\n";
  }

  if (extract.paragraphs.length > 0) {
    md += "## Contenu Principal\n";
    extract.paragraphs.slice(0, 3).forEach((p) => {
      md += `> ${p?.slice(0, 200)}...\n\n`;
    });
  }

  if (extract.ctas.length > 0) {
    md += "## CTAs Détectés\n";
    extract.ctas.forEach((cta) => {
      md += `- "${cta}"\n`;
    });
    md += "\n";
  }

  md += "---\n\n";
  md += "## Recommandations de Structure\n\n";
  md += "### Option 1: Page Produit\n";
  md += "1. Hero avec headline principale\n";
  md += "2. Section \"Comment ça marche\"\n";
  md += "3. Avantages clés (3-4 points)\n";
  md += "4. Social proof / témoignages\n";
  md += "5. CTA principal\n\n";

  md += "### Option 2: Landing Page\n";
  md += "1. Proposition de valeur unique\n";
  md += "2. Problem/Solution\n";
  md += "3. Features highlights\n";
  md += "4. Pricing preview\n";
  md += "5. Contact / Demo request\n\n";

  md += "### Option 3: Documentation\n";
  md += "1. Overview\n";
  md += "2. Getting Started\n";
  md += "3. Features détaillées\n";
  md += "4. FAQ\n";
  md += "5. Support\n";

  return md;
}

const contentTypeIcons: Record<string, React.ElementType> = {
  WEBSITE: Globe,
  FAQ: HelpCircle,
  PITCH: Megaphone,
  PRICING: DollarSign,
  OTHER: FileText,
};

export default function ContentPage() {
  const [htmlInput, setHtmlInput] = useState("");
  const [contentType, setContentType] = useState("WEBSITE");
  const [contentTitle, setContentTitle] = useState("");
  const [extractedData, setExtractedData] = useState<ReturnType<typeof extractFromHtml> | null>(null);
  const [markdownProposal, setMarkdownProposal] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedItems, setSavedItems] = useState<ContentItem[]>([]);
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/content");
    const data = await res.json();
    setSavedItems(data.items || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleExtract = () => {
    if (!htmlInput.trim()) return;

    const extracted = extractFromHtml(htmlInput);
    setExtractedData(extracted);
    setMarkdownProposal(generateMarkdownProposal(extracted));
    if (extracted.title && !contentTitle) {
      setContentTitle(extracted.title);
    }
  };

  const handleSave = async () => {
    if (!extractedData || !markdownProposal) return;

    setIsSaving(true);
    try {
      await saveContentItem({
        title: contentTitle || "Sans titre",
        type: contentType,
        rawHtml: htmlInput,
        extractedJson: JSON.stringify(extractedData),
        markdownProposal,
        tags: [contentType.toLowerCase()],
      });

      // Reset form
      setHtmlInput("");
      setContentTitle("");
      setExtractedData(null);
      setMarkdownProposal("");
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce contenu ?")) return;
    await deleteContentItem(id);
    fetchItems();
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ContentIcon = contentTypeIcons[contentType] || FileText;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Content Scanner</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Ingérer et structurer le contenu HTML existant (Webflow, site web)
          </p>
        </div>
      </div>

      {/* Input section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-copper-400" />
            HTML / Contenu à analyser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Nom du contenu"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Type de contenu</Label>
                <Select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="mt-1"
                >
                  <option value="WEBSITE">Site Web / Page</option>
                  <option value="FAQ">FAQ</option>
                  <option value="PITCH">Pitch / Présentation</option>
                  <option value="PRICING">Pricing</option>
                  <option value="OTHER">Autre</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload .html
                </Button>
              </div>
            </div>

            <div>
              <Label>Coller le HTML ici</Label>
              <Textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<html>...</html>"
                className="mt-1 min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button onClick={handleExtract} variant="premium" disabled={!htmlInput.trim()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyser & Extraire
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extraction results */}
      {extractedData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extracted data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ContentIcon className="h-5 w-5 text-copper-400" />
                Données Extraites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {extractedData.title && (
                <div>
                  <Label className="text-zinc-500">Titre</Label>
                  <p className="text-zinc-200 mt-1">{extractedData.title}</p>
                </div>
              )}

              {extractedData.h1.length > 0 && (
                <div>
                  <Label className="text-zinc-500">H1</Label>
                  <div className="mt-1 space-y-1">
                    {extractedData.h1.map((h, i) => (
                      <p key={i} className="text-zinc-200">{h}</p>
                    ))}
                  </div>
                </div>
              )}

              {extractedData.h2.length > 0 && (
                <div>
                  <Label className="text-zinc-500">Sections (H2)</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {extractedData.h2.map((h, i) => (
                      <Badge key={i} variant="default">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {extractedData.ctas.length > 0 && (
                <div>
                  <Label className="text-zinc-500">CTAs détectés</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {extractedData.ctas.map((cta, i) => (
                      <Badge key={i} variant="copper">{cta}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Markdown proposal */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-copper-400" />
                Proposition Structurée
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(markdownProposal)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-900 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                  {markdownProposal}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saved content items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contenus sauvegardés</CardTitle>
          <Badge variant="default">{savedItems.length} items</Badge>
        </CardHeader>
        <CardContent>
          {savedItems.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              Aucun contenu sauvegardé. Analysez du HTML pour créer des propositions.
            </p>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item) => {
                const ItemIcon = contentTypeIcons[item.type] || FileText;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                        <ItemIcon className="h-5 w-5 text-copper-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-200">
                          {item.title || "Sans titre"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="default">{item.type}</Badge>
                          <span className="text-xs text-zinc-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingItem(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Viewing modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingItem(null)}
          />
          <div className="relative w-full max-w-4xl mx-4 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-100">
                {viewingItem.title || "Sans titre"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setViewingItem(null)}>
                Fermer
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="bg-zinc-800 rounded-lg p-4">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                  {viewingItem.markdownProposal}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
