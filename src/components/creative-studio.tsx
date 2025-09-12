"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from 'next/image';
import { createPromptFromFileUpload } from "@/ai/flows/create-prompt-from-file-upload";
import { generateMarketingImage } from "@/ai/flows/generate-marketing-image-from-prompt";
import { adaptCreativeContentForPlatform } from "@/ai/flows/adapt-creative-content-for-platform";
import { fileToDataUri } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Palette, Loader2, Wand2 } from "lucide-react";

const fileListSchema = typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional();

const promptExamples = [
    "Photo réaliste d'un yaourt aux fruits rouges sur une table en bois rustique, baigné d'une douce lumière matinale.",
    "Visuel de yaourt Skyr sur fond uni et moderne, mettant en avant la texture épaisse et riche, style épuré.",
    "Image publicitaire dynamique d'une famille heureuse partageant un petit-déjeuner sain avec des yaourts bio.",
    "Composition artistique et colorée avec des fruits frais et des pots de yaourt, vue de dessus (flat lay)."
];

const targetChannels = [
    { id: 'instagram_post', label: 'Post Instagram (Carré)' },
    { id: 'facebook_story', label: 'Story Facebook (Vertical)' },
    { id: 'web_banner', label: 'Bannière Web (Large)' },
];

const briefSchema = z.object({
  prompt: z.string().min(10, { message: "Veuillez entrer une description d'au moins 10 caractères." }),
  inspirationFile: fileListSchema,
  logoFile: fileListSchema.refine((files) => files?.length === 1, { message: "Vous devez uploader un logo." }),
  guidelinesFile: fileListSchema,
});

type BriefFormValues = z.infer<typeof briefSchema>;

