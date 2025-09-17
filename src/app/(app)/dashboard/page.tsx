
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions, channelOptions, retailerOptions, gammeOptions, periodOptions } from '@/services/filters-data';
import { DollarSign, Package, ShoppingCart, Users, MoveRight, Loader2, User, Heart, Settings, ThumbsDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateDashboardInsights, DashboardInsightsOutput } from '@/ai/flows/generate-dashboard-insights';
import { generateCustomerPersona, GenerateCustomerPersonaOutput } from '@/ai/flows/generate-customer-persona';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const generateData = (filters: any) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number, salt: string = "") => {
        let t = seed + hashCode(salt) + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };
    
    const kpiData = {
        ca: random(1800000, 2500000, 'ca'),
        caTrend: random(5, 15, 'caTrend'),
        volumes: random(800000, 1200000, 'vol'),
        volumesTrend: random(2, 10, 'volTrend'),
        transactions: random(400000, 600000, 'trans'),
        transactionsTrend: random(-5, 5, 'transTrend'),
        customers: random(250000, 350000, 'cust'),
        customersTrend: random(1, 8, 'custTrend'),
    };

    let weeksToShow = 52;
    switch (filters.period) {
        case 'ytd':
            weeksToShow = 32; // Assuming we are in August
            break;
        case 'last_quarter':
            weeksToShow = 12;
            break;
        case 'last_month':
            weeksToShow = 4;
            break;
        case 'mat':
        default:
            weeksToShow = 52;
            break;
    }
    
    const evolutionData = Array.from({length: weeksToShow}, (_, i) => {
        const week = weeksToShow - i;
        return {
            name: `S-${week}`,
            "Chiffre d'Affaires": random(kpiData.caTrend - 5, kpiData.caTrend + 5, `ca_w${week}`),
            "Volumes": random(kpiData.volumesTrend - 4, kpiData.volumesTrend + 4, `vol_w${week}`),
            "Transactions": random(kpiData.transactionsTrend - 3, kpiData.transactionsTrend + 3, `trans_w${week}`),
            "Clients": random(kpiData.customersTrend - 2, kpiData.customersTrend + 2, `cust_w${week}`),
        }
    }).reverse();

    return { kpiData, evolutionData };
};


