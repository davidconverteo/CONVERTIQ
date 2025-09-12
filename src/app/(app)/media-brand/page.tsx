
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Youtube, DollarSign, Eye, MousePointerClick, TrendingUp, Filter, MapPin } from "lucide-react";

// --- Données initiales restaurées ---

const kpiDataByCountry = {
  France: { spend: 28500, reach: 1200000, clicks: 74700, roi: 4.8 },
  USA: { spend: 75000, reach: 3500000, clicks: 210000, roi: 5.5 },
  Japan: { spend: 0, reach: 0, clicks: 0, roi: 0 }, // Ajout du Japon pour la cohérence
};

const campaignDataByCountry = {
  France: [
    { id: 'C001', brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: '01/07/24', end: '31/07/24', lever: 'Social', channel: 'Meta', objective: 'Conversion', status: 'Terminée', roas: 4.2, ca_add: 85200, spend: 20286, reach: 750000, clicks: 15000 },
    { id: 'C003', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: '01/09/24', end: '30/09/24', lever: 'TV', channel: 'TF1', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 450000, reach: 15000000, clicks: 0 },
    { id: 'C011', brand: 'Gamme Bio', product: 'Gamme Bio', start: '10/05/25', end: '10/06/25', lever: 'Affichage', channel: 'JCDecaux', objective: 'Notoriété', status: 'Terminée', roas: 1.8, ca_add: 92000, spend: 51111, reach: 5000000, clicks: 0 },
  ],
  USA: [
    { id: 'CUSA1', brand: 'La Prairie Gourmande', product: 'Grand Pot 450g', start: '15/07/24', end: '15/08/24', lever: 'Social', channel: 'TikTok', objective: 'Engagement', status: 'En cours', roas: 3.1, ca_add: 120500, spend: 38871, reach: 2800000, clicks: 25000 },
    { id: 'CUSA2', brand: 'Gamme Bio', product: 'Yaourt Bio Fraise', start: '01/08/24', end: '31/08/24', lever: 'Presse', channel: 'NY Times', objective: 'Considération', status: 'Terminée', roas: 1.5, ca_add: 45000, spend: 30000, reach: 1500000, clicks: 0 },
  ],
  Japan: [
     { id: 'CJAP1', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: '01/09/24', end: '30/09/24', lever: 'TV', channel: 'Fuji TV', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 660000, reach: 24000000, clicks: 0 },
  ]
};

const performanceByPlatform = {
  France: [
    { platform: 'Meta', ROI: 4.2, CPA: 1.35 }, { platform: 'TF1', ROI: 3.8, CPA: 2.5 }, { platform: 'JCDecaux', ROI: 1.8, CPA: 5.0 },
  ],
  USA: [
    { platform: 'TikTok', ROI: 3.1, CPA: 0.95 }, { platform: 'NY Times', ROI: 1.5, CPA: 4.0 },
  ],
  Japan: [
     { platform: 'Fuji TV', ROI: 4.0, CPA: 2.8 },
  ]
};

const budgetAllocation = {
    France: [{name: 'Social', value: 30}, {name: 'TV', value: 50}, {name: 'Affichage', value: 20}],
    USA: [{name: 'Social', value: 60}, {name: 'Presse', value: 40}],
    Japan: [{name: 'TV', value: 100}],
}
const COLORS = ['#4267B2', '#E1306C', '#FF0000', '#000000', '#6B7280'];

// --- Components ---

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'meta': return <Facebook className="h-5 w-5 text-blue-600" />;
        case 'tiktok': return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.02 3.07.02 4.6 0 1.8.01 3.59-.01 5.39-.01 1.25-.08 2.5-.23 3.74-.22 1.7-.63 3.36-1.34 4.94-.84 1.87-2.09 3.4-3.79 4.62-1.25.9-2.72 1.48-4.25 1.76-.9.17-1.8.27-2.71.33-1.89.12-3.79.02-5.68-.08-1.3-.07-2.6-.2-3.88-.42-.8-.15-1.58-.36-2.34-.62-.25-.09-.48-.2-.7-.34.02-2.12.01-4.24.01-6.36 1.1.42 2.22.75 3.36.98.59.12 1.19.2 1.78.26 1.15.11 2.3.13 3.45.11.95-.03 1.9-.11 2.84-.25.86-.12 1.7-.32 2.52-.59.98-.31 1.91-.73 2.77-1.25.6-.37 1.16-.8 1.68-1.28.42-.39.81-.83 1.16-1.3.28-.37.53-.77.75-1.19.42-.8.74-1.66.97-2.55.12-.47.22-.95.3-1.43.08-.5.13-1 .18-1.5.02-.2.03-.4.04-.6.01-1.14.01-2.28.01-3.43.01-.63.01-1.27.02-1.9.01-.2 0-.39-.01-.59Z"/></svg>;
        case 'tf1':
        case 'fuji tv': 
            return <Youtube className="h-5 w-5 text-red-600" />; // Placeholder
        default: return null;
    }
};
const StatusBadge = ({ status }: { status: string }) => {
    switch(status.toLowerCase()) {
        case 'en cours':
        case 'active': return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
        case 'planifiée': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Planifiée</Badge>;
        case 'terminée':
        case 'completed': return <Badge variant="outline">Terminée</Badge>;
        default: return null;
    }
}

// --- Main Page Component ---

export default function MediaBrandPage() {
  const [country, setCountry] = useState<'France' | 'USA' | 'Japan'>('France');
  const [brand, setBrand] = useState('all');

  const currentKpis = kpiDataByCountry[country];
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="campaigns">Détail des Campagnes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{aggregatedKpis.spend.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">sur les campagnes actives/terminées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Portée Totale (Reach)</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aggregatedKpis.reach.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Personnes uniques touchées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clics Totaux</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{aggregatedKpis.clicks.toLocaleString()}</div>
                         <p className="text-xs text-muted-foreground">Taux de clics moyen: {aggregatedKpis.reach > 0 ? (aggregatedKpis.clicks / aggregatedKpis.reach * 100).toFixed(2) : 0}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI Global</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                                <Pie data={currentBudget} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {currentBudget.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="campaigns" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Détail des Campagnes pour: {country}</CardTitle>
                <CardDescription>Analysez la performance de chaque campagne individuellement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentCampaigns.length > 0 ? currentCampaigns.map(campaign => (
                            <div key={campaign.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <PlatformIcon platform={campaign.channel} />
                                    <div>
                                        <p className="font-semibold">{campaign.product}</p>
                                        <p className="text-sm text-muted-foreground">{campaign.brand} | {campaign.channel}</p>
                                    </div>
                                </div>
                                <div className="grid flex-1 grid-cols-2 gap-4 text-sm sm:grid-cols-4 sm:text-center">
                                    <div>
                                        <p className="font-medium">€{(campaign.spend || 0).toLocaleString()}</p>
                                        <p className="text-muted-foreground">Dépensé</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{(campaign.reach || 0).toLocaleString()}</p>
                                        <p className="text-muted-foreground">Portée</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{(campaign.clicks || 0).toLocaleString()}</p>
                                        <p className="text-muted-foreground">Clics</p>
                                    </div>
                                    <div className="flex items-center justify-end sm:justify-center">
                                        <StatusBadge status={campaign.status} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Aucune donnée de campagne disponible pour cette sélection.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    