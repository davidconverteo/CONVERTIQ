"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { editMarketingImage } from "@/ai/flows/edit-marketing-image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, UploadCloud, Wand2 } from "lucide-react";
import { Textarea } from "./ui/textarea";

const variationFilters = [
  { id: "noel", label: "Thème de Noël", prompt: "Ajoute une ambiance de Noël festive à cette image, avec des décorations subtiles comme des branches de sapin, des lumières douces et une touche de rouge et d'or." },
  { id: "black_friday", label: "Bannière Black Friday", prompt: "Transforme cette image pour une campagne Black Friday. Ajoute un fond sombre et élégant, du texte 'Black Friday' en gras, et des éléments graphiques percutants." },
  { id: "nouveau", label: "Badge 'Nouveau'", prompt: "Ajoute un badge ou un ruban élégant avec le mot 'Nouveau' sur l'image, de manière visible mais bien intégrée." },
  { id: "epure", label: "Ambiance Épurée", prompt: "Simplifie l'arrière-plan de cette image pour un style très épuré et moderne. Utilise une couleur de fond unie et neutre et assure-toi que le produit est le seul point focal." },
  { id: "rustique", label: "Style Rustique", prompt: "Donne à cette image une ambiance rustique. Ajoute un fond en bois texturé, une lumière chaude et naturelle, et des éléments comme du lin ou des fleurs séchées." },
  { id: "ete", label: "Décor Estival", prompt: "Adapte cette image pour l'été. Ajoute un arrière-plan ensoleillé, peut-être une plage floue ou un jardin verdoyant, et une lumière vive et joyeuse." },
];

type Variation = {
  id: string;
  originalPrompt: string;
  imageUrl: string;
  isLoading: boolean;
};

export default function ImageVariationsStudio() {
  const { toast } = useToast();
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [refineStates, setRefineStates] = useState<Record<string, { prompt: string; isLoading: boolean }>>({});

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUri = await fileToDataUri(file);
        setBaseImage(dataUri);
        setVariations([]); // Reset variations when a new image is uploaded
        setRefineStates({});
      } catch (error) {
        toast({ variant: "destructive", title: "Erreur de Fichier", description: "Impossible de lire le fichier image." });
      }
    }
  };

  const handleGenerateVariation = async (filter: typeof variationFilters[0]) => {
    if (!baseImage) {
      toast({ variant: "destructive", title: "Aucune image de base", description: "Veuillez d'abord uploader une image." });
      return;
    }

    const variationId = `${filter.id}-${Date.now()}`;
    const newVariation: Variation = {
      id: variationId,
      originalPrompt: filter.label,
      imageUrl: "",
      isLoading: true,
    };
    setVariations(prev => [...prev, newVariation]);

    try {
      const result = await editMarketingImage({
        baseImage,
        editInstruction: filter.prompt,
      });

      setVariations(prev => prev.map(v => v.id === variationId ? { ...v, imageUrl: result.editedImageUrl, isLoading: false } : v));
    } catch (error) {
      console.error("Variation generation error:", error);
      toast({ variant: "destructive", title: `Erreur pour "${filter.label}"`, description: "La génération a échoué. Veuillez réessayer." });
      setVariations(prev => prev.filter(v => v.id !== variationId));
    }
  };

  const handleRefinePromptChange = (id: string, prompt: string) => {
    setRefineStates(prev => ({ ...prev, [id]: { ...prev[id], prompt } }));
  };

  const handleRefine = async (variation: Variation) => {
    const refinePrompt = refineStates[variation.id]?.prompt;
    if (!refinePrompt) {
      toast({ variant: "destructive", title: "Aucune instruction", description: "Veuillez entrer une instruction pour affiner l'image." });
      return;
    }

    setRefineStates(prev => ({ ...prev, [variation.id]: { ...prev[variation.id], isLoading: true } }));

    try {
      const result = await editMarketingImage({
        baseImage: variation.imageUrl,
        editInstruction: refinePrompt,
      });

      setVariations(prev => prev.map(v => v.id === variation.id ? { ...v, imageUrl: result.editedImageUrl } : v));
      toast({ title: "Image affinée !", description: "La modification a été appliquée." });
    } catch (error) {
      console.error("Refinement error:", error);
      toast({ variant: "destructive", title: "Erreur d'affinement", description: "La modification a échoué." });
    } finally {
      setRefineStates(prev => ({ ...prev, [variation.id]: { ...prev[variation.id], isLoading: false } }));
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl"><UploadCloud className="h-6 w-6 text-accent" />1. Image de Base</CardTitle>
          <CardDescription>Uploadez le visuel que vous souhaitez décliner.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="file" accept="image/*" onChange={handleFileChange} className="max-w-md" />
          {baseImage && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Visuel actuel :</h3>
              <Image src={baseImage} alt="Image de base" width={200} height={200} className="rounded-lg border shadow-md" />
            </div>
          )}
        </CardContent>
      </Card>

      {baseImage && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Sparkles className="h-6 w-6 text-accent" />2. Galerie de Variations</CardTitle>
              <CardDescription>Choisissez un ou plusieurs filtres IA à appliquer à votre image.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {variationFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleGenerateVariation(filter)}
                  className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <p className="font-semibold">{filter.label}</p>
                  <p className="text-sm text-muted-foreground">{filter.prompt.substring(0, 70)}...</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {variations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Palette className="h-6 w-6 text-accent" />3. Résultats & Affinements</CardTitle>
                <CardDescription>Vos images déclinées. Vous pouvez les affiner avec une nouvelle instruction.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {variations.map(v => (
                  <div key={v.id} className="space-y-3">
                    <h4 className="font-semibold text-center">{v.originalPrompt}</h4>
                    <div className="relative aspect-square w-full">
                      {v.isLoading ? (
                        <div className="flex items-center justify-center h-full w-full rounded-lg bg-muted">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <Image src={v.imageUrl} alt={`Variation: ${v.originalPrompt}`} layout="fill" className="object-contain rounded-lg border" />
                      )}
                    </div>
                    <div className="space-y-2">
                       <Textarea
                         placeholder="Affiner ce visuel (ex: 'déplace le badge en bas à droite')..."
                         value={refineStates[v.id]?.prompt || ""}
                         onChange={(e) => handleRefinePromptChange(v.id, e.target.value)}
                         disabled={v.isLoading || refineStates[v.id]?.isLoading}
                       />
                       <Button onClick={() => handleRefine(v)} size="sm" className="w-full" disabled={v.isLoading || refineStates[v.id]?.isLoading}>
                         {refineStates[v.id]?.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                         Affiner
                       </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