export default function DashboardPage() {
    const { toast } = useToast();
    const [filters, setFilters] = useState({
        country: 'france',
        channel: 'all',
        retailer: 'all',
        gamme: 'all',
        period: 'mat',
    });
    
    const [visibleKpis, setVisibleKpis] = useState<string[]>(["Chiffre d'Affaires"]);
    const [insights, setInsights] = useState<DashboardInsightsOutput | null>(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [persona, setPersona] = useState<GenerateCustomerPersonaOutput | null>(null);
    const [isLoadingPersona, setIsLoadingPersona] = useState(true);

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };
    
    const handleKpiToggle = (kpi: string) => {
        setVisibleKpis(prev => prev.includes(kpi) ? prev.filter(item => item !== kpi) : [...prev, kpi]);
    }

    const { kpiData, evolutionData } = useMemo(() => generateData(filters), [filters]);
    
    useEffect(() => {
        const fetchAiData = async () => {
            setIsLoadingInsights(true);
            setIsLoadingPersona(true);
            
            try {
                const [insightsResult, personaResult] = await Promise.all([
                    generateDashboardInsights({ filters, kpis: kpiData }),
                    generateCustomerPersona({ filters })
                ]);
                setInsights(insightsResult);
                setPersona(personaResult);
            } catch (error) {
                console.error("Failed to fetch AI data:", error);
                toast({
                    variant: "destructive",
                    title: "Erreur de l'IA",
                    description: "Impossible de générer les insights ou le persona. Avez-vous configuré votre clé API ?",
                });
                setInsights(null);
                setPersona(null);
            } finally {
                setIsLoadingInsights(false);
                setIsLoadingPersona(false);
            }
        };

        fetchAiData();
    }, [filters, kpiData, toast]);


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Cockpit de Pilotage</CardTitle>
                <CardDescription>Filtrez les données pour affiner votre analyse de performance.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                 <Select value={filters.country} onValueChange={(v) => handleFilterChange('country', v)}>
                    <SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger>
                    <SelectContent>
                        {countryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={filters.channel} onValueChange={(v) => handleFilterChange('channel', v)}>
                    <SelectTrigger><SelectValue placeholder="Circuit" /></SelectTrigger>
                    <SelectContent>
                        {channelOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.retailer} onValueChange={(v) => handleFilterChange('retailer', v)}>
                    <SelectTrigger><SelectValue placeholder="Enseigne" /></SelectTrigger>
                    <SelectContent>
                        {retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={filters.gamme} onValueChange={(v) => handleFilterChange('gamme', v)}>
                    <SelectTrigger><SelectValue placeholder="Gamme" /></SelectTrigger>
                    <SelectContent>
                        {gammeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={filters.period} onValueChange={(v) => handleFilterChange('period', v)}>
                    <SelectTrigger><SelectValue placeholder="Période" /></SelectTrigger>
                    <SelectContent>
                        {periodOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.ca.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</div>
                    <p className={`text-xs ${kpiData.caTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.caTrend >= 0 ? '+' : ''}{kpiData.caTrend.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volumes</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.volumes.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} unités</div>
                    <p className={`text-xs ${kpiData.volumesTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.volumesTrend >= 0 ? '+' : ''}{kpiData.volumesTrend.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.transactions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
                    <p className={`text-xs ${kpiData.transactionsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.transactionsTrend >= 0 ? '+' : ''}{kpiData.transactionsTrend.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nombre de Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.customers.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
                    <p className={`text-xs ${kpiData.customersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.customersTrend >= 0 ? '+' : ''}{kpiData.customersTrend.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}% vs N-1</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle>Évolution Hebdomadaire des KPIs (vs N-1)</CardTitle>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                <YAxis yAxisId="left" stroke="hsl(var(--primary))" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                                <Tooltip
                                formatter={(value: number) => [`${value.toFixed(2)}%`, `vs N-1`]}
                                />
                                <Legend />
                                {visibleKpis.includes("Chiffre d'Affaires") && <Line yAxisId="left" type="monotone" dataKey="Chiffre d'Affaires" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />}
                                {visibleKpis.includes("Volumes") && <Line yAxisId="right" type="monotone" dataKey="Volumes" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />}
                                {visibleKpis.includes("Transactions") && <Line yAxisId="right" type="monotone" dataKey="Transactions" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />}
                                {visibleKpis.includes("Clients") && <Line yAxisId="right" type="monotone" dataKey="Clients" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex-row items-center gap-2 space-y-0">
                        <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={24} height={24} className="object-contain" />
                        <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm min-h-[220px]">
                        {isLoadingInsights ? (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="pt-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ) : insights ? (
                            <>
                                <div>
                                    <h4 className="font-semibold mb-1">À retenir</h4>
                                    <ul className="list-disc pl-5 text-muted-foreground">
                                        {insights.takeaways.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Nos recommandations</h4>
                                    <ul className="list-disc pl-5 text-muted-foreground">
                                        {insights.recommendations.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                                    <Button variant="link" asChild className="p-0 h-auto">
                                        <Link href={insights.nextStep.href}>{insights.nextStep.text} <MoveRight className="ml-1" /></Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">Les recommandations de l'IA n'ont pas pu être chargées.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Persona Client</CardTitle>
                    <CardDescription>Profil type du client sur ce segment.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingPersona ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    ) : persona ? (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <Avatar className="h-24 w-24 border-2 border-primary">
                                    <AvatarImage src={persona.imageUrl} alt={persona.name} />
                                    <AvatarFallback>{persona.name.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{persona.name}</h3>
                                    <p className="text-muted-foreground">{`${persona.age} ans, ${persona.familyStatus}`}</p>
                                    <p className="text-sm text-muted-foreground">{persona.profession}</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold flex items-center gap-1"><Settings /> Habitudes</h4>
                                    <ul className="list-disc pl-5 text-muted-foreground">
                                        {persona.habits.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-1"><Heart /> Motivations</h4>
                                     <ul className="list-disc pl-5 text-muted-foreground">
                                        {persona.motivations.map((m, i) => <li key={i}>{m}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-1"><ThumbsDown /> Frustrations</h4>
                                     <ul className="list-disc pl-5 text-muted-foreground">
                                        {persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <p className="text-muted-foreground">Le persona client n'a pas pu être chargé.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