export default function CreativeStudio() {
  const { toast } = useToast();
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adaptations, setAdaptations] = useState<Record<string, { imageUrl: string; text: string; isLoading: boolean }>>({});
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ inspiration: string | null; logo: string | null; guidelines: string | null }>({ inspiration: null, logo: null, guidelines: null });

  const briefForm = useForm<BriefFormValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: { prompt: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof previews, formField: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(p => ({ ...p, [fieldName]: event.target?.result as any }));
      };
      reader.readAsDataURL(file);
      formField.onChange(e.target.files);
    } else {
      setPreviews(p => ({ ...p, [fieldName]: null }));
      formField.onChange(null);
    }
  };

  const handleBriefSubmit: SubmitHandler<BriefFormValues> = async (data) => {
    setIsGenerating(true);
    setBaseImage(null);
    setAdaptations({});
    try {
      let finalPrompt = data.prompt;
      const file = data.inspirationFile?.[0];

      if (file) {
        const dataUri = await fileToDataUri(file);
        const promptResponse = await createPromptFromFileUpload({
          fileDataUri: dataUri,
          userPrompt: data.prompt,
        });
        finalPrompt = promptResponse.prompt;
      }

      const imageResponse = await generateMarketingImage({ prompt: finalPrompt });
      setBaseImage(imageResponse.imageUrl);
      toast({ title: "Image de base générée !", description: "Vous pouvez maintenant l'adapter aux différents canaux." });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({ variant: "destructive", title: "Erreur de Génération", description: "Impossible de générer l'image. Avez-vous configuré votre clé API ?" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdaptation = async () => {
    const logoFile = briefForm.getValues("logoFile")?.[0];
    if (!baseImage || !logoFile) {
        toast({ variant: "destructive", title: "Éléments manquants", description: "Veuillez générer une image de base et fournir un logo." });
        return;
    }
    if(selectedChannels.length === 0) {
        toast({ variant: "destructive", title: "Aucun canal sélectionné", description: "Veuillez choisir au moins un format à générer." });
        return;
    }

    const logoDataUri = await fileToDataUri(logoFile);
    const guidelinesFile = briefForm.getValues("guidelinesFile")?.[0];
    let brandGuidelinesDataUri: string | undefined = undefined;
    if (guidelinesFile) {
        brandGuidelinesDataUri = await fileToDataUri(guidelinesFile);
    }

    const initialAdaptations: Record<string, { imageUrl: string; text: string; isLoading: boolean }> = {};
    selectedChannels.forEach(channelId => {
        initialAdaptations[channelId] = { imageUrl: "", text: "", isLoading: true };
    });
    setAdaptations(initialAdaptations);

    selectedChannels.forEach(async (channelId) => {
        const channelLabel = targetChannels.find(c => c.id === channelId)?.label || channelId;
        try {
            const response = await adaptCreativeContentForPlatform({
                baseImage,
                logoDataUri,
                brandGuidelinesDataUri,
                targetPlatform: channelLabel,
            });
            setAdaptations(prev => ({
                ...prev,
                [channelId]: { imageUrl: response.adaptedImageUrl, text: response.adaptedText, isLoading: false }
            }));
        } catch (error) {
            console.error(`Adaptation error for ${channelLabel}:`, error);
            toast({ variant: "destructive", title: `Erreur d'adaptation pour ${channelLabel}`, description: "Veuillez réessayer." });
            setAdaptations(prev => ({ ...prev, [channelId]: { ...prev[channelId], isLoading: false } }));
        }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-5">
      <div className="space-y-8 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Sparkles className="h-6 w-6 text-accent" />1. Brief Créatif</CardTitle>
            <CardDescription>Définissez le visuel, l'inspiration et les ressources de votre marque.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...briefForm}>
              <form onSubmit={briefForm.handleSubmit(handleBriefSubmit)} className="space-y-6">
                <FormField
                  control={briefForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Décrivez l'image souhaitée</FormLabel>
                      <FormControl><Textarea {...field} rows={4} placeholder={promptExamples[0]} /></FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground pt-2">Exemples:
                        <ul className="list-disc pl-5">
                           {promptExamples.slice(0,2).map(ex => <li key={ex}>{ex}</li>)}
                        </ul>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={briefForm.control} name="inspirationFile" render={({ field: { onChange, ...fieldProps } }) => ( <FormItem><FormLabel>Inspiration (Optionnel)</FormLabel><FormControl><Input {...fieldProps} type="file" accept="image/*" onChange={e => handleFileChange(e, 'inspiration', { onChange })}/></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={briefForm.control} name="logoFile" render={({ field: { onChange, ...fieldProps } }) => ( <FormItem><FormLabel>Logo</FormLabel><FormControl><Input {...fieldProps} type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo', { onChange })}/></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={briefForm.control} name="guidelinesFile" render={({ field: { onChange, ...fieldProps } }) => ( <FormItem><FormLabel>Charte Graphique</FormLabel><FormControl><Input {...fieldProps} type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, 'guidelines', { onChange })}/></FormControl><FormMessage /></FormItem> )} />
                </div>
                 <div className="flex justify-center gap-4 min-h-[68px]">
                    {previews.inspiration && <Image src={previews.inspiration} alt="Inspiration" width={60} height={60} className="object-contain rounded-md border p-1" />}
                    {previews.logo && <Image src={previews.logo} alt="Logo" width={60} height={60} className="object-contain rounded-md border p-1" />}
                    {previews.guidelines && <Image src={previews.guidelines} alt="Charte" width={60} height={60} className="object-contain rounded-md border p-1" />}
                </div>

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Générer l'Image de Base
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-3">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Palette className="h-6 w-6 text-accent" />2. Adaptation &amp; Finalisation</CardTitle>
            <CardDescription>Générez les déclinaisons pour vos canaux de diffusion.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] lg:min-h-[600px]">
            {isGenerating ? (
                <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="mt-4 font-semibold">Génération de l'image de base...</p>
                </div>
            ) : !baseImage ? (
                <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
                    <Palette className="mx-auto h-12 w-12" /><p className="mt-4 font-semibold">En attente du brief créatif</p><p className="text-sm">L'image de base générée apparaîtra ici.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Image de Base</h3>
                        <Image src={baseImage} alt="Image de base générée" width={400} height={400} className="rounded-lg object-cover shadow-lg" />
                        
                        <h3 className="font-semibold pt-4">Choisir les canaux</h3>
                        <div className="space-y-2">
                            {targetChannels.map((channel) => (
                                <div key={channel.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={channel.id} 
                                        onCheckedChange={(checked) => {
                                            setSelectedChannels(prev => checked ? [...prev, channel.id] : prev.filter(id => id !== channel.id));
                                        }}
                                    />
                                    <label htmlFor={channel.id} className="text-sm font-medium leading-none">{channel.label}</label>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleAdaptation} className="w-full" disabled={Object.values(adaptations).some(a => a.isLoading)}>
                            <Wand2 className="mr-2 h-4 w-4" /> Générer les Déclinaisons
                        </Button>
                    </div>
                    <div className="space-y-4">
                         <h3 className="font-semibold">Déclinaisons</h3>
                         <div className="space-y-6">
                            {Object.keys(adaptations).length === 0 && <p className="text-sm text-muted-foreground">Les déclinaisons apparaîtront ici.</p>}
                            {targetChannels.filter(c => adaptations[c.id]).map(channel => {
                                const adaptation = adaptations[channel.id];
                                return (
                                    <div key={channel.id} className="space-y-2">
                                        <h4 className="font-medium text-sm">{channel.label}</h4>
                                        {adaptation.isLoading ? (
                                            <div className="flex items-center justify-center aspect-square w-full rounded-lg bg-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
                                        ) : adaptation.imageUrl ? (
                                            <>
                                                <Image src={adaptation.imageUrl} alt={`Adaptation pour ${channel.label}`} width={300} height={300} className="rounded-lg object-contain border" />
                                                <p className="text-xs text-muted-foreground p-2 bg-muted rounded-md">{adaptation.text}</p>
                                            </>
                                        ) : null}
                                    </div>
                                )
                            })}
                         </div>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
