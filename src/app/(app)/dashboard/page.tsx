
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { DollarSign, Zap, Users, CheckCircle, Lightbulb, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const kpiData = [
    { title: "Chiffre d'Affaires Total", value: "8.33 M€", icon: DollarSign },
    { title: "ROAS Moyen Pondéré", value: "2.5", icon: Zap },
    { title: "Pénétration Marché", value: "12.7%", icon: Users },
    { title: "Taux Disponibilité Online", value: "108.7%", icon: CheckCircle, note: "vs objectif 98%" },
];

const channelData = [
    { name: 'Offline', value: 5000000, fill: 'hsl(var(--chart-1))' },
    { name: 'Online (Drive)', value: 3000000, fill: 'hsl(var(--chart-2))' },
    { name: 'D2C', value: 330000, fill: 'hsl(var(--chart-3))' },
];

const insightPlatforms = [
    { name: 'Circana', logo: 'https://i.postimg.cc/PqYp2MSx/circana-logo.png' },
    { name: 'Kantar', logo: 'https://i.postimg.cc/Yq3C93p0/kantar-logo.png' },
    { name: 'Data Impact', logo: 'https://i.postimg.cc/L69g9T3h/data-impact-logo.png' },
];

const activationPlatforms = [
    { name: 'Amazon Ads', logo: 'https://i.postimg.cc/6p65p5V2/amazon-ads-logo.png' },
    { name: 'Unlimitail', logo: 'https://i.postimg.cc/tJnF4h07/unlimitail-logo.png' },
    { name: 'Pacvue', logo: 'https://i.postimg.cc/d1W1xJ6T/pacvue-logo.png' },
];

const PlatformCard = ({ name, logo }: { name: string, logo: string }) => (
    <Link href="#" className="block group">
        <Card className="flex h-24 items-center justify-center p-4 transition-all hover:shadow-md hover:border-primary">
            <div className="relative h-12 w-full">
                <Image src={logo} alt={`${name} logo`} fill style={{objectFit:"contain"}} className="grayscale opacity-60 transition-all group-hover:grayscale-0 group-hover:opacity-100" />
            </div>
        </Card>
        <p className="mt-2 text-center text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">{name}</p>
    </Link>
);

export default function DashboardPage() {
    const [filters, setFilters] = useState({
        period: 'mat',
        channel: 'all',
    });

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Cockpit de Pilotage</CardTitle>
                <CardDescription>Vue d'ensemble de votre performance marketing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
                 <Select defaultValue="mat" onValueChange={(v) => setFilters(f => ({...f, period: v}))}>
                    <SelectTrigger className="w-full sm:w-[240px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mat">Cumul Annuel Mobile (MAT)</SelectItem>
                        <SelectItem value="ytd">Year-to-Date (YTD)</SelectItem>
                        <SelectItem value="last_quarter">Dernier Trimestre</SelectItem>
                        <SelectItem value="last_month">Dernier Mois</SelectItem>
                    </SelectContent>
                </Select>
                 <Select defaultValue="all" onValueChange={(v) => setFilters(f => ({...f, channel: v}))}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les canaux</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="online">Online (Drive)</SelectItem>
                        <SelectItem value="d2c">D2C</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
        
        <Card className="border-l-4 border-primary bg-primary/5">
            <CardHeader className="flex-row items-start gap-4">
                <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                    <CardTitle>Analyse & Recommandations IA</CardTitle>
                    <CardDescription className="mt-2 text-base text-foreground">
                        Analyse pour <strong>Cumul Annuel Mobile (MAT) / Tous canaux</strong>. La performance globale est solide, tirée par le canal Offline. Le canal Online montre un fort potentiel de croissance avec un ROAS élevé. <span className="font-bold text-primary">Action prioritaire :</span> Analyser les causes de la sous-performance de la gamme Skyr sur le canal Online pour débloquer ce potentiel.
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
            <Card key={index}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <kpi.icon className="h-4 w-4" />
                        {kpi.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{kpi.value}</div>
                    {kpi.note && <p className="text-xs text-muted-foreground">{kpi.note}</p>}
                </CardContent>
            </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Répartition du Chiffre d'Affaires par Canal</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie 
                        data={channelData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={80} 
                        outerRadius={120} 
                        paddingAngle={2}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        labelLine={false}
                    >
                        {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString('fr-FR')} €`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
            <h3 className="text-2xl font-headline font-bold mb-4">Plateformes d'Insight</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {insightPlatforms.map(p => <PlatformCard key={p.name} {...p} />)}
            </div>
        </div>
         <div>
            <h3 className="text-2xl font-headline font-bold mb-4">Plateformes d'Activation</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activationPlatforms.map(p => <PlatformCard key={p.name} {...p} />)}
            </div>
        </div>
      </div>
    </div>
  );
}

    