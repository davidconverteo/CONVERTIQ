
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const data = {
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
            <span className="font-bold text-foreground">{data.volume.toLocaleString('fr-FR')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Notre PDM</span>
            <span className="font-bold text-foreground">{data.pdm}%</span>
          </div>
           <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Perf. Catégorie</span>
            <span className="font-bold text-foreground">{data.perf}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export default function PotentialPerformanceTab() {
  const [selectedGamme, setSelectedGamme] = useState<keyof typeof data>('all');
  const chartData = data[selectedGamme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Matrice de Potentiel de Développement</CardTitle>
                <CardDescription>Croisement PDM vs Performance Catégorie. Taille de la bulle = Volume des ventes.</CardDescription>
            </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="pdm" name="Part de Marché" unit="%" domain={[0, 'dataMax + 5']} />
            <YAxis type="number" dataKey="perf" name="Performance Catégorie" unit="" domain={[80, 'dataMax + 10']} />
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
            <p className="text-sm text-muted-foreground">La matrice montre un <strong>fort potentiel de croissance chez Auchan</strong>, où la catégorie performe bien (indice 120) mais notre part de marché est faible (15%).</p>
            <p className="text-sm text-muted-foreground mt-4">À l'inverse, notre position chez Casino est une <strong>zone de risque</strong> : notre PDM est forte (28%) mais la catégorie y sous-performe (indice 85).</p>
            <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Lancer un plan de développement de la part de marché chez Auchan (négociation assortiment, trade marketing). Analyser les causes de la sous-performance de la catégorie chez Casino pour défendre notre position.</p>
        </CardContent>
    </Card>
    </div>
  );
}
