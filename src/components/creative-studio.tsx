

"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from 'next/image';
import { createPromptFromFileUpload } from "@/ai/flows/create-prompt-from-file-upload";
import { generateMarketingImage } from "@/ai/flows/generate-marketing-image-from-prompt";
import { adaptCreativeContentForPlatform } from "@/ai/flows/adapt-creative-content-for-platform";
import { editMarketingImage } from "@/ai/flows/edit-marketing-image";
import { fileToDataUri } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Palette, Loader2, Wand2, UploadCloud, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const fileListSchema = typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional();

const promptExamples = [
    "Photo réaliste d'un yaourt aux fruits rouges sur une table en bois rustique, baigné d'une douce lumière matinale.",
    "Visuel de yaourt Skyr sur fond uni et moderne, mettant en avant la texture épaisse et riche, style épuré.",
    "Image publicitaire dynamique d'une famille heureuse partageant un petit-déjeuner sain avec des yaourts bio.",
    "Composition artistique et colorée avec des fruits frais et des pots de yaourt, vue de dessus (flat lay)."
];

const targetChannelsByCategory = [
    {
        category: "Formats les plus courants",
        channels: [
            { id: 'rect_medium_300x250', label: 'Rectangle moyen (300x250)' },
            { id: 'leaderboard_728x90', label: 'Leaderboard (728x90)' },
            { id: 'rect_large_336x280', label: 'Grand rectangle (336x280)' },
            { id: 'skyscraper_wide_160x600', label: 'Large gratte-ciel (160x600)' },
            { id: 'mobile_leaderboard_320x50', label: 'Leaderboard mobile (320x50)' },
        ]
    },
    {
        category: "Bannières Google Ads",
        channels: [
            { id: 'square_250x250', label: 'Carré (250x250)' },
            { id: 'leaderboard_large_970x90', label: 'Grand Leaderboard (970x90)' },
            { id: 'half_page_300x600', label: 'Demi-page (300x600)' },
            { id: 'skyscraper_120x600', label: 'Gratte-ciel (120x600)' },
            { id: 'small_square_200x200', label: 'Petit carré (200x200)' },
        ]
    },
    {
        category: "Réseaux Sociaux",
        channels: [
            { id: 'instagram_square_1080x1080', label: 'Post Instagram/Facebook (1080x1080)' },
            { id: 'instagram_story_1080x1920', label: 'Story Instagram/Facebook (1080x1920)' },
            { id: 'facebook_feed_1200x628', label: 'Image de flux Facebook (1200x628)' },
        ]
    },
];

const allChannels = targetChannelsByCategory.flatMap(c => c.channels);


const briefSchema = z.object({
  prompt: z.string().optional(),
  inspirationFile: fileListSchema,
  logoFile: fileListSchema,
  guidelinesFile: fileListSchema,
  baseImageFile: fileListSchema,
  editPrompt: z.string().optional(),
});


type BriefFormValues = z.infer<typeof briefSchema>;

