
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { DollarSign, ShoppingCart, Users, Percent, UserPlus, Repeat, TrendingUp, Sparkles, MoveRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import ExportDialog from './export-dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface D2CPerformanceTabProps {
    filters: Filters;
}

const exportableItems = {
    data: ["KPIs de performance D2C"],
    graphs: ["Évolution des KPIs D2C", "Analyse du Funnel de Conversion"],
};

const generateKpiData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => ((seed & 0xffff) / 0xffff) * (max - min) + min;

    return [
        { title: "Chiffre d'Affaires", value: `€${random(100000, 150000).toLocaleString('fr-FR', {maximumFractionDigits: 0})}`, change: `+${random(5,15).toFixed(1)}%`, icon: DollarSign },
        { title: "Commandes", value: `${random(3000, 4000).toLocaleString('fr-FR', {maximumFractionDigits: 0})}`, change: `+${random(5,10).toFixed(1)}%`, icon: ShoppingCart },
        { title: "Panier Moyen", value: `€${random(35, 40).toFixed(2)}`, change: `+${random(1,5).toFixed(1)}%`, icon: DollarSign },
        { title: "Nouveaux Clients", value: `${random(1800, 2200).toLocaleString('fr-FR', {maximumFractionDigits: 0})}`, change: `+${random(15,25).toFixed(1)}%`, icon: UserPlus },
        { title: "Taux Conv.", value: `${random(2.5, 3.5).toFixed(1)}%`, change: `+${random(0.1, 0.5).toFixed(1)} pts`, icon: Percent },
        { title: "CAC", value: `€${random(10, 15).toFixed(2)}`, change: `-${random(2,8).toFixed(1)}%`, icon: TrendingUp },
        { title: "LTV", value: `€${random(80, 90).toFixed(2)}`, change: `+${random(8,12).toFixed(1)}%`, icon: Users },
        { title: "Taux Rachat", value: `${random(30, 40).toFixed(0)}%`, change: `+${random(3,7).toFixed(0)} pts`, icon: Repeat },
    ];
};

const generateEvolutionData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const seededRandom = () => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    return Array.from({length: 12}, (_, i) => ({
        name: `S-${12-i}`,
        'Chiffre d\'Affaires': (8000 + seededRandom() * 4000 + i * 400) * (1 + (i/24)),
        'Commandes': (220 + seededRandom() * 100 + i * 12) * (1 + (i/24)),
        'Panier Moyen': 35 + seededRandom() * 2,
        'Taux de Conversion': 2.5 + seededRandom() * 0.5 + i * 0.05
    }));
};

const funnelData = {
    'all': [125000, 80000, 25000, 15000, 3450],
    'product': [80000, 60000, 18000, 11000, 2500],
    'brand': [150000, 110000, 35000, 20000, 5000]
};

const funnelLabels = ['Visites', 'Vues Produit', 'Ajouts Panier', 'Paiement', 'Achat'];

const funnelChartData = (type: keyof typeof funnelData) => funnelData[type].map((value, index) => ({
    name: funnelLabels[index],
    value: value
}));


export default function D2CPerformanceTab({ filters }: D2CPerformanceTabProps) {
  const [selectedFunnel, setSelectedFunnel] = useState<keyof typeof funnelData>('all');
  const [visibleKpis, setVisibleKpis] = useState<string[]>(["Chiffre d'Affaires"]);

  const kpiData = useMemo(() => generateKpiData(filters), [filters]);
  const evolutionData = useMemo(() => generateEvolutionData(filters), [filters]);

  const handleKpiToggle = (kpi: string) => {
    setVisibleKpis(prev => prev.includes(kpi) ? prev.filter(item => item !== kpi) : [...prev, kpi]);
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <ExportDialog tabTitle="D2C" items={exportableItems} />
        </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {kpiData.map((kpi) => (
            <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                </CardContent>
            </Card>
        ))}
      </div>
       <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Évolution des KPIs D2C</CardTitle>
              <div className="flex flex-wrap items-center gap-4">
                  {Object.keys(evolutionData[0]).filter(k => k !== 'name').map(kpi => (
                      <div key={kpi} className="flex items-center space-x-2">
                          <Checkbox id={`cb-${kpi}`} checked={visibleKpis.includes(kpi)} onCheckedChange={() => handleKpiToggle(kpi)} />
                          <label htmlFor={`cb-${kpi}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{kpi}</label>
                      </div>
                  ))}
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip />
                <Legend />
                {visibleKpis.includes("Chiffre d'Affaires") && <Line yAxisId="left" type="monotone" dataKey="Chiffre d'Affaires" stroke="hsl(var(--chart-1))" />}
                {visibleKpis.includes("Commandes") && <Line yAxisId="right" type="monotone" dataKey="Commandes" stroke="hsl(var(--chart-2))" />}
                {visibleKpis.includes("Panier Moyen") && <Line yAxisId="left" type="monotone" dataKey="Panier Moyen" stroke="hsl(var(--chart-3))" />}
                {visibleKpis.includes("Taux de Conversion") && <Line yAxisId="right" type="monotone" dataKey="Taux de Conversion" stroke="hsl(var(--chart-4))" />}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Analyse du Funnel de Conversion</CardTitle>
            <Select onValueChange={(value: keyof typeof funnelData) => setSelectedFunnel(value)} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tout le Site</SelectItem>
                    <SelectItem value="product">Vue Produit</SelectItem>
                    <SelectItem value="brand">Vue Marque</SelectItem>
                </SelectContent>
            </Select>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelChartData(selectedFunnel)} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR')} />
                <Bar dataKey="value" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--muted))' }} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={24} height={24} className="object-contain" />
                <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold mb-1">À retenir</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li>Le taux de conversion global est de <strong>{kpiData.find(k => k.title === 'Taux Conv.')?.value}</strong>.</li>
                        <li>La principale chute dans le funnel (<strong>68%</strong>) se situe entre la vue produit et l'ajout au panier.</li>
                        <li>Le ratio LTV/CAC est très positif (<strong>{(parseFloat(kpiData.find(k => k.title === 'LTV')?.value.replace('€','') || '0') / parseFloat(kpiData.find(k => k.title === 'CAC')?.value.replace('€','') || '1')).toFixed(1)}</strong>), indiquant une acquisition client rentable.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Nos recommandations</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li><strong>Optimiser :</strong> Améliorer les visuels et les descriptions sur les pages produits pour augmenter l'attrait et inciter à l'ajout au panier.</li>
                        <li><strong>Tester :</strong> Mettre en place un test A/B sur le bouton "Ajouter au panier" (couleur, texte).</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/creative-studio">Créer de nouveaux visuels produits <MoveRight className="ml-1" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    

    