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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Palette, Loader2, UploadCloud, FileImage, Wand2 } from "lucide-react";

const platforms = ["Facebook", "Instagram", "Google Ads", "TikTok", "LinkedIn"];
const formats = ["PNG", "JPEG", "SVG"];

const generationSchema = z.object({
  prompt: z.string().min(10, { message: "Veuillez entrer une description d'au moins 10 caractères." }),
  inspirationFile: z.instanceof(FileList).optional(),
});

const adaptationSchema = z.object({
    logoFile: z.instanceof(FileList).optional(),
    outputFormat: z.enum(["PNG", "JPEG", "SVG"]),
    targetPlatform: z.string().min(1, { message: "Veuillez choisir une plateforme."}),
});

type GenerationFormValues = z.infer<typeof generationSchema>;
type AdaptationFormValues = z.infer<typeof adaptationSchema>;


export default function CreativeStudio() {
  const { toast } = useToast();
  const [generationState, setGenerationState] = useState({
    isLoading: false,
    imageUrl: "",
    adaptedContent: "",
  });
  const [adaptationLoading, setAdaptationLoading] = useState(false);
  const [inspirationFilePreview, setInspirationFilePreview] = useState<string | null>(null);
  const [logoFilePreview, setLogoFilePreview] = useState<string | null>(null);

  const generationForm = useForm<GenerationFormValues>({
    resolver: zodResolver(generationSchema),
    defaultValues: { prompt: "" },
  });

  const adaptationForm = useForm<AdaptationFormValues>({
    resolver: zodResolver(adaptationSchema),
    defaultValues: { outputFormat: "PNG" },
  });

  const handleGeneration: SubmitHandler<GenerationFormValues> = async (data) => {
    setGenerationState({ isLoading: true, imageUrl: "", adaptedContent: "" });
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
      setGenerationState((s) => ({ ...s, imageUrl: imageResponse.imageUrl }));
    } catch (error) {
      console.error("Image generation error:", error);
      toast({ variant: "destructive", title: "Erreur de Génération", description: "Impossible de générer l'image. Veuillez réessayer." });
    } finally {
      setGenerationState((s) => ({ ...s, isLoading: false }));
    }
  };
  
  const handleAdaptation: SubmitHandler<AdaptationFormValues> = async (data) => {
    if (!generationState.imageUrl) {
        toast({ variant: "destructive", title: "Erreur", description: "Veuillez d'abord générer une image." });
        return;
    }
    setAdaptationLoading(true);
    try {
        const logoFile = data.logoFile?.[0];
        let logoDataUri = "";
        if (logoFile) {
            logoDataUri = await fileToDataUri(logoFile);
        } else {
             toast({ variant: "destructive", title: "Logo manquant", description: "Veuillez fournir un logo pour l'adaptation." });
             setAdaptationLoading(false);
             return;
        }

        const response = await adaptCreativeContentForPlatform({
            creativeContent: generationState.imageUrl,
            targetPlatform: data.targetPlatform,
            logoDataUri: logoDataUri,
            outputFormat: data.outputFormat,
        });
        setGenerationState(s => ({ ...s, adaptedContent: response.adaptedContent }));

    } catch (error) {
        console.error("Content adaptation error:", error);
        toast({ variant: "destructive", title: "Erreur d'Adaptation", description: "Impossible d'adapter le contenu. Veuillez réessayer." });
    } finally {
        setAdaptationLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-5">
      <div className="space-y-8 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-accent" />
              1. Générer une Image
            </CardTitle>
            <CardDescription>
              Décrivez l'image que vous souhaitez créer ou inspirez l'IA avec un fichier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generationForm}>
              <form onSubmit={generationForm.handleSubmit(handleGeneration)} className="space-y-6">
                <FormField
                  control={generationForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Prompt)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Ex: Photo réaliste d'un yaourt aux fruits rouges sur une table en bois, avec une lumière matinale douce..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generationForm.control}
                  name="inspirationFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fichier d'inspiration (optionnel)</FormLabel>
                      <FormControl>
                        <div className="relative mt-2 flex justify-center rounded-lg border-2 border-dashed border-border px-6 py-10 hover:border-primary">
                          <div className="text-center">
                            {inspirationFilePreview ? (
                                <Image src={inspirationFilePreview} alt="Preview" width={80} height={80} className="mx-auto h-20 w-20 rounded-md object-cover" />
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            )}
                            <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                              <label htmlFor="inspiration-file-upload" className="relative cursor-pointer rounded-md font-semibold text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-accent/80">
                                <span>Chargez un fichier</span>
                                <Input {...field} id="inspiration-file-upload" type="file" className="sr-only" value={undefined} onChange={e => {
                                    field.onChange(e.target.files);
                                    if(e.target.files?.[0]) {
                                        setInspirationFilePreview(URL.createObjectURL(e.target.files[0]));
                                    } else {
                                        setInspirationFilePreview(null);
                                    }
                                }} />
                              </label>
                              <p className="pl-1">ou glissez-déposez</p>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF jusqu'à 10Mo</p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={generationState.isLoading}>
                  {generationState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Générer l'image
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className={!generationState.imageUrl ? 'opacity-50' : ''}>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                    <Wand2 className="h-6 w-6 text-accent" />
                    2. Adapter le Contenu
                </CardTitle>
                <CardDescription>
                    Optimisez votre visuel pour une plateforme spécifique et ajoutez votre logo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...adaptationForm}>
                    <form onSubmit={adaptationForm.handleSubmit(handleAdaptation)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={adaptationForm.control}
                            name="targetPlatform"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Plateforme</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!generationState.imageUrl}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={adaptationForm.control}
                            name="outputFormat"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!generationState.imageUrl}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {formats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <FormField
                            control={adaptationForm.control}
                            name="logoFile"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Importer un logo</FormLabel>
                                <FormControl>
                                    <div className={`mt-2 flex items-center gap-4 rounded-lg border-2 border-dashed p-4 ${!generationState.imageUrl ? 'cursor-not-allowed' : 'hover:border-primary'}`}>
                                        {logoFilePreview ? (
                                            <Image src={logoFilePreview} alt="Logo Preview" width={40} height={40} className="h-10 w-10 rounded-md object-contain" />
                                        ) : (
                                            <FileImage className="h-10 w-10 text-muted-foreground" />
                                        )}
                                        <div className="text-sm text-muted-foreground">
                                            <label htmlFor="logo-file-upload" className={`relative font-semibold ${!generationState.imageUrl ? 'text-muted-foreground' : 'cursor-pointer text-accent hover:text-accent/80'}`}>
                                                <span>{logoFilePreview ? 'Changer le logo' : 'Choisir un fichier'}</span>
                                                <Input {...field} id="logo-file-upload" type="file" className="sr-only" value={undefined} disabled={!generationState.imageUrl} onChange={e => {
                                                    field.onChange(e.target.files);
                                                    if(e.target.files?.[0]) {
                                                        setLogoFilePreview(URL.createObjectURL(e.target.files[0]));
                                                    } else {
                                                        setLogoFilePreview(null);
                                                    }
                                                }}/>
                                            </label>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={!generationState.imageUrl || adaptationLoading}>
                           {adaptationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                           Adapter le contenu
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-3">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Palette className="h-6 w-6 text-accent" />
              Résultat
            </CardTitle>
            <CardDescription>
                Votre création générée par l'IA apparaîtra ici.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] lg:min-h-[600px]">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background/50 p-4">
              {generationState.isLoading ? (
                <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-semibold">L'artiste IA dessine votre image...</p>
                  <p className="text-sm">Ce processus peut prendre quelques instants.</p>
                </div>
              ) : generationState.imageUrl ? (
                <div className="flex w-full flex-col gap-6">
                    <div className="relative aspect-square w-full">
                        <Image src={generationState.imageUrl} alt="Generated creative" fill className="rounded-lg object-cover shadow-lg" />
                    </div>
                    {generationState.adaptedContent && (
                        <div className="rounded-lg border bg-background p-4">
                            <h4 className="font-headline text-lg font-semibold">Contenu Adapté :</h4>
                            <p className="mt-2 text-sm text-foreground/80">{generationState.adaptedContent}</p>
                        </div>
                    )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Palette className="mx-auto h-12 w-12" />
                  <p className="mt-4 font-semibold">En attente d'une description</p>
                  <p className="text-sm">Le résultat de votre création apparaîtra ici.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
