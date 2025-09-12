
'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Sparkles } from "lucide-react";

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface PricingPerformanceTabProps {
    filters: Filters;
}

const generatePricingData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };
    
    const growthData = [
      { name: 'CA N-1', value: random(4400000, 4600000) },
      { name: 'Effet Volume', value: random(250000, 350000) },
      { name: 'Effet Prix', value: random(100000, 200000) },
      { name: 'Effet Promo', value: random(-70000, -30000) },
      { name: 'CA N', value: 0 },
    ];
    growthData[4].value = growthData.slice(0,4).reduce((sum, item) => sum + item.value, 0);

    const priceEvoData = [
      { retailer: 'Carrefour', avgPrice: random(2.7, 2.8), priceEvo: random(1.0, 1.5), promoWeight: random(21, 23), sovProspectus: random(28, 32) },
      { retailer: 'E.Leclerc', avgPrice: random(2.68, 2.72), priceEvo: random(-0.8, -0.2), promoWeight: random(24, 26), sovProspectus: random(23, 27) },
      { retailer: 'Intermarché', avgPrice: random(2.75, 2.82), priceEvo: random(1.8, 2.4), promoWeight: random(17, 19), sovProspectus: random(18, 22) },
      { retailer: 'Système U', avgPrice: random(2.71, 2.76), priceEvo: random(0.6, 1.0), promoWeight: random(22, 24), sovProspectus: random(13, 17) },
    ];

    return { growthData, priceEvoData };
};

export default function PricingPerformanceTab({ filters }: PricingPerformanceTabProps) {
    const { growthData, priceEvoData } = useMemo(() => generatePricingData(filters), [filters]);
    
    const processedGrowthData = useMemo(() => {
        return growthData.reduce((acc, entry, index) => {
            if (index === 0 || index === growthData.length - 1) {
                acc.push({ name: entry.name, value: entry.value, range: [0, entry.value] });
            } else {
                const prevEnd = acc[acc.length - 1].range[1];
                acc.push({ name: entry.name, value: entry.value, range: [prevEnd, prevEnd + entry.value] });
            }
            return acc;
        }, [] as any[]);
    }, [growthData]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pont de Croissance du CA</CardTitle>
          <CardDescription>Décomposition de l'évolution du chiffre d'affaires entre N-1 et N.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
             <BarChart data={processedGrowthData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value:number) => `${(value / 1000000).toFixed(1)}M €`} />
              <Tooltip formatter={(value: number, name: string, props) => [`${props.payload.value.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €`, name]} />
              <Bar dataKey="range" name="Contribution">
                {processedGrowthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 || index === processedGrowthData.length-1 ? 'hsl(var(--secondary-foreground))' : entry.value > 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilotage Prix & Promo par Enseigne</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enseigne</TableHead>
              <TableHead className="text-right">Prix Moyen/U</TableHead>
              <TableHead className="text-right">Évo. Prix</TableHead>
              <TableHead className="text-right">Poids Promo</TableHead>
              <TableHead className="text-right">PDV Prospectus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceEvoData.map((row) => (
              <TableRow key={row.retailer}>
                <TableCell className="font-medium">{row.retailer}</TableCell>
                <TableCell className="text-right">€{row.avgPrice.toFixed(2)}</TableCell>
                <TableCell className={`text-right font-medium ${row.priceEvo > 0 ? 'text-green-600' : 'text-red-600'}`}>{row.priceEvo > 0 ? '+' : ''}{row.priceEvo.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{row.promoWeight.toFixed(0)}%</TableCell>
                <TableCell className="text-right">{row.sovProspectus.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
       <Card>
            <CardHeader className="flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">La croissance du CA de <strong>+{((processedGrowthData[4].value / processedGrowthData[0].value) - 1) * 100).toFixed(1)}%</strong> est principalement portée par l'effet <strong>volume (+{growthData[1].value.toLocaleString('fr-FR', {maximumFractionDigits: 0})}€)</strong> et l'effet <strong>prix (+{growthData[2].value.toLocaleString('fr-FR', {maximumFractionDigits: 0})}€)</strong>. L'effet promotionnel est négatif ({growthData[3].value.toLocaleString('fr-FR', {maximumFractionDigits: 0})}€), suggérant des promotions trop coûteuses ou inefficaces.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Revoir la stratégie promotionnelle chez E.Leclerc où le poids promo est le plus élevé mais l'évolution du prix est négative. Optimiser la mécanique ou la générosité des offres.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
