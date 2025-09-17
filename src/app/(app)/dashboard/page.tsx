
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions, channelOptions, retailerOptions, gammeOptions, periodOptions } from '@/services/filters-data';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';

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
    });

    return { kpiData, evolutionData };
};


export default function DashboardPage() {
    const [filters, setFilters] = useState({
        country: 'france',
        channel: 'all',
        retailer: 'all',
        gamme: 'all',
        period: 'mat',
    });
    
    const [visibleKpis, setVisibleKpis] = useState<string[]>(["Chiffre d'Affaires"]);

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };
    
    const handleKpiToggle = (kpi: string) => {
        setVisibleKpis(prev => prev.includes(kpi) ? prev.filter(item => item !== kpi) : [...prev, kpi]);
    }

    const { kpiData, evolutionData } = useMemo(() => generateData(filters), [filters]);
    
    const chartKpis = Object.keys(evolutionData[0]).filter(k => k !== 'name');


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

        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Évolution Hebdomadaire des KPIs (vs N-1)</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {chartKpis.map(kpi => (
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

    </div>
  );
}
