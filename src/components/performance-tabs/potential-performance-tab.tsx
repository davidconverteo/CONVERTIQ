
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import ExportDialog from './export-dialog';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface PotentialPerformanceTabProps {
    filters: Filters;
}

const exportableItems = {
    data: [],
    graphs: ["Matrice de Potentiel de Développement"],
};

const generateData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };

    const baseData = {
        'all': [
            { retailer: 'E.Leclerc', pdm: 24.1, perf: 115, volume: 350000, color: 'hsl(var(--chart-1))' },
            { retailer: 'Carrefour', pdm: 25.5, perf: 110, volume: 300000, color: 'hsl(var(--chart-2))' },
            { retailer: 'Auchan', pdm: 15, perf: 120, volume: 250000, color: 'hsl(var(--chart-3))' },
            { retailer: 'Casino', pdm: 28, perf: 85, volume: 150000, color: 'hsl(var(--chart-4))' },
            { retailer: 'Lidl', pdm: 8, perf: 90, volume: 200000, color: 'hsl(var(--chart-5))' },
        ],
        'bio': [
            { retailer: 'E.Leclerc', pdm: 18, perf: 105, volume: 80000, color: 'hsl(var(--chart-1))' },
            { retailer: 'Carrefour', pdm: 22, perf: 115, volume: 95000, color: 'hsl(var(--chart-2))' },
            { retailer: 'Biocoop', pdm: 12, perf: 130, volume: 120000, color: 'hsl(var(--chart-3))' },
        ],
        'skyr': [
            { retailer: 'E.Leclerc', pdm: 30, perf: 120, volume: 150000, color: 'hsl(var(--chart-1))' },
            { retailer: 'Carrefour', pdm: 28, perf: 110, volume: 120000, color: 'hsl(var(--chart-2))' },
        ]
    };

    return Object.keys(baseData).reduce((acc, key) => {
        acc[key as keyof typeof baseData] = baseData[key as keyof typeof baseData].map(d => ({
            ...d,
            pdm: d.pdm * random(0.9, 1.1),
            perf: d.perf * random(0.95, 1.05),
            volume: d.volume * random(0.8, 1.2),
        }));
        return acc;
    }, {} as typeof baseData);
};


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Enseigne</span>
            <span className="font-bold text-foreground">{data.retailer}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Volume Ventes</span>
            <span className="font-bold text-foreground">{data.volume.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Notre PDM</span>
            <span className="font-bold text-foreground">{data.pdm.toFixed(1)}%</span>
          </div>
           <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Perf. Catégorie</span>
            <span className="font-bold text-foreground">{data.perf.toFixed(0)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export default function PotentialPerformanceTab({ filters }: PotentialPerformanceTabProps) {
  const [selectedGamme, setSelectedGamme] = useState<keyof ReturnType<typeof generateData>>('all');
  const data = useMemo(() => generateData(filters), [filters]);
  const chartData = data[selectedGamme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <CardTitle>Matrice de Potentiel de Développement</CardTitle>
                        <CardDescription>Croisement PDM vs Performance Catégorie. Taille de la bulle = Volume des ventes.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select onValueChange={(value: keyof typeof data) => setSelectedGamme(value)} defaultValue="all">
                            <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="Filtrer par gamme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toute la marque</SelectItem>
                                <SelectItem value="bio">Gamme Bio</SelectItem>
                                <SelectItem value="skyr">Gamme Skyr</SelectItem>
                            </SelectContent>
                        </Select>
                        <ExportDialog tabTitle="Potentiel" items={exportableItems} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={450}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="pdm" name="Part de Marché" unit="%" domain={[0, 'dataMax + 5']} tickFormatter={(v) => v.toFixed(0)} />
                    <YAxis type="number" dataKey="perf" name="Performance Catégorie" unit="" domain={[80, 'dataMax + 10']} tickFormatter={(v) => v.toFixed(0)}/>
                    <ZAxis type="number" dataKey="volume" range={[400, 4000]} name="Volume" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Legend />
                    <Scatter name="Enseignes" data={chartData}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Scatter>
                </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">La matrice montre un <strong>fort potentiel de croissance chez Auchan</strong>, où la catégorie performe bien (indice {data['all'].find(d => d.retailer === 'Auchan')?.perf.toFixed(0)}) mais notre part de marché est faible ({data['all'].find(d => d.retailer === 'Auchan')?.pdm.toFixed(1)}%).</p>
                <p className="text-sm text-muted-foreground mt-4">À l'inverse, notre position chez Casino est une <strong>zone de risque</strong> : notre PDM est forte ({data['all'].find(d => d.retailer === 'Casino')?.pdm.toFixed(1)}%) mais la catégorie y sous-performe (indice {data['all'].find(d => d.retailer === 'Casino')?.perf.toFixed(0)}).</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Lancer un plan de développement de la part de marché chez Auchan (négociation assortiment, trade marketing). Analyser les causes de la sous-performance de la catégorie chez Casino pour défendre notre position.</p>
            </CardContent>
        </Card>
    </div>
  );
}
