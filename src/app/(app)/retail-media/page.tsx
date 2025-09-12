
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter, MapPin, DollarSign, Eye, MousePointerClick, TrendingUp, CalendarDays, ChevronRight, Presentation, Sparkles } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Données enrichies ---

const campaignDataByCountry = {
  France: [
    // Always On Amazon
    { id: 'RM-FR-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 5.8, sales_attributed: 350000, spend: 60345, details: { type: 'Sponsored Products', acos: '17.2%', clicks: 180000, ctr: '1.5%', cpc: '0.34€', recommendation: "Campagne 'always-on' très performante. Maintenir le budget et optimiser la liste de mots-clés négatifs tous les mois." }},
    
    // Unlimitail - Gamme Bio
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Sponsored Products', 'Display On-site', 'Coupons'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-FR-U-GB-${i+1}`, brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date(2024, i, 15), end: new Date(2024, i, 28), retailer: 'Unlimitail', lever: lever, objective: i % 2 === 0 ? 'Visibilité' : 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 4.5 + Math.random() * 2, sales_attributed: 30000 + Math.random() * 15000, spend: 6000 + Math.random() * 3000, details: { acos: `${(18 + Math.random()*5).toFixed(1)}%`, recommendation: `Campagne ${i+1} (${lever}) pour la Gamme Bio.` }
      };
    }),
    // Unlimitail - Dessert Soja
     ...Array.from({ length: 5 }, (_, i) => {
      const levers = ['Display Off-site', 'Sponsored Products'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-FR-U-DS-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date(2024, i*2, 10), end: new Date(2024, i*2, 24), retailer: 'Unlimitail', lever: lever, objective: 'Considération', status: i < 4 ? 'Terminée' : 'Planifiée', roas: 3.0 + Math.random() * 1.5, sales_attributed: 15000 + Math.random() * 10000, spend: 4500 + Math.random() * 2000, details: { reach: 800000, recommendation: `Vague ${i+1} de la campagne ${lever}.` }
      };
    }),

    // Amazon Ads - Skyr
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Display On-site', 'Sponsored Brands', 'Sponsored Products'];
      const lever = levers[i % levers.length];
      return {
      id: `RM-FR-A-S-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Amazon Ads', lever: lever, objective: 'Notoriété', status: i < 8 ? 'Terminée' : 'En cours', roas: 2.5 + Math.random(), sales_attributed: 20000 + Math.random() * 5000, spend: 8000 + Math.random() * 2000, details: { impressions: 2500000, recommendation: `Campagne mensuelle ${i+1} (${lever}) pour le Skyr.`}
    }}),
     ...Array.from({ length: 8 }, (_, i) => {
      const levers = ['Sponsored Brands', 'Display On-site'];
      const lever = levers[i % levers.length];
      return {
      id: `RM-FR-A-SF-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Fruits', start: new Date(2024, i+2, 5), end: new Date(2024, i+2, 25), retailer: 'Amazon Ads', lever: lever, objective: 'Notoriété', status: i < 6 ? 'Terminée' : 'Planifiée', roas: 3.5 + Math.random(), sales_attributed: 15000 + Math.random() * 5000, spend: 4000 + Math.random() * 1000, details: { impressions: 1000000, recommendation: `Lancement Skyr Fruits (${lever}), vague ${i+1}.` }
    }}),

    // Carrefour
    ...Array.from({ length: 6 }, (_, i) => {
        const levers = ['Animation Magasin', 'Coupons', 'Display On-site'];
        const lever = levers[i % levers.length];
        return {
      id: `RM-FR-C-${i+1}`, brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date(2024, i*2, 5), end: new Date(2024, i*2, 18), retailer: 'Carrefour', lever: lever, objective: 'Recrutement', status: 'Terminée', roas: 10 + Math.random()*5, sales_attributed: 50000 + Math.random()*10000, spend: 5000 + Math.random()*1000, details: { sales_uplift_vs_control: `${(20+Math.random()*10).toFixed(0)}%`, recommendation: `Activation ${lever} ${i+1}.` }
    }}),
    
    // Système U
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `RM-FR-SU-${i+1}`, brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: new Date(2024, i, 1), end: new Date(2024, i, 30), retailer: 'Système U', lever: 'Coupons', objective: 'Fidélisation', status: i<9 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: 30000 + Math.random()*10000, spend: 8000 + Math.random()*2000, details: { estimated_redemption: `${(4+Math.random()*2).toFixed(1)}%`, recommendation: `Offre couponing mensuelle ${i+1}.` }
    })),
  ],
  USA: [
     // Always On Amazon
    { id: 'RM-US-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 6.5, sales_attributed: 850000, spend: 130769, details: { type: 'Sponsored Products', acos: '15.4%', clicks: 450000, ctr: '2.0%', cpc: '0.95$', recommendation: "Excellent ROAS pour une campagne 'always-on'. La part de voix est dominante sur les mots-clés principaux." }},
    // Walmart Connect
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Sponsored Products', 'Display On-site'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-US-W-GE-${i+1}`, brand: 'Gourdes Enfant', product: 'Gourde Fraise-Banane', start: new Date(2024, i, 10), end: new Date(2024, i, 24), retailer: 'Walmart Connect', lever: lever, objective: 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 6 + Math.random(), sales_attributed: 100000 + Math.random()*20000, spend: 16000 + Math.random()*3000, details: { acos: `${(15+Math.random()*2).toFixed(1)}%`, recommendation: `Campagne ${lever} ${i+1} pour les gourdes.`}
      }
    }),
    // Instacart Ads
    ...Array.from({ length: 8 }, (_, i) => {
        const levers = ['Audience Extension', 'Sponsored Products'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-I-GB-${i+1}`, brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date(2024, i+1, 1), end: new Date(2024, i+1, 28), retailer: 'Instacart Ads', lever: lever, objective: 'Recrutement', status: i < 7 ? 'Terminée' : 'En cours', roas: 3.5 + Math.random(), sales_attributed: 60000 + Math.random()*10000, spend: 17000 + Math.random()*2000, details: { offsite_sales_lift: `${(10+Math.random()*4).toFixed(1)}%`, recommendation: `Campagne de recrutement ${lever} ${i+1}.` }
        }
    }),
    // Kroger Precision Marketing
    ...Array.from({ length: 4 }, (_, i) => {
        const levers = ['Coupons', 'Display On-site'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-K-SN-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date(2024, i*3, 1), end: new Date(2024, i*3, 30), retailer: 'Kroger Precision Marketing', lever: lever, objective: 'Essai', status: i < 3 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: null, spend: 40000 + Math.random()*5000, details: { estimated_redemption: `${(5+Math.random()*2).toFixed(1)}%`, recommendation: `Campagne couponing trimestrielle ${i+1}.` }
        }
    }),
     // Amazon Ads - Gamme Végétale
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Display On-site', 'Sponsored Products', 'Sponsored Brands'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-A-GV-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Amande', start: new Date(2024, i, 15), end: new Date(2024, i, 30), retailer: 'Amazon Ads', lever: lever, objective: 'Considération', status: i < 8 ? 'Terminée' : 'En cours', roas: 3.0 + Math.random(), sales_attributed: 45000 + Math.random()*10000, spend: 15000 + Math.random()*3000, details: { brand_uplift: `${(8+Math.random()*4).toFixed(1)}%`, recommendation: `Campagne de considération ${lever} ${i+1}.`}
        }
    }),
  ],
  Japan: [
    // Always On Amazon
    { id: 'RM-JP-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 4.9, sales_attributed: 250000, spend: 51020, details: { type: 'Sponsored Products', acos: '20.4%', clicks: 300000, ctr: '1.0%', cpc: '20 JPY', recommendation: "La campagne maintient une bonne visibilité. L'ACoS est plus élevé qu'en EU/US, ce qui est normal pour le marché japonais. Continuer à optimiser." }},
    // Rakuten Ads
    ...Array.from({ length: 6 }, (_, i) => {
        const levers = ['Coupons', 'Display On-site'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-JP-R-DS-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Soja Chocolat', start: new Date(2024, i*2, 1), end: new Date(2024, i*2, 28), retailer: 'Rakuten Ads', lever: lever, objective: 'Essai Produit', status: i < 4 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: null, spend: 14000 + Math.random()*2000, details: { estimated_redemption: `${(7+Math.random()*3).toFixed(1)}%`, recommendation: `Offre couponing ${i+1}.` }
        }
    }),
    // Yahoo! Shopping
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Sponsored Products', 'Display On-site'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-JP-Y-GP-${i+1}`, brand: 'Gourdes Enfant', product: 'Gourde Pomme', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Yahoo! Shopping', lever: lever, objective: 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 4.5 + Math.random()*0.5, sales_attributed: 80000 + Math.random()*10000, spend: 18000 + Math.random()*2000, details: { acos: `${(21+Math.random()*3).toFixed(1)}%`, recommendation: `Campagne mensuelle ${lever} ${i+1} sur Yahoo.`}
        }
    }),
  ]
};

