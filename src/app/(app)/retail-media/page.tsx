
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter, MapPin, DollarSign, Eye, MousePointerClick, TrendingUp, CalendarDays, ChevronRight, Presentation } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Données enrichies ---

const campaignDataByCountry = {
  France: [
    { id: 'RM-FR-01', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-07-15'), end: new Date('2024-08-15'), retailer: 'Unlimitail', lever: 'Sponsored Products', objective: 'Visibilité', status: 'Terminée', roas: 5.1, sales_attributed: 45000, spend: 8824, details: { type: 'Sponsored Products', acos: '19.6%', clicks: 12500, ctr: '1.2%', cpc: '0.85€', recommendation: "Le ROAS est excellent. Augmenter le budget sur les mots-clés les plus performants pour maximiser la part de voix." }},
    { id: 'RM-FR-02', brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date('2024-08-01'), end: new Date('2024-08-31'), retailer: 'Amazon Ads', lever: 'Display On-site', objective: 'Notoriété', status: 'En cours', roas: 2.8, sales_attributed: 22000, spend: 7857, details: { type: 'Display On-site', impressions: 2500000, viewability: '75%', ctr: '0.45%', brand_uplift: '15%', recommendation: "La visibilité est bonne mais le CTR est faible. Tester de nouvelles créations visuelles pour améliorer l'engagement." }},
    { id: 'RM-FR-03', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-09-05'), end: new Date('2024-09-07'), retailer: 'Carrefour', lever: 'Animation Magasin', objective: 'Recrutement', status: 'Terminée', sales_uplift: 25, sales_attributed: 54000, spend: 5400, details: { type: 'Animation Magasin', stores_participating: 50, cost_per_visitor: '4.50€', sales_uplift_vs_control: '25%', recommendation: "Forte augmentation des ventes dans les magasins participants. Envisager un déploiement national pour le prochain trimestre." }},
    { id: 'RM-FR-04', brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: new Date('2024-10-01'), end: new Date('2024-10-31'), retailer: 'Système U', lever: 'Coupons', objective: 'Fidélisation', status: 'Planifiée', roas: null, sales_attributed: null, spend: 25000, details: { type: 'Coupons', coupons_distributed: 500000, estimated_redemption: '5%', offer_value: '0.50€', recommendation: "Le ciblage sur les acheteurs existants devrait renforcer la fidélité. Suivre le taux de rédemption de près." }},
  ],
  USA: [
    { id: 'RM-US-01', brand: 'Gourdes Enfant', product: 'Gourde Fraise-Banane', start: new Date('2024-07-10'), end: new Date('2024-08-10'), retailer: 'Walmart Connect', lever: 'Sponsored Products', objective: 'Conversion', status: 'Terminée', roas: 6.2, sales_attributed: 120000, spend: 19355, details: { type: 'Sponsored Products', acos: '16.1%', clicks: 45000, ctr: '2.1%', cpc: '1.10$', recommendation: "Performance exceptionnelle. Le produit résonne bien avec la clientèle de Walmart. Le CPC reste maîtrisé." }},
    { id: 'RM-US-02', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-08-01'), end: new Date('2024-08-31'), retailer: 'Instacart Ads', lever: 'Audience Extension', objective: 'Recrutement', status: 'En cours', roas: 3.5, sales_attributed: 65000, spend: 18571, details: { type: 'Audience Extension', reach: 1200000, cpm: '8.50$', offsite_sales_lift: '12%', recommendation: "Bonne portée de la campagne. Mesurer l'impact sur la part de marché chez les nouveaux acheteurs à la fin de la campagne." }},
  ],
  Japan: [
     { id: 'RM-JP-01', brand: 'Gamme Végétale', product: 'Dessert Soja Chocolat', start: new Date('2024-09-01'), end: new Date('2024-09-30'), retailer: 'Rakuten Ads', lever: 'Coupons', objective: 'Essai Produit', status: 'Planifiée', roas: null, sales_attributed: null, spend: 14000, details: { type: 'Coupons', coupons_distributed: 1000000, estimated_redemption: '8%', offer_value: '50 JPY', recommendation: "Levier clé pour pénétrer le marché japonais. L'offre agressive devrait stimuler l'essai." }}
  ]
};

const performanceByRetailer = {
  France: [ { retailer: 'Unlimitail', ROI: 5.1, CPA: 0.71 }, { retailer: 'Amazon Ads', ROI: 2.8, CPA: 1.25 }, { retailer: 'Carrefour', ROI: 10, CPA: 0.8 }, { retailer: 'Système U', ROI: 4, CPA: 1.0 } ],
  USA: [ { retailer: 'Walmart Connect', ROI: 6.2, CPA: 0.43 }, { retailer: 'Instacart Ads', ROI: 3.5, CPA: 0.98 } ],
  Japan: [ { retailer: 'Rakuten Ads', ROI: 5.5, CPA: 0.5 } ]
};

const budgetAllocation = {
    France: [{name: 'Sponsored Products', value: 8824}, {name: 'Display On-site', value: 7857}, {name: 'Animation Magasin', value: 5400}, {name: 'Coupons', value: 25000}],
    USA: [{name: 'Sponsored Products', value: 19355}, {name: 'Audience Extension', value: 18571}],
    Japan: [{name: 'Coupons', value: 14000}],
};
const COLORS = ['#16a34a', '#0ea5e9', '#f97316', '#6366f1', '#f59e0b'];

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
        return (
            <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}{unit}</p>
            </div>
        );
    };

    const kpiHtml = {
        'Sponsored Products': (d: any) => `${renderKpi('ACoS', d.acos)} ${renderKpi('Clics', d.clicks?.toLocaleString('fr-FR'))} ${renderKpi('CTR', d.ctr)} ${renderKpi('CPC Moyen', d.cpc)}`,
        'Display On-site': (d: any) => `${renderKpi('Impressions', d.impressions?.toLocaleString('fr-FR'))} ${renderKpi('Visibilité', d.viewability)} ${renderKpi('CTR', d.ctr)} ${renderKpi('Brand Uplift', d.brand_uplift)}`,
        'Audience Extension': (d: any) => `${renderKpi('Portée', d.reach?.toLocaleString('fr-FR'))} ${renderKpi('CPM', d.cpm)} ${renderKpi('Sales Lift Off-site', d.offsite_sales_lift)}`,
        'Animation Magasin': (d: any) => `${renderKpi('Uplift Ventes', d.sales_uplift_vs_control, '%')} ${renderKpi('Visiteurs Engagés', d.visitors_engaged?.toLocaleString('fr-FR'))} ${renderKpi('Coût / Visiteur', d.cost_per_visitor)}`,
        'Coupons': (d: any) => `${renderKpi('Taux de Rédemption', d.estimated_redemption || d.redemption_rate, '%')} ${renderKpi('Coupons Distribués', d.coupons_distributed?.toLocaleString('fr-FR'))} ${renderKpi('Valeur Offre', d.offer_value)}`
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
                        {kpiHtml[campaign.lever as keyof typeof kpiHtml] ? kpiHtml[campaign.lever as keyof typeof kpiHtml](campaign.details) : <p>Données non disponibles.</p>}
                    </div>
                </div>
                 <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2 space-y-0">
                        <CardTitle className="text-lg">Recommandation IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                           {campaign.details.recommendation}
                        </p>
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
                <CardContent className="space-y-6 overflow-x-auto p-4">
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
                                        const left = getPosition(campaign.start);
                                        const width = getWidth(campaign.start, campaign.end);
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
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

// --- Main Page Component ---

export default function RetailMediaPage() {
  const [country, setCountry] = useState<'France' | 'USA' | 'Japan'>('France');
  const [retailer, setRetailer] = useState('all');

  const currentCampaigns = campaignDataByCountry[country]
      .filter(c => retailer === 'all' || c.retailer === retailer);
  
  const currentRetailerPerf = performanceByRetailer[country];
  const currentBudget = budgetAllocation[country];
  const availableRetailers = ['all', ...Array.from(new Set(campaignDataByCountry[country].map(c => c.retailer)))];

  const aggregatedKpis = currentCampaigns.reduce((acc, campaign) => {
    if (campaign.status.toLowerCase() !== 'planifiée') {
        acc.spend += campaign.spend || 0;
        acc.sales_attributed += campaign.sales_attributed || 0;
    }
    return acc;
  }, { spend: 0, sales_attributed: 0 });

  const globalRoi = aggregatedKpis.spend > 0 ? (aggregatedKpis.sales_attributed / aggregatedKpis.spend) : 0;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2"><MapPin /> Vue par Pays</CardTitle>
                        <CardDescription>Sélectionnez un pays et une enseigne pour filtrer les données.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <Select onValueChange={(val: 'France' | 'USA' | 'Japan') => { setCountry(val); setRetailer('all'); }} value={country}>
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
                                {availableRetailers.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'Toutes les enseignes' : r}</SelectItem>)}
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
                                <Pie data={currentBudget} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {currentBudget.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`€${value.toLocaleString('fr-FR')}`, name]}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
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
                            {currentCampaigns.length > 0 ? currentCampaigns.map(campaign => (
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
