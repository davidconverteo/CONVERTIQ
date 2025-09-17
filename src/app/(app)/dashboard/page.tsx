
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions, channelOptions, retailerOptions, gammeOptions, periodOptions } from '@/services/filters-data';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

const generateKpiData = (filters: any) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };
    
    return {
        ca: random(1800000, 2500000),
        caTrend: random(5, 15),
        volumes: random(800000, 1200000),
        volumesTrend: random(2, 10),
        transactions: random(400000, 600000),
        transactionsTrend: random(-5, 5),
        customers: random(250000, 350000),
        customersTrend: random(1, 8),
    };
};


export default function DashboardPage() {
    const [filters, setFilters] = useState({
        country: 'france',
        channel: 'all',
        retailer: 'all',
        gamme: 'all',
        period: 'mat',
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const kpiData = useMemo(() => generateKpiData(filters), [filters]);

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
                    <p className={`text-xs ${kpiData.caTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.caTrend >= 0 ? '+' : ''}{kpiData.caTrend.toFixed(1)}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volumes</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.volumes.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} unités</div>
                    <p className={`text-xs ${kpiData.volumesTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.volumesTrend >= 0 ? '+' : ''}{kpiData.volumesTrend.toFixed(1)}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.transactions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
                    <p className={`text-xs ${kpiData.transactionsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.transactionsTrend >= 0 ? '+' : ''}{kpiData.transactionsTrend.toFixed(1)}% vs N-1</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nombre de Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiData.customers.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</div>
                    <p className={`text-xs ${kpiData.customersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{kpiData.customersTrend >= 0 ? '+' : ''}{kpiData.customersTrend.toFixed(1)}% vs N-1</p>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
