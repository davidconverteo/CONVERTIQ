
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createReportFromPrompt, ReportWidget } from '@/ai/flows/create-report-from-prompt';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { brandOptions, countryOptions, retailerOptions, gammeOptions } from '@/services/filters-data';

const reportSchema = z.object({
  prompt: z.string().min(10, { message: "Veuillez décrire le rapport souhaité (10 caractères min)." }),
});
type ReportFormValues = z.infer<typeof reportSchema>;

const suggestedAnalyses = [
  { id: "media-bilan", label: "Bilan média sur la dernière année" },
  { id: "retail-media-bilan", label: "Bilan retail media sur la dernière année" },
  { id: "growth-opps", label: "Opportunités de croissances commerciales" },
  { id: "customer-opps", label: "Opportunités client" },
  { id: "who-are-customers", label: "Qui sont mes clients" },
  { id: "digitalshelf-opt", label: "Optimisation digital shelf" },
];

const KpiWidget = ({ widget }: { widget: ReportWidget & { type: 'kpi' } }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{widget.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{widget.value}</p>
      {widget.trend && <p className="text-xs text-muted-foreground">{widget.trend}</p>}
    </CardContent>
  </Card>
);

const BarChartWidget = ({ widget }: { widget: ReportWidget & { type: 'barchart' } }) => {
    const COLORS = ['#4267B2', '#E1306C', '#FF0000', '#000000', '#6B7280'];
    return(
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={widget.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
};

const PieChartWidget = ({ widget }: { widget: ReportWidget & { type: 'piechart' } }) => {
    const COLORS = ['#1e293b', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];
    return (
      <Card>
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={widget.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {(widget.data as any[]).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
};


const SummaryWidget = ({ widget }: { widget: ReportWidget & { type: 'summary' } }) => (
  <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 md:col-span-full">
    <CardHeader className="flex-row items-start gap-3 space-y-0">
        <Sparkles className="h-5 w-5 text-blue-500 mt-1" />
        <div>
            <CardTitle className="text-blue-900 dark:text-blue-200">{widget.title}</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300 whitespace-pre-wrap">{widget.text}</CardDescription>
        </div>
    </CardHeader>
  </Card>
);


const SuggestedPromptsTab = ({ onPromptSelect, onActiveTabChange }: { onPromptSelect: (prompt: string) => void, onActiveTabChange: (tab: string) => void }) => {
    const [filters, setFilters] = useState({
        country: '',
        retailer: '',
        brand: '',
        gamme: ''
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({...prev, [filterName]: value}));
    }

    const handleAnalysisClick = (analysis: { id: string, label: string }) => {
        let prompt = analysis.label;
        const context = Object.entries(filters)
            .filter(([, value]) => value && value !== 'all')
            .map(([key, value]) => {
                const labels: Record<string, string> = { country: 'pour le pays', retailer: 'pour l\'enseigne', brand: 'pour la marque', gamme: 'pour la gamme'};
                const options = [...countryOptions, ...retailerOptions, ...brandOptions, ...gammeOptions];
                const selectedLabel = options.find(o => o.value === value)?.label || value;
                return `${labels[key]} ${selectedLabel}`;
            }).join(', ');
        
        if (context) {
            prompt += ` (${context})`;
        }
        
        onPromptSelect(prompt);
        onActiveTabChange('prompt');
    }

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-foreground mb-2">1. Définir le contexte (optionnel)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select onValueChange={(v) => handleFilterChange('country', v)}><SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger><SelectContent>{countryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                    <Select onValueChange={(v) => handleFilterChange('retailer', v)}><SelectTrigger><SelectValue placeholder="Enseigne" /></SelectTrigger><SelectContent>{retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                    <Select onValueChange={(v) => handleFilterChange('brand', v)}><SelectTrigger><SelectValue placeholder="Marque" /></SelectTrigger><SelectContent>{brandOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                    <Select onValueChange={(v) => handleFilterChange('gamme', v)}><SelectTrigger><SelectValue placeholder="Gamme" /></SelectTrigger><SelectContent>{gammeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-2">2. Choisir une analyse</h4>
                <div className="space-y-3">
                    {suggestedAnalyses.map((analysis) => (
                        <Button key={analysis.id} variant="outline" className="w-full h-auto text-wrap justify-start" onClick={() => handleAnalysisClick(analysis)}>
                            {analysis.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default function ReportCanvasPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<{ title: string; widgets: ReportWidget[] } | null>(null);
  const [activeTab, setActiveTab] = useState('prompt');

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { prompt: '' },
  });

  const handlePromptSelect = (prompt: string) => {
    form.setValue('prompt', prompt);
  };
  
  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsLoading(true);
    setReportData(null);
    toast({ title: "Génération du rapport en cours...", description: "L'IA analyse les données et construit votre canevas." });

    try {
      const result = await createReportFromPrompt({ prompt: data.prompt });
      setReportData(result);
      toast({ title: "Rapport généré !", description: "Votre canevas d'analyse est prêt." });
    } catch (error) {
      console.error("Report generation error:", error);
      toast({ variant: "destructive", title: "Erreur de génération", description: "L'IA n'a pas pu construire le rapport. Avez-vous configuré votre clé API ?" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderWidget = (widget: ReportWidget, index: number) => {
    const isLastWidget = index === (reportData?.widgets?.length ?? 0) - 1;
    // Force summary to span full width if it's the last item in a grid with an odd number of non-summary items
    const nonSummaryWidgets = reportData?.widgets.filter(w => w.type !== 'summary').length ?? 0;
    const forceSpan = widget.type === 'summary' && isLastWidget && nonSummaryWidgets % 2 !== 0;

    switch (widget.type) {
      case 'kpi': return <KpiWidget key={index} widget={widget} />;
      case 'barchart': return <BarChartWidget key={index} widget={widget} />;
      case 'piechart': return <PieChartWidget key={index} widget={widget} />;
      case 'summary': return <SummaryWidget key={index} widget={widget} />;
      default: return null;
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 sticky top-24">
        <CardHeader>
          <CardTitle>Générateur de Rapports</CardTitle>
          <CardDescription>Demandez à l'IA de construire une analyse sur mesure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompt">Prompt Personnalisé</TabsTrigger>
              <TabsTrigger value="suggestions">Prompt Suggéré</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt" className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre demande</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} placeholder="Crée un rapport comparant le ROAS de mes campagnes Social Media et TV en France..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Générer le Canevas
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="suggestions" className="pt-6">
                <SuggestedPromptsTab onPromptSelect={handlePromptSelect} onActiveTabChange={setActiveTab}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2">
        {isLoading && (
          <Card className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 font-semibold">Construction de votre rapport en cours...</p>
          </Card>
        )}
        {!isLoading && !reportData && (
          <Card className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">Le canevas d'analyse apparaîtra ici</p>
            <p className="text-sm">Utilisez le panneau de gauche pour commencer.</p>
          </Card>
        )}
        {reportData && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline">{reportData.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.widgets.map(renderWidget)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
