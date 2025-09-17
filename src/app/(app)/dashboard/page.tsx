
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions, channelOptions, retailerOptions, gammeOptions, periodOptions } from '@/services/filters-data';

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

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Cockpit de Pilotage</CardTitle>
                <CardDescription>Vue d'ensemble de votre performance marketing.</CardDescription>
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
    </div>
  );
}