const performanceByRetailer = {
  France: [ { retailer: 'Unlimitail', ROI: 5.1, CPA: 0.71 }, { retailer: 'Amazon Ads', ROI: 5.8, CPA: 0.34 }, { retailer: 'Carrefour', ROI: 10, CPA: 0.8 }, { retailer: 'Système U', ROI: 4, CPA: 1.0 } ],
  USA: [ { retailer: 'Walmart Connect', ROI: 6.2, CPA: 0.43 }, { retailer: 'Instacart Ads', ROI: 3.5, CPA: 0.98 }, { retailer: 'Kroger Precision Marketing', ROI: 4.8, CPA: 1.2 }, { retailer: 'Amazon Ads', ROI: 6.5, CPA: 0.95 } ],
  Japan: [ { retailer: 'Rakuten Ads', ROI: 5.5, CPA: 0.5 }, { retailer: 'Amazon Ads', ROI: 4.9, CPA: 1.2 }, { retailer: 'Yahoo! Shopping', ROI: 4.5, CPA: 1.5 }]
};

const budgetAllocation = {
    France: [{name: 'Sponsored Products', value: 69169}, {name: 'Display On-site', value: 7857}, {name: 'Animation Magasin', value: 5400}, {name: 'Coupons', value: 25000}, { name: 'Display Off-site', value: 5625 }, { name: 'Sponsored Brands', value: 12000 } ],
    USA: [{name: 'Sponsored Products', value: 150124}, {name: 'Audience Extension', value: 18571}, {name: 'Coupons', value: 40000}, { name: 'Display On-site', value: 15484 }],
    Japan: [{name: 'Sponsored Products', value: 69909}, {name: 'Coupons', value: 14000}],
};
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
        return (
            <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}{unit}</p>
            </div>
        );
    };

    const kpiHtml: { [key: string]: (d: any) => string } = {
        'Sponsored Products': (d: any) => [renderKpi('ACoS', d.acos), renderKpi('Clics', d.clicks?.toLocaleString('fr-FR')), renderKpi('CTR', d.ctr), renderKpi('CPC Moyen', d.cpc)].join(''),
        'Display On-site': (d: any) => [renderKpi('Impressions', d.impressions?.toLocaleString('fr-FR')), renderKpi('Visibilité', d.viewability), renderKpi('CTR', d.ctr), renderKpi('Brand Uplift', d.brand_uplift)].join(''),
        'Audience Extension': (d: any) => [renderKpi('Portée', d.reach?.toLocaleString('fr-FR')), renderKpi('CPM', d.cpm), renderKpi('ROAS', campaign.roas, 'x'), renderKpi('Sales Lift Off-site', d.offsite_sales_lift)].join(''),
        'Animation Magasin': (d: any) => [renderKpi('Uplift Ventes', d.sales_uplift_vs_control, '%'), renderKpi('Visiteurs Engagés', d.visitors_engaged?.toLocaleString('fr-FR')), renderKpi('Coût / Visiteur', d.cost_per_visitor), renderKpi('Magasins Participants', d.stores_participating)].join(''),
        'Coupons': (d: any) => [renderKpi('Taux de Rédemption', d.estimated_redemption || d.redemption_rate, '%'), renderKpi('Coupons Distribués', d.coupons_distributed?.toLocaleString('fr-FR')), renderKpi('Valeur Offre', d.offer_value)].join(''),
        'Sponsored Brands': (d: any) => [renderKpi('Impressions', d.impressions?.toLocaleString('fr-FR'))].join(''),
        'Display Off-site': (d: any) => [renderKpi('Portée', d.reach?.toLocaleString('fr-FR')), renderKpi('CPM', d.cpm)].join(''),
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" dangerouslySetInnerHTML={{ __html: kpiHtml[campaign.lever as keyof typeof kpiHtml] ? kpiHtml[campaign.lever as keyof typeof kpiHtml](campaign.details) : '<p>Données non disponibles.</p>' }}>
                    </div>
                </div>
                 <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2 space-y-0">
                        <Sparkles className="h-5 w-5 text-accent" />
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
  const [brand, setBrand] = useState('all');

  const currentCampaigns = campaignDataByCountry[country]
      .filter(c => retailer === 'all' || c.retailer === retailer)
      .filter(c => brand === 'all' || c.brand === brand);
  
  const currentRetailerPerf = performanceByRetailer[country];
  
  const availableRetailers = ['all', ...Array.from(new Set(campaignDataByCountry[country].map(c => c.retailer)))];
  const availableBrands = ['all', ...Array.from(new Set(campaignDataByCountry[country].map(c => c.brand)))];

  const aggregatedKpis = currentCampaigns.reduce((acc, campaign) => {
    if (campaign.status.toLowerCase() !== 'planifiée') {
        acc.spend += campaign.spend || 0;
        acc.sales_attributed += campaign.sales_attributed || 0;
    }
    return acc;
  }, { spend: 0, sales_attributed: 0 });

  const globalRoi = aggregatedKpis.spend > 0 ? (aggregatedKpis.sales_attributed / aggregatedKpis.spend) : 0;
  
  const currentBudget = currentCampaigns.reduce((acc, campaign) => {
        if(campaign.spend) {
            const existing = acc.find(item => item.name === campaign.lever);
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
                                {availableRetailers.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'Toutes les enseignes' : r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setBrand} value={brand}>
                             <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Marque" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableBrands.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'Toutes les marques' : b}</SelectItem>)}
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
