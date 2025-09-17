'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter, MapPin, DollarSign, Eye, MousePointerClick, TrendingUp, CalendarDays, ChevronRight, Presentation, Sparkles, MoveRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateRetailMediaCampaignData, retailMediaPerformanceByRetailer } from '@/services/data-service';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';


const COLORS = ['#16a34a', '#0ea5e9', '#f97316', '#6366f1', '#f59e0b', '#84cc16'];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
    switch(status.toLowerCase()) {
        case 'en cours': return <Badge className="bg-blue-100 text-blue-800 border-blue-300">En cours</Badge>;
        case 'planifiée': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Planifiée</Badge>;
        case 'terminée': return <Badge className="bg-green-100 text-green-800 border-green-300">Terminée</Badge>;
        default: return null;
    }
};

const CampaignModal = ({ campaign }: { campaign: any }) => {
    if (!campaign) return null;
    
    const renderKpi = (label: string, value: string | number | null, unit: string = '') => {
        if (value === null || value === undefined) return null;
        const formattedValue = typeof value === 'number' ? value.toLocaleString('fr-FR') : value;
        return (
            <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground">{formattedValue}{unit}</p>
            </div>
        );
    };

    const kpiHtml: { [key: string]: (d: any) => React.ReactNode[] } = {
        'Sponsored Products': (d: any) => [renderKpi('ACoS', d.acos), renderKpi('Clics', d.clicks), renderKpi('CTR', d.ctr), renderKpi('CPC Moyen', d.cpc)],
        'Display On-site': (d: any) => [renderKpi('Impressions', d.impressions), renderKpi('Visibilité', d.viewability), renderKpi('CTR', d.ctr), renderKpi('Brand Uplift', d.brand_uplift)],
        'Audience Extension': (d: any) => [renderKpi('Portée', d.reach), renderKpi('CPM', d.cpm), renderKpi('ROAS', campaign.roas, 'x'), renderKpi('Sales Lift Off-site', d.offsite_sales_lift)],
        'Animation Magasin': (d: any) => [renderKpi('Uplift Ventes', d.sales_uplift_vs_control, '%'), renderKpi('Visiteurs Engagés', d.visitors_engaged), renderKpi('Coût / Visiteur', d.cost_per_visitor), renderKpi('Magasins Participants', d.stores_participating)],
        'Coupons': (d: any) => [renderKpi('Taux de Rédemption', d.estimated_redemption || d.redemption_rate, '%'), renderKpi('Coupons Distribués', d.coupons_distributed), renderKpi('Valeur Offre', d.offer_value)],
        'Sponsored Brands': (d: any) => [renderKpi('Impressions', d.impressions)],
        'Display Off-site': (d: any) => [renderKpi('Portée', d.reach), renderKpi('CPM', d.cpm)],
    };

    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ShoppingCart /> {campaign.product} - {campaign.retailer}
                </DialogTitle>
                <DialogDescription>
                    {campaign.lever} | {new Date(campaign.start).toLocaleDateString('fr-FR')} - {new Date(campaign.end).toLocaleDateString('fr-FR')}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
                 <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Business</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderKpi('Dépense', campaign.spend, '€')}
                        {renderKpi('Ventes attribuées', campaign.sales_attributed, '€')}
                        {renderKpi('ROAS', campaign.roas, 'x')}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Média</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        { kpiHtml[campaign.lever as keyof typeof kpiHtml] ? kpiHtml[campaign.lever as keyof typeof kpiHtml](campaign.details) : <p>Données non disponibles.</p> }
                    </div>
                </div>
                 <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2">
                        <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={32} height={32} className="object-contain" />
                        <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                         <div>
                            <h4 className="font-semibold mb-1">À retenir</h4>
                             <ul className="list-disc pl-5 text-muted-foreground">
                                <li>Le ROAS de <strong>{campaign.roas.toFixed(1)}x</strong> est excellent pour ce type d'activation.</li>
                                <li>Le coût par clic (CPC) est de <strong>{campaign.details.cpc || 'N/A'}</strong>.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Nos recommandations</h4>
                             <ul className="list-disc pl-5 text-muted-foreground">
                                <li><strong>Optimiser :</strong> Tester un nouveau visuel pour cette campagne afin d'améliorer le CTR.</li>
                                <li><strong>Investir :</strong> Augmenter le budget de 10% sur les mots-clés les plus performants.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                            <Button variant="link" asChild className="p-0 h-auto">
                                <Link href="/digital-shelf">Analyser le positionnement sur le Digital Shelf <MoveRight className="ml-1" /></Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    )
};

