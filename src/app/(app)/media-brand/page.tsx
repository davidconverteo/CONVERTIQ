
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Youtube, DollarSign, Eye, MousePointerClick, TrendingUp, Filter, MapPin, Sparkles, Tv, Newspaper, Radio, CalendarDays, ExternalLink, Presentation, ChevronRight, Megaphone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


// --- Données enrichies ---

const campaignDataByCountry = {
  France: [
    { id: 'C001', brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: new Date('2024-07-01'), end: new Date('2024-07-31'), lever: 'Social', channel: 'Meta', objective: 'Conversion', status: 'Terminée', roas: 4.2, ca_add: 85200, spend: 20286, reach: 750000, clicks: 15000 },
    { id: 'C002', brand: 'Gamme Skyr', product: 'Skyr Nature 450g', start: new Date('2024-08-15'), end: new Date('2024-09-15'), lever: 'Radio', channel: 'NRJ', objective: 'Drive-to-store', status: 'En cours', roas: 2.5, ca_add: 75000, spend: 30000, reach: 3000000, clicks: 0 },
    { id: 'C003', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'TV', channel: 'TF1', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 450000, reach: 15000000, clicks: 0 },
    { id: 'C004', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-05-10'), end: new Date('2024-06-10'), lever: 'Affichage', channel: 'JCDecaux', objective: 'Notoriété', status: 'Terminée', roas: 1.8, ca_add: 92000, spend: 51111, reach: 5000000, clicks: 0 },
    { id: 'C005', brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Presse', channel: 'Le Figaro', objective: 'Considération', status: 'Planifiée', roas: null, ca_add: null, spend: 25000, reach: 1200000, clicks: 0 },
    { id: 'C006', brand: 'La Prairie Gourmande', product: 'Toute la gamme', start: new Date('2024-02-01'), end: new Date('2024-02-28'), lever: 'Social', channel: 'Instagram', objective: 'Engagement', status: 'Terminée', roas: 3.5, ca_add: 63000, spend: 18000, reach: 900000, clicks: 22000 },
    { id: 'C007', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-04-01'), end: new Date('2024-04-30'), lever: 'TV', channel: 'M6', objective: 'Notoriété', status: 'Terminée', roas: 3.1, ca_add: 310000, spend: 100000, reach: 8000000, clicks: 0 },
    { id: 'C008', brand: 'Gamme Bio', product: 'Nouveau Yaourt Bio', start: new Date('2024-11-01'), end: new Date('2024-11-30'), lever: 'Digital', channel: 'Youtube', objective: 'Lancement', status: 'Planifiée', roas: null, ca_add: null, spend: 50000, reach: 2000000, clicks: 40000 },
    { id: 'C009', brand: 'Gamme Végétale', product: 'Dessert Amande', start: new Date('2024-06-15'), end: new Date('2024-07-15'), lever: 'Affichage', channel: 'Metrobus', objective: 'Notoriété', status: 'Terminée', roas: 1.5, ca_add: 45000, spend: 30000, reach: 4000000, clicks: 0 },
    { id: 'C010', brand: 'La Prairie Gourmande', product: 'Yaourt à boire', start: new Date('2024-08-01'), end: new Date('2024-08-31'), lever: 'Radio', channel: 'Fun Radio', objective: 'Promotion', status: 'En cours', roas: 2.8, ca_add: 56000, spend: 20000, reach: 2500000, clicks: 0 },
  ],
  USA: [
    { id: 'CUSA1', brand: 'La Prairie Gourmande', product: 'Grand Pot 450g', start: new Date('2024-07-15'), end: new Date('2024-08-15'), lever: 'Social', channel: 'TikTok', objective: 'Engagement', status: 'En cours', roas: 3.1, ca_add: 120500, spend: 38871, reach: 2800000, clicks: 25000 },
    { id: 'CUSA2', brand: 'Gamme Bio', product: 'Yaourt Bio Fraise', start: new Date('2024-08-01'), end: new Date('2024-08-31'), lever: 'Presse', channel: 'NY Times', objective: 'Considération', status: 'Terminée', roas: 1.5, ca_add: 45000, spend: 30000, reach: 1500000, clicks: 0 },
    { id: 'CUSA3', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-11-01'), end: new Date('2024-11-28'), lever: 'TV', channel: 'ABC', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 1200000, reach: 45000000, clicks: 0 },
    { id: 'CUSA4', brand: 'Gamme Skyr', product: 'Skyr Protéine+', start: new Date('2024-05-01'), end: new Date('2024-05-31'), lever: 'Digital', channel: 'Hulu', objective: 'Conversion', status: 'Terminée', roas: 4.5, ca_add: 225000, spend: 50000, reach: 6000000, clicks: 90000 },
    { id: 'CUSA5', brand: 'Gamme Végétale', product: 'Lait d\'Avoine', start: new Date('2024-09-10'), end: new Date('2024-10-10'), lever: 'Affichage', channel: 'Lamar', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 250000, reach: 12000000, clicks: 0 },
    { id: 'CUSA6', brand: 'La Prairie Gourmande', product: 'Kids Pouches', start: new Date('2024-08-20'), end: new Date('2024-09-20'), lever: 'Social', channel: 'Pinterest', objective: 'Drive-to-store', status: 'En cours', roas: 3.8, ca_add: 95000, spend: 25000, reach: 4000000, clicks: 120000 },
    { id: 'CUSA7', brand: 'Gamme Bio', product: 'Toute la gamme Bio', start: new Date('2024-01-15'), end: new Date('2024-02-15'), lever: 'Presse', channel: 'Whole Foods Mag', objective: 'Considération', status: 'Terminée', roas: 2.1, ca_add: 42000, spend: 20000, reach: 800000, clicks: 0 },
    { id: 'CUSA8', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Radio', channel: 'iHeartRadio', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 150000, reach: 25000000, clicks: 0 },
    { id: 'CUSA9', brand: 'La Prairie Gourmande', product: 'Yaourt Grec', start: new Date('2024-03-01'), end: new Date('2024-03-31'), lever: 'TV', channel: 'NBC', objective: 'Notoriété', status: 'Terminée', roas: 3.9, ca_add: 975000, spend: 250000, reach: 35000000, clicks: 0 },
    { id: 'CUSA10', brand: 'Gamme Végétale', product: 'Dessert Coco', start: new Date('2024-12-01'), end: new Date('2024-12-24'), lever: 'Social', channel: 'Facebook', objective: 'Promotion', status: 'Planifiée', roas: null, ca_add: null, spend: 75000, reach: 10000000, clicks: 150000 },
  ],
  Japan: [
     { id: 'CJAP1', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'TV', channel: 'Fuji TV', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 660000, reach: 24000000, clicks: 0 },
     { id: 'CJAP2', brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date('2024-06-01'), end: new Date('2024-06-30'), lever: 'Social', channel: 'Line', objective: 'Essai', status: 'Terminée', roas: 3.8, ca_add: 55000, spend: 14474, reach: 5000000, clicks: 80000 },
     { id: 'CJAP3', brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date('2024-07-01'), end: new Date('2024-07-31'), lever: 'Presse', channel: 'Nikkei', objective: 'Considération', status: 'Terminée', roas: 1.9, ca_add: 30000, spend: 15789, reach: 2000000, clicks: 0 },
     { id: 'CJAP4', brand: 'La Prairie Gourmande', product: 'Pack de 4 Matcha', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Digital', channel: 'Yahoo! Japan', objective: 'Conversion', status: 'Planifiée', roas: null, ca_add: null, spend: 40000, reach: 15000000, clicks: 120000 },
     { id: 'CJAP5', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-08-15'), end: new Date('2024-09-15'), lever: 'Affichage', channel: 'Tokyo Metro', objective: 'Notoriété', status: 'En cours', roas: 2.2, ca_add: 90000, spend: 40909, reach: 30000000, clicks: 0 },
     { id: 'CJAP6', brand: 'Gamme Végétale', product: 'Lait d\'Avoine', start: new Date('2024-02-01'), end: new Date('2024-02-28'), lever: 'Social', channel: 'Instagram', objective: 'Engagement', status: 'Terminée', roas: 4.1, ca_add: 45000, spend: 10975, reach: 3000000, clicks: 60000 },
     { id: 'CJAP7', brand: 'La Prairie Gourmande', product: 'Yaourt à boire Yuzu', start: new Date('2024-04-01'), end: new Date('2024-04-30'), lever: 'TV', channel: 'NTV', objective: 'Lancement', status: 'Terminée', roas: 3.5, ca_add: 350000, spend: 100000, reach: 20000000, clicks: 0 },
     { id: 'CJAP8', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-11-05'), end: new Date('2024-12-05'), lever: 'Digital', channel: 'AbemaTV', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 60000, reach: 8000000, clicks: 0 },
     { id: 'CJAP9', brand: 'Gamme Bio', product: 'Yaourt Bio Nature', start: new Date('2024-01-10'), end: new Date('2024-02-10'), lever: 'Presse', channel: 'Asahi Shimbun', objective: 'Considération', status: 'Terminée', roas: 1.8, ca_add: 25000, spend: 13888, reach: 5000000, clicks: 0 },
     { id: 'CJAP10', brand: 'La Prairie Gourmande', product: 'Gamme complète', start: new Date('2025-01-01'), end: new Date('2025-01-31'), lever: 'TV', channel: 'TV Asahi', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 750000, reach: 25000000, clicks: 0 },
  ]
};


const performanceByPlatform = {
  France: [
    { platform: 'Meta', ROI: 4.2, CPA: 1.35 }, { platform: 'TF1', ROI: 3.8, CPA: 2.5 }, { platform: 'JCDecaux', ROI: 1.8, CPA: 5.0 }, { platform: 'NRJ', ROI: 2.5, CPA: 3.1 }, { platform: 'Le Figaro', ROI: 1.2, CPA: 6.2 }, { platform: 'M6', ROI: 3.1, CPA: 3.0 }, { platform: 'Youtube', ROI: 4.0, CPA: 1.2 }
  ],
  USA: [
    { platform: 'TikTok', ROI: 3.1, CPA: 0.95 }, { platform: 'NY Times', ROI: 1.5, CPA: 4.0 }, { platform: 'ABC', ROI: 4.5, CPA: 2.8 }, { platform: 'Hulu', ROI: 4.5, CPA: 2.0 }, { platform: 'Pinterest', ROI: 3.8, CPA: 1.5 }, { platform: 'iHeartRadio', ROI: 2.2, CPA: 4.5 }
  ],
  Japan: [
     { platform: 'Fuji TV', ROI: 4.0, CPA: 2.8 }, { platform: 'Line', ROI: 3.8, CPA: 1.2 }, { platform: 'Nikkei', ROI: 1.9, CPA: 5.5 }, { platform: 'Yahoo! Japan', ROI: 3.5, CPA: 1.8 }, { platform: 'Tokyo Metro', ROI: 2.2, CPA: 4.0 }
  ]
};

const budgetAllocation = {
    France: [
      {name: 'Social', value: 38286}, {name: 'TV', value: 550000}, {name: 'Affichage', value: 81111}, {name: 'Radio', value: 50000}, {name: 'Presse', value: 25000}, {name: 'Digital', value: 50000}
    ],
    USA: [
      {name: 'Social', value: 138871}, {name: 'Presse', value: 50000}, {name: 'TV', value: 1450000}, {name: 'Digital', value: 50000}, {name: 'Affichage', value: 250000}, {name: 'Radio', value: 150000}
    ],
    Japan: [
      {name: 'TV', value: 1510000}, {name: 'Social', value: 25449}, {name: 'Presse', value: 29677}, {name: 'Digital', value: 100000}, {name: 'Affichage', value: 40909}
    ],
}
const COLORS = ['#4267B2', '#E1306C', '#FF0000', '#000000', '#6B7280', '#06B6D4', '#8B5CF6'];

// --- Components ---

const PlatformIcon = ({ lever }: { lever: string }) => {
    switch (lever.toLowerCase()) {
        case 'social': return <Facebook className="h-5 w-5 text-blue-600" />;
        case 'tv': return <Tv className="h-5 w-5 text-red-600" />;
        case 'presse': return <Newspaper className="h-5 w-5 text-gray-700" />;
        case 'radio': return <Radio className="h-5 w-5 text-orange-500" />;
        case 'affichage': return <Presentation className="h-5 w-5 text-purple-500" />;
        default: return <Megaphone className="h-5 w-5 text-muted-foreground" />;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    switch(status.toLowerCase()) {
        case 'en cours': return <Badge className="bg-blue-100 text-blue-800 border-blue-300">En cours</Badge>;
        case 'planifiée': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Planifiée</Badge>;
        case 'terminée': return <Badge className="bg-green-100 text-green-800 border-green-300">Terminée</Badge>;
        default: return null;
    }
}

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

    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <PlatformIcon lever={campaign.lever} />
                    {campaign.product} - {campaign.channel}
                </DialogTitle>
                <DialogDescription>
                    {campaign.objective} | {new Date(campaign.start).toLocaleDateString('fr-FR')} - {new Date(campaign.end).toLocaleDateString('fr-FR')}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Business</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderKpi('Dépense', campaign.spend, '€')}
                        {renderKpi('CA Incrémental', campaign.ca_add, '€')}
                        {renderKpi('ROAS', campaign.roas, 'x')}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Média</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderKpi('Portée (Reach)', campaign.reach)}
                        {renderKpi('Clics', campaign.clicks)}
                    </div>
                </div>
                 <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2 space-y-0">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">Recommandation IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {campaign.lever === 'TV' ? 'Le plan GRP est aligné avec les objectifs de notoriété pour le lancement. Suivre l\'impact post-campagne sur les ventes et la notoriété spontanée.' : 'Cette campagne a montré un excellent ROAS. Pour la prochaine vague, envisagez de tester un ciblage sur l\'audience "Jeunes Parents" qui a montré un fort taux d\'engagement.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    )
}

const MediaPlanner = ({ campaigns }: { campaigns: any[] }) => {
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
                    <CardTitle className="flex items-center gap-2"><CalendarDays /> Planning Annuel des Campagnes {year}</CardTitle>
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
                                                                <PlatformIcon lever={campaign.lever} />
                                                                {!isTooSmall && <span className="ml-2 truncate text-xs">{campaign.channel}</span>}
                                                            </div>
                                                        </DialogTrigger>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-bold">{campaign.lever} - {campaign.channel}</p>
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

export default function MediaBrandPage() {
  const [country, setCountry] = useState<'France' | 'USA' | 'Japan'>('France');
  const [brand, setBrand] = useState('all');

  const currentCampaigns = campaignDataByCountry[country]
      .filter(c => brand === 'all' || c.brand === brand);

  const currentPlatformPerf = performanceByPlatform[country];
  const currentBudget = budgetAllocation[country];
  const availableBrands = ['all', ...Array.from(new Set(campaignDataByCountry[country].map(c => c.brand)))];

  const aggregatedKpis = currentCampaigns.reduce((acc, campaign) => {
    if (campaign.status.toLowerCase() !== 'planifiée') {
        acc.spend += campaign.spend || 0;
        acc.reach += campaign.reach || 0;
        acc.clicks += campaign.clicks || 0;
        acc.ca_add += campaign.ca_add || 0;
    }
    return acc;
  }, { spend: 0, reach: 0, clicks: 0, ca_add: 0 });

  const globalRoi = aggregatedKpis.spend > 0 ? (aggregatedKpis.ca_add / aggregatedKpis.spend) : 0;


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2"><MapPin /> Vue par Pays</CardTitle>
                        <CardDescription>Sélectionnez un pays et une marque pour filtrer les données.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <Select onValueChange={(val: 'France' | 'USA' | 'Japan') => { setCountry(val); setBrand('all'); }} value={country}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pays" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="USA">États-Unis</SelectItem>
                                <SelectItem value="Japan">Japon</SelectItem>
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
          <TabsTrigger value="campaigns">Détail des Campagnes</TabsTrigger>
          <TabsTrigger value="planning">Planning Média</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                        <DollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{aggregatedKpis.spend.toLocaleString('fr-FR')}</div>
                        <p className="text-xs text-muted-foreground">sur les campagnes actives/terminées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Portée Totale (Reach)</CardTitle>
                        <Eye />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aggregatedKpis.reach.toLocaleString('fr-FR')}</div>
                        <p className="text-xs text-muted-foreground">Personnes uniques touchées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clics Totaux</CardTitle>
                        <MousePointerClick />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aggregatedKpis.clicks.toLocaleString('fr-FR')}</div>
                         <p className="text-xs text-muted-foreground">Taux de clics moyen: {aggregatedKpis.reach > 0 ? (aggregatedKpis.clicks / aggregatedKpis.reach * 100).toFixed(2) : 0}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI Global</CardTitle>
                        <TrendingUp />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{globalRoi.toFixed(2)}x</div>
                        <p className="text-xs text-muted-foreground">Retour sur investissement</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Performance par Plateforme</CardTitle>
                        <CardDescription>Comparaison du ROI et du Coût par Acquisition (CPA).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={currentPlatformPerf}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="platform" />
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
                        <CardDescription>Répartition des dépenses par levier.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={currentBudget} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    {currentBudget.map((entry, index) => (
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
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Synthèse et Recommandation IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        En {country}, le ROAS global de {globalRoi.toFixed(2)} est solide, principalement tiré par les campagnes digitales ({performanceByPlatform[country].find(p => p.platform.toLowerCase().includes('meta'))?.ROI || 4}x). La TV maintient une forte contribution à la notoriété malgré un ROAS plus faible. 
                        <strong>Recommandation :</strong> Envisagez de réallouer une partie du budget Affichage, dont le ROAS est faible, vers le Social Media pour maximiser la conversion à court terme. Lancez une analyse post-campagne pour la TV afin de quantifier son impact sur les ventes indirectes.
                    </p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Détail des Campagnes pour: {country}</CardTitle>
                <CardDescription>Cliquez sur une campagne pour voir ses performances détaillées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campagne</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Levier</TableHead>
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
                                            <div className="flex items-center gap-2">
                                                <PlatformIcon lever={campaign.lever} />
                                                {campaign.lever}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">€{(campaign.spend || 0).toLocaleString('fr-FR')}</TableCell>
                                        <TableCell className={`text-right font-bold ${campaign.roas && campaign.roas > 3 ? 'text-green-600' : 'text-amber-600'}`}>
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
                                        Aucune donnée de campagne disponible pour cette sélection.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
            <MediaPlanner campaigns={currentCampaigns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
