
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Youtube, DollarSign, Eye, MousePointerClick, TrendingUp, Filter, MapPin } from "lucide-react";

// --- Mock Data ---

const kpiData = {
  France: { spend: 28500, reach: 1200000, clicks: 74700, roi: 4.8 },
  USA: { spend: 75000, reach: 3500000, clicks: 210000, roi: 5.5 },
  Germany: { spend: 42000, reach: 2100000, clicks: 115000, roi: 4.2 },
};

const campaignDataByCountry = {
  France: [
    { id: 'FR1', name: 'Campagne Hiver', platform: 'Facebook', spend: 5000, reach: 120000, clicks: 8500, status: 'active' },
    { id: 'FR2', name: 'Lancement Végétal', platform: 'Instagram', spend: 7500, reach: 250000, clicks: 15000, status: 'active' },
    { id: 'FR3', name: 'Recettes Estivales', platform: 'Youtube', spend: 12000, reach: 800000, clicks: 45000, status: 'completed' },
    { id: 'FR4', name: 'Promo Rentrée', platform: 'Facebook', spend: 4000, reach: 95000, clicks: 6200, status: 'paused' },
  ],
  USA: [
    { id: 'US1', name: 'Summer Blast', platform: 'Instagram', spend: 25000, reach: 1200000, clicks: 80000, status: 'active' },
    { id: 'US2', name: 'New Flavor Launch', platform: 'Youtube', spend: 40000, reach: 2000000, clicks: 110000, status: 'active' },
  ],
  Germany: [
     { id: 'DE1', name: 'Herbst-Special', platform: 'Facebook', spend: 15000, reach: 700000, clicks: 40000, status: 'completed' },
     { id: 'DE2', name: 'Bio-Joghurt Einführung', platform: 'Instagram', spend: 20000, reach: 1100000, clicks: 65000, status: 'active' },
  ]
};

const performanceByPlatform = {
  France: [
    { platform: 'Facebook', ROI: 4.5, CPA: 1.2 }, { platform: 'Instagram', ROI: 5.2, CPA: 0.9 }, { platform: 'Youtube', ROI: 3.8, CPA: 2.5 }, { platform: 'TikTok', ROI: 6.1, CPA: 0.7 },
  ],
  USA: [
    { platform: 'Facebook', ROI: 5.0, CPA: 1.0 }, { platform: 'Instagram', ROI: 6.8, CPA: 0.8 }, { platform: 'Youtube', ROI: 4.1, CPA: 2.1 }, { platform: 'TikTok', ROI: 7.2, CPA: 0.6 },
  ],
  Germany: [
     { platform: 'Facebook', ROI: 4.0, CPA: 1.5 }, { platform: 'Instagram', ROI: 4.8, CPA: 1.1 }, { platform: 'Youtube', ROI: 3.5, CPA: 2.8 }, { platform: 'TikTok', ROI: 5.5, CPA: 0.9 },
  ]
};

const budgetAllocation = {
    France: [{name: 'Facebook', value: 30}, {name: 'Instagram', value: 40}, {name: 'Youtube', value: 20}, {name: 'Autres', value: 10}],
    USA: [{name: 'Facebook', value: 25}, {name: 'Instagram', value: 45}, {name: 'Youtube', value: 25}, {name: 'Autres', value: 5}],
    Germany: [{name: 'Facebook', value: 35}, {name: 'Instagram', value: 35}, {name: 'Youtube', value: 15}, {name: 'Autres', value: 15}],
}
const COLORS = ['#4267B2', '#E1306C', '#FF0000', '#6B7280'];

// --- Components ---

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
        case 'instagram': return <Instagram className="h-5 w-5 text-pink-500" />;
        case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />;
        default: return null;
    }
};
const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'active': return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
        case 'paused': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">En Pause</Badge>;
        case 'completed': return <Badge variant="outline">Terminée</Badge>;
        default: return null;
    }
}

// --- Main Page Component ---

export default function MediaBrandPage() {
  const [country, setCountry] = useState<'France' | 'USA' | 'Germany'>('France');
  const [brand, setBrand] = useState('all');

  const currentKpis = kpiData[country];
  const currentCampaigns = campaignDataByCountry[country];
  const currentPlatformPerf = performanceByPlatform[country];
  const currentBudget = budgetAllocation[country];

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
                        <Select onValueChange={(val: 'France' | 'USA' | 'Germany') => setCountry(val)} value={country}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pays" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="USA">États-Unis</SelectItem>
                                <SelectItem value="Germany">Allemagne</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setBrand} value={brand} disabled>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Marque" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les marques</SelectItem>
                                <SelectItem value="brandA" disabled>Marque A</SelectItem>
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
                        <div className="text-2xl font-bold">€{currentKpis.spend.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+5% ce mois-ci</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Portée Totale (Reach)</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentKpis.reach.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Personnes uniques touchées</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clics Totaux</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentKpis.clicks.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Taux de clics moyen: 6.2%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI Global</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentKpis.roi}x</div>
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
                        <CardDescription>Répartition des dépenses par canal.</CardDescription>
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
                                    <PlatformIcon platform={campaign.platform} />
                                    <div>
                                        <p className="font-semibold">{campaign.name}</p>
                                        <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                                    </div>
                                </div>
                                <div className="grid flex-1 grid-cols-2 gap-4 text-sm sm:grid-cols-4 sm:text-center">
                                    <div>
                                        <p className="font-medium">€{campaign.spend.toLocaleString()}</p>
                                        <p className="text-muted-foreground">Dépensé</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                                        <p className="text-muted-foreground">Portée</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                                        <p className="text-muted-foreground">Clics</p>
                                    </div>
                                    <div className="flex items-center justify-end sm:justify-center">
                                        <StatusBadge status={campaign.status} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Aucune donnée de campagne disponible pour ce pays.</p>
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