const RetailPlanner = ({ campaigns }: { campaigns: any[] }) => {
    const year = 2024;
    const months = Array.from({length: 12}, (_, i) => new Date(year, i, 1).toLocaleString('fr-FR', { month: 'short' }));

    const getPosition = (date: Date) => ((date.getMonth() * 30 + date.getDate()) / 365) * 100;
    const getWidth = (start: Date, end: Date) => {
        const duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return (duration / 365) * 100;
    };

    const campaignsByProduct = campaigns.reduce((acc, campaign) => {
        (acc[campaign.product] = acc[campaign.product] || []).push(campaign);
        return acc;
    }, {});

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays /> Planning Annuel des Activations {year}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea>
                    <div className="relative" style={{minWidth: '800px'}}>
                        {/* Grid des mois */}
                        <div className="relative grid h-10 grid-cols-12 border-b">
                            {months.map(month => (
                                <div key={month} className="text-center text-xs font-semibold text-muted-foreground">{month.toUpperCase()}</div>
                            ))}
                        </div>

                        {/* Lignes de produits */}
                        <div className="mt-4 space-y-4">
                            {Object.entries(campaignsByProduct).map(([product, productCampaigns]: [string, any[]]) => (
                                <div key={product} className="relative h-12">
                                    <div className="absolute top-0 flex h-full w-full items-center border-b border-dashed">
                                        <p className="w-40 shrink-0 pr-4 text-right text-sm font-medium text-foreground">{product}</p>
                                    </div>
                                    {productCampaigns.map((campaign: any) => {
                                        const left = getPosition(new Date(campaign.start));
                                        const width = getWidth(new Date(campaign.start), new Date(campaign.end));
                                        const isTooSmall = width < 5;
                                        return (
                                            <Dialog key={`${campaign.id}-planner`}>
                                                <UITooltip>
                                                    <TooltipTrigger asChild>
                                                        <DialogTrigger asChild>
                                                            <div 
                                                                className="absolute top-0 flex h-10 items-center justify-start rounded-lg bg-primary/80 px-2 text-primary-foreground shadow transition-all hover:bg-primary cursor-pointer"
                                                                style={{ left: `${left}%`, width: `${width}%`, marginLeft: '10rem' /* 160px for product name */ }}
                                                            >
                                                                <Presentation className="h-5 w-5" />
                                                                {!isTooSmall && <span className="ml-2 truncate text-xs">{campaign.retailer}</span>}
                                                            </div>
                                                        </DialogTrigger>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-bold">{campaign.lever} - {campaign.retailer}</p>
                                                        <p>{new Date(campaign.start).toLocaleDateString('fr-FR')} - {new Date(campaign.end).toLocaleDateString('fr-FR')}</p>
                                                        <p>Budget: {campaign.spend.toLocaleString('fr-FR')}€</p>
                                                    </TooltipContent>
                                                </UITooltip>
                                                <CampaignModal campaign={campaign} />
                                            </Dialog>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

// --- Main Page Component ---

export default function RetailMediaPage() {
  const [campaignDataByCountry, setCampaignDataByCountry] = useState<any>(null);
  const [country, setCountry] = useState<'France' | 'USA' | 'Japan'>('France');
  const [retailer, setRetailer] = useState('all');
  const [brand, setBrand] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
        const data = await generateRetailMediaCampaignData();
        setCampaignDataByCountry(data);
    }
    fetchData();
  }, []);

  if (!campaignDataByCountry) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p>Loading data...</p>
      </div>
    );
  }

  const currentCampaigns = campaignDataByCountry[country]
      .filter((c: any) => retailer === 'all' || c.retailer === retailer)
      .filter((c: any) => brand === 'all' || c.brand === brand);
  
  const currentRetailerPerf = retailMediaPerformanceByRetailer[country];
  
  const availableRetailers = ['all', ...Array.from(new Set(campaignDataByCountry[country].map((c: any) => c.retailer)))];
  const availableBrands = ['all', ...Array.from(new Set(campaignDataByCountry[country].map((c: any) => c.brand)))];

  const aggregatedKpis = currentCampaigns.reduce((acc: any, campaign: any) => {
    if (campaign.status.toLowerCase() !== 'planifiée') {
        acc.spend += campaign.spend || 0;
        acc.sales_attributed += campaign.sales_attributed || 0;
    }
    return acc;
  }, { spend: 0, sales_attributed: 0 });

  const globalRoi = aggregatedKpis.spend > 0 ? (aggregatedKpis.sales_attributed / aggregatedKpis.spend) : 0;
  
  const currentBudget = currentCampaigns.reduce((acc: any, campaign: any) => {
        if(campaign.spend) {
            const existing = acc.find((item: any) => item.name === campaign.lever);
            if (existing) {
                existing.value += campaign.spend;
            } else {
                acc.push({ name: campaign.lever, value: campaign.spend });
            }
        }
        return acc;
    }, [] as {name: string, value: number}[]);


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2"><MapPin /> Vue par Pays</CardTitle>
                        <CardDescription>Sélectionnez un pays, une enseigne et une marque pour filtrer les données.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <Select onValueChange={(val: 'France' | 'USA' | 'Japan') => { setCountry(val); setRetailer('all'); setBrand('all'); }} value={country}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pays" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="USA">États-Unis</SelectItem>
                                <SelectItem value="Japan">Japon</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setRetailer} value={retailer}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Enseigne" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableRetailers.map(r => <SelectItem key={r as string} value={r as string}>{(r as string) === 'all' ? 'Toutes les enseignes' : r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setBrand} value={brand}>
                             <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Marque" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableBrands.map(b => <SelectItem key={b as string} value={b as string}>{(b as string) === 'all' ? 'Toutes les marques' : b}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
        </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="campaigns">Détail des Activations</TabsTrigger>
          <TabsTrigger value="planning">Planning Média</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                        <DollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{aggregatedKpis.spend.toLocaleString('fr-FR')}</div>
                        <p className="text-xs text-muted-foreground">sur les activations actives/terminées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventes Attribuées</CardTitle>
                        <ShoppingCart />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{aggregatedKpis.sales_attributed.toLocaleString('fr-FR')}</div>
                        <p className="text-xs text-muted-foreground">CA généré par les activations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROAS Global</CardTitle>
                        <TrendingUp />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{globalRoi.toFixed(2)}x</div>
                        <p className="text-xs text-muted-foreground">Retour sur investissement publicitaire</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Performance par Enseigne</CardTitle>
                        <CardDescription>Comparaison du Retour sur Investissement (ROI) et Coût par Acquisition (CPA).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={currentRetailerPerf}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="retailer" />
                                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="ROI" fill="hsl(var(--primary))" name="ROI" />
                                <Bar yAxisId="right" dataKey="CPA" fill="hsl(var(--accent))" name="CPA (€)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Allocation Budgétaire</CardTitle>
                        <CardDescription>Répartition des dépenses par type d'activation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={currentBudget} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    {currentBudget.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`€${value.toLocaleString('fr-FR')}`, name]}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="flex-row items-center gap-2">
                    <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={32} height={32} className="object-contain" />
                    <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">À retenir</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Le ROAS global Retail Media en {country} est de <strong>{globalRoi.toFixed(2)}x</strong>.</li>
                            <li>Les campagnes "<strong>Sponsored Products</strong>" sur <strong>Amazon</strong> s'avèrent les plus rentables.</li>
                            <li>Les activations chez <strong>Unlimitail</strong> montrent un fort potentiel de conversion, surtout pour la Gamme Bio.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Nos recommandations</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li><strong>Intensifier :</strong> Augmenter les investissements sur les "Sponsored Products" chez Amazon pour les produits à forte marge.</li>
                            <li><strong>Accélérer :</strong> Augmenter la fréquence des campagnes "Coupons" sur Unlimitail pour recruter sur la Gamme Végétale.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                        <Button variant="link" asChild className="p-0 h-auto">
                            <Link href="/report-canvas">Demander une analyse détaillée des performances Retail Media <MoveRight className="ml-1" /></Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Détail des Activations pour: {country}</CardTitle>
                    <CardDescription>Cliquez sur une activation pour voir ses performances détaillées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activation</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Enseigne / Levier</TableHead>
                                <TableHead className="text-right">Dépense</TableHead>
                                <TableHead className="text-right">ROAS</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                            {currentCampaigns.length > 0 ? currentCampaigns.map((campaign: any) => (
                                <Dialog key={campaign.id}>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">{campaign.product}</div>
                                            <div className="text-sm text-muted-foreground">{campaign.brand}</div>
                                        </TableCell>
                                        <TableCell>{new Date(campaign.start).toLocaleDateString('fr-FR')} - {new Date(campaign.end).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{campaign.retailer}</span>
                                                <span className="text-xs text-muted-foreground">{campaign.lever}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">€{(campaign.spend || 0).toLocaleString('fr-FR')}</TableCell>
                                        <TableCell className={`text-right font-bold ${campaign.roas && campaign.roas > 4 ? 'text-green-600' : 'text-amber-600'}`}>
                                            {campaign.roas ? `${campaign.roas.toFixed(1)}x` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-center"><StatusBadge status={campaign.status} /></TableCell>
                                        <TableCell className="text-right">
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    Détails <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                        </TableCell>
                                    </TableRow>
                                    <CampaignModal campaign={campaign} />
                                </Dialog>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        Aucune donnée d'activation disponible pour cette sélection.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="mt-6">
            <RetailPlanner campaigns={currentCampaigns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