export default function CreativeStudio() {
  const { toast } = useToast();
  const [creationMode, setCreationMode] = useState<"generate" | "upload">("generate");
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adaptations, setAdaptations] = useState<Record<string, { imageUrl: string; text: string; isLoading: boolean }>>({});
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ inspiration: string | null; logo: string | null; guidelines: string | null, baseImage: string | null }>({ inspiration: null, logo: null, guidelines: null, baseImage: null });

  const briefForm = useForm<BriefFormValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
        prompt: "",
        logoFile: undefined,
        inspirationFile: undefined,
        guidelinesFile: undefined,
        baseImageFile: undefined,
        editPrompt: ""
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof previews) => {
    const file = e.target.files?.[0];
    if (file) {
      const fieldToUpdate = fieldName === 'inspiration' ? 'inspirationFile' : fieldName === 'logo' ? 'logoFile' : fieldName === 'guidelines' ? 'guidelinesFile' : 'baseImageFile';
      briefForm.setValue(fieldToUpdate, e.target.files as FileList);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviews(p => ({ ...p, [fieldName]: result }));
        if (fieldName === 'baseImage' && creationMode === 'upload') {
           setBaseImage(result);
           setAdaptations({});
        }
      };
      reader.readAsDataURL(file);
    } else {
       const fieldToUpdate = fieldName === 'inspiration' ? 'inspirationFile' : fieldName === 'logo' ? 'logoFile' : fieldName === 'guidelines' ? 'guidelinesFile' : 'baseImageFile';
      briefForm.setValue(fieldToUpdate, undefined);
      setPreviews(p => ({ ...p, [fieldName]: null }));
        if (fieldName === 'baseImage') {
            setBaseImage(null);
        }
    }
  };
  
  const handleGenerationSubmit: SubmitHandler<BriefFormValues> = async (data) => {
    setIsGenerating(true);
    setBaseImage(null);
    setAdaptations({});

    try {
        let finalPrompt = data.prompt || "";
        
        if (!finalPrompt && !data.inspirationFile?.[0]) {
             toast({ variant: "destructive", title: "Aucun prompt ou inspiration", description: "Veuillez décrire l'image ou fournir une inspiration." });
             setIsGenerating(false);
             return;
        }

        const inspirationFile = data.inspirationFile?.[0];
        if (inspirationFile) {
            toast({ title: "Analyse de l'inspiration...", description: "Génération d'un prompt amélioré." });
            const dataUri = await fileToDataUri(inspirationFile);
            const promptResponse = await createPromptFromFileUpload({
                fileDataUri: dataUri,
                userPrompt: finalPrompt,
            });
            finalPrompt = promptResponse.prompt;
            briefForm.setValue('prompt', finalPrompt);
            toast({ title: "Prompt amélioré", description: "Le nouveau prompt est prêt pour la génération." });
        }

        toast({ title: "Génération en cours...", description: "Création de l'image de base, veuillez patienter." });
        const imageResponse = await generateMarketingImage({ prompt: finalPrompt });
        setBaseImage(imageResponse.imageUrl);
        toast({ title: "Image de base générée !", description: "Vous pouvez maintenant l'éditer ou l'adapter." });

    } catch (error) {
        console.error("Image generation error:", error);
        toast({ variant: "destructive", title: "Erreur de génération", description: "Une erreur est survenue. Avez-vous configuré votre clé API ?" });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleEditSubmit: SubmitHandler<BriefFormValues> = async (data) => {
    const editPrompt = data.editPrompt;
    if (!baseImage || !editPrompt) {
        toast({ variant: "destructive", title: "Éléments manquants", description: "Veuillez avoir une image de base et une instruction de modification."});
        return;
    }

    setIsEditing(true);
    try {
        toast({ title: "Modification de l'image...", description: "Application de vos instructions, veuillez patienter." });
         const editResponse = await editMarketingImage({
             baseImage: baseImage,
             editInstruction: editPrompt
         });
         setBaseImage(editResponse.editedImageUrl);
         briefForm.setValue("editPrompt", "");
         toast({ title: "Image modifiée !", description: "La modification a été appliquée. Vous pouvez continuer à l'éditer ou la décliner." });

    } catch (error) {
        console.error("Image editing error:", error);
        toast({ variant: "destructive", title: "Erreur de modification", description: "Une erreur est survenue. Avez-vous configuré votre clé API ?" });
    } finally {
        setIsEditing(false);
    }
  };

  const handleAdaptation = async () => {
    if (!baseImage) {
        toast({ variant: "destructive", title: "Image manquante", description: "Veuillez générer ou uploader une image de base." });
        return;
    }
    if(selectedChannels.length === 0) {
        toast({ variant: "destructive", title: "Aucun canal sélectionné", description: "Veuillez choisir au moins un format à générer." });
        return;
    }

    const logoFile = briefForm.getValues("logoFile")?.[0];
    const logoDataUri = logoFile ? await fileToDataUri(logoFile) : undefined;
    
    const guidelinesFile = briefForm.getValues("guidelinesFile")?.[0];
    const brandGuidelinesDataUri = guidelinesFile ? await fileToDataUri(guidelinesFile) : undefined;

    const initialAdaptations: Record<string, { imageUrl: string; text: string; isLoading: boolean }> = {};
    selectedChannels.forEach(channelId => {
        initialAdaptations[channelId] = { imageUrl: "", text: "", isLoading: true };
    });
    setAdaptations(initialAdaptations);

    selectedChannels.forEach(async (channelId) => {
        const channelLabel = allChannels.find(c => c.id === channelId)?.label || channelId;
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
            <CardDescription>Définissez votre point de départ pour générer ou uploader le visuel principal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...briefForm}>
              <form className="space-y-6">
                <Tabs value={creationMode} onValueChange={(value) => setCreationMode(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate">Générer une image</TabsTrigger>
                    <TabsTrigger value="upload">Utiliser une image existante</TabsTrigger>
                  </TabsList>
                  <TabsContent value="generate" className="pt-6">
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
                  </TabsContent>
                  <TabsContent value="upload" className="pt-6 space-y-6">
                     <FormField
                        control={briefForm.control}
                        name="baseImageFile"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Uploader votre image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'baseImage')}
                                        {...fieldProps}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                      />
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-foreground">Ressources de marque (optionnel)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creationMode === 'generate' && (
                         <FormField
                          control={briefForm.control}
                          name="inspirationFile"
                          render={({ field: { onChange, ...fieldProps } }) => (
                              <FormItem>
                                  <FormLabel>Inspiration visuelle</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(e, 'inspiration')}
                                          {...fieldProps}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                        />
                    )}

                    <FormField
                      control={briefForm.control}
                      name="logoFile"
                      render={({ field: { onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'logo')}
                                {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={briefForm.control}
                      name="guidelinesFile"
                      render={({ field: { onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Charte Graphique</FormLabel>
                          <FormControl>
                            <Input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, 'guidelines')}
                                {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="flex justify-center gap-4 min-h-[68px]">
                      {previews.inspiration && creationMode === 'generate' && <Image src={previews.inspiration} alt="Inspiration" width={60} height={60} className="object-contain rounded-md border p-1" />}
                      {previews.logo && <Image src={previews.logo} alt="Logo" width={60} height={60} className="object-contain rounded-md border p-1" />}
                      {previews.guidelines && previews.guidelines.startsWith('data:image') && <Image src={previews.guidelines} alt="Charte" width={60} height={60} className="object-contain rounded-md border p-1" />}
                  </div>
                    
                  {creationMode === 'generate' && (
                     <Button type="button" onClick={briefForm.handleSubmit(handleGenerationSubmit)} className="w-full" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Générer l'Image
                      </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-3">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Palette className="h-6 w-6 text-accent" />2. Adaptation &amp; Finalisation</CardTitle>
            <CardDescription>Modifiez l'image principale, puis générez les déclinaisons pour vos canaux de diffusion.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] lg:min-h-[600px]">
            {isGenerating ? (
                <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="mt-4 font-semibold">Génération de l'image en cours...</p>
                </div>
            ) : !baseImage ? (
                <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
                    <Palette className="mx-auto h-12 w-12" /><p className="mt-4 font-semibold">En attente du brief créatif</p><p className="text-sm">L'image principale apparaîtra ici.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Image Principale</h3>
                        <div className="relative">
                            <Image src={baseImage} alt="Image de base générée ou modifiée" width={400} height={400} className="rounded-lg object-cover shadow-lg" />
                            {isEditing && <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                        </div>
                        
                        <Form {...briefForm}>
                          <form onSubmit={briefForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                            <FormField
                              control={briefForm.control}
                              name="editPrompt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instruction de modification (optionnel)</FormLabel>
                                  <FormControl><Textarea {...field} rows={2} placeholder="Ex: ajoute un fond de cuisine moderne et lumineux" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full" disabled={isEditing || !briefForm.watch('editPrompt')}>
                                {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                                Appliquer la Modification
                            </Button>
                          </form>
                        </Form>

                        
                    </div>
                    <div className="space-y-4">
                         <h3 className="font-semibold">Choisir les formats et décliner</h3>
                         <Accordion type="multiple" className="w-full">
                          {targetChannelsByCategory.map(category => (
                            <AccordionItem value={category.category} key={category.category}>
                              <AccordionTrigger>{category.category}</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 pl-2">
                                  {category.channels.map(channel => (
                                    <div key={channel.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={channel.id} 
                                            checked={selectedChannels.includes(channel.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedChannels(prev => checked ? [...prev, channel.id] : prev.filter(id => id !== channel.id));
                                            }}
                                        />
                                        <label htmlFor={channel.id} className="text-sm font-medium leading-none">{channel.label}</label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>

                        <Button onClick={handleAdaptation} className="w-full" disabled={Object.values(adaptations).some(a => a.isLoading)}>
                            <Wand2 className="mr-2 h-4 w-4" /> Générer les Déclinaisons
                        </Button>
                         <div className="space-y-6 pt-4 max-h-[400px] overflow-y-auto pr-2">
                            {Object.keys(adaptations).length === 0 && <p className="text-sm text-muted-foreground">Les déclinaisons apparaîtront ici.</p>}
                            {allChannels.filter(channel => adaptations[channel.id]).map(channel => {
                                const adaptation = adaptations[channel.id];
                                return (
                                    <div key={channel.id} className="space-y-2">
                                        <h4 className="font-medium text-sm">{channel.label}</h4>
                                        {adaptation.isLoading ? (
                                            <div className="flex items-center justify-center w-full rounded-lg bg-muted min-h-[150px]"><Loader2 className="h-6 w-6 animate-spin" /></div>
                                        ) : adaptation.imageUrl ? (
                                            <>
                                                <Image src={adaptation.imageUrl} alt={`Adaptation pour ${channel.label}`} width={0} height={0} sizes="100vw" className="w-full h-auto rounded-lg border" />
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
