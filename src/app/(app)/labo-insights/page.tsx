
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, FlaskConical, Lightbulb, Loader2, PlayCircle, Sparkles, TestTube, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { simulateConsumerTest, SimulateConsumerTestOutput } from '@/ai/flows/simulate-consumer-test';
import { fileToDataUri } from '@/lib/utils';
import Image from 'next/image';

const testsRealises = [
  { id: 1, title: "Test d'Innovation : Skyr à Boire", type: "Concept Test", status: "Terminé", keyLearning: "Fort intérêt (72%), mais perception prix élevée. Ajuster le prix ou renforcer la communication sur la valeur nutritionnelle." },
  { id: 2, title: "Test de Copie Publicitaire : Campagne TV 'Plaisir Bio'", type: "Copy Test", status: "Terminé", keyLearning: "Le script focus 'gourmandise' a un meilleur potentiel de mémorisation. Recommandation : produire ce script." },
  { id: 3, title: "Test de Merchandising : Nouveau packaging Yaourt Grec", type: "Pack Test", status: "Terminé", keyLearning: "Le nouveau design augmente la visibilité de 18% mais est jugé moins 'authentique'. Itérer sur le design." },
  { id: 4, title: "Test de Prix : Yaourt Végétal Amande", type: "Pricing Test", status: "Terminé", keyLearning: "Une baisse de 0,15€ pourrait augmenter les volumes de 25% sans cannibaliser la gamme premium." },
  { id: 5, title: "Test d'Usage : Gourdes de fruits pour adultes", type: "Usage & Attitude", status: "Terminé", keyLearning: "Concept validé, mais le format est perçu comme 'enfantin'. Utiliser un design de packaging plus sobre." },
];

const fileListSchema = typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional();

const newTestSchema = z.object({
    title: z.string().min(5, { message: "Le titre doit faire au moins 5 caractères." }),
    objective: z.string().min(10, { message: "L'objectif doit faire au moins 10 caractères." }),
    script: z.string().optional(),
    file: fileListSchema,
    panel: z.string({ required_error: "Veuillez sélectionner une cible." }),
});

type NewTestFormValues = z.infer<typeof newTestSchema>;


const TestsRealisesTab = () => (
    <Card>
        <CardHeader>
            <CardTitle>Historique des Tests Réalisés</CardTitle>
            <CardDescription>Retrouvez les résultats et apprentissages clés des simulations précédentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Titre du Test</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Apprentissage Principal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {testsRealises.map((test) => (
                        <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.title}</TableCell>
                            <TableCell><Badge variant="secondary">{test.type}</Badge></TableCell>
                            <TableCell><Badge variant="default" className="bg-green-100 text-green-800">{test.status}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{test.keyLearning}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const NouveauTestTab = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [simulationResult, setSimulationResult] = useState<SimulateConsumerTestOutput | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const form = useForm<NewTestFormValues>({
        resolver: zodResolver(newTestSchema),
        defaultValues: { title: '', objective: '', script: '', file: undefined, panel: undefined },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('file', e.target.files as FileList);
            const reader = new FileReader();
            reader.onload = (event) => setFilePreview(event.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            form.setValue('file', undefined);
            setFilePreview(null);
        }
    };

    const onSubmit: SubmitHandler<NewTestFormValues> = async (data) => {
        setIsLoading(true);
        setSimulationResult(null);
        toast({ title: "Lancement de la simulation IA...", description: "L'analyse est en cours, veuillez patienter." });

        try {
            const file = data.file?.[0];
            const fileDataUri = file ? await fileToDataUri(file) : undefined;
            const fileType = file ? file.type : undefined;

            const result = await simulateConsumerTest({
                testTitle: data.title,
                testObjective: data.objective,
                targetPanel: data.panel,
                script: data.script,
                fileDataUri,
                fileType,
            });

            setSimulationResult(result);
            toast({ title: "Simulation terminée !", description: "Les résultats sont disponibles." });
        } catch (error) {
            console.error("Simulation error:", error);
            toast({ variant: "destructive", title: "Erreur de simulation", description: "Une erreur est survenue. Avez-vous configuré votre clé API ?" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Configurer un Nouveau Test</CardTitle>
                    <CardDescription>Remplissez les informations ci-dessous pour lancer une nouvelle simulation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Titre du Test</FormLabel><FormControl><Input placeholder="Ex: Test du nouveau logo Skyr" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="objective" render={({ field }) => (
                                <FormItem><FormLabel>Objectif</FormLabel><FormControl><Textarea placeholder="Ex: Valider l'attrait du nouveau logo vs. l'ancien" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="script" render={({ field }) => (
                                <FormItem><FormLabel>Script / Concept (optionnel)</FormLabel><FormControl><Textarea placeholder="Collez un script publicitaire, une description de concept..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Image / Vidéo (optionnel)</FormLabel>
                                        <FormControl><Input type="file" accept="image/*,video/*" onChange={handleFileChange} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {filePreview && filePreview.startsWith('data:image') && <Image src={filePreview} alt="Aperçu" width={100} height={100} className="rounded-md border object-cover" />}
                            {filePreview && filePreview.startsWith('data:video') && <video src={filePreview} controls width="250" className="rounded-md border" />}

                            <FormField control={form.control} name="panel" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cible (Panel)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un panel..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Tous France">Tous France</SelectItem>
                                            <SelectItem value="Familles avec enfants">Familles avec enfants</SelectItem>
                                            <SelectItem value="Jeunes Actifs 25-35 ans">Jeunes Actifs 25-35 ans</SelectItem>
                                            <SelectItem value="Seniors 65+">Seniors 65+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                                Lancer la Simulation
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Résultats de la Simulation IA</CardTitle>
                    <CardDescription>Les résultats générés par l'IA apparaîtront ici.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    {isLoading && (
                        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 font-semibold">Analyse en cours...</p>
                        </div>
                    )}
                    {!isLoading && !simulationResult && (
                        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
                            <TestTube className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">En attente d'un nouveau test</p>
                        </div>
                    )}
                    {simulationResult && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardTitle className="text-lg">Score d'Attrait Global</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-primary">{simulationResult.attractionScore}/100</p>
                                </CardContent>
                            </Card>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="text-green-500" /> Points Forts</h4>
                                    <p className="text-sm text-muted-foreground">{simulationResult.keyStrengths}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2"><Lightbulb className="text-yellow-500" /> Points Faibles</h4>
                                    <p className="text-sm text-muted-foreground">{simulationResult.keyWeaknesses}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Verbatims Consommateurs Simulés</h4>
                                <div className="space-y-3">
                                    {simulationResult.consumerVerbatims.map((verbatim, index) => (
                                        <div key={index} className="rounded-md border bg-muted/50 p-3 text-sm">
                                            <p className="italic">"{verbatim.quote}"</p>
                                            <p className="text-right font-medium text-muted-foreground">- {verbatim.profile}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground">Recommandation Stratégique IA</h4>
                                <p className="text-sm text-muted-foreground">{simulationResult.recommendation}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function LaboInsightsPage() {
    return (
        <Tabs defaultValue="tests-realises" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tests-realises">
                    <TestTube className="mr-2" />
                    Tests Réalisés
                </TabsTrigger>
                <TabsTrigger value="nouveau-test">
                    <FlaskConical className="mr-2" />
                    Nouveau Test
                </TabsTrigger>
            </TabsList>
            <TabsContent value="tests-realises" className="mt-6">
                <TestsRealisesTab />
            </TabsContent>
            <TabsContent value="nouveau-test" className="mt-6">
                <NouveauTestTab />
            </TabsContent>
        </Tabs>
    );
}

    