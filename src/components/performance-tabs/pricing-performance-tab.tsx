
'use client';

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

// Données statiques pour garantir la stabilité
const staticPriceEvoData = [
  { retailer: 'Carrefour', avgPrice: 2.75, priceEvo: 1.2, promoWeight: 22, sovProspectus: 30 },
  { retailer: 'E.Leclerc', avgPrice: 2.70, priceEvo: -0.5, promoWeight: 25, sovProspectus: 25 },
  { retailer: 'Intermarché', avgPrice: 2.80, priceEvo: 2.1, promoWeight: 18, sovProspectus: 20 },
  { retailer: 'Système U', avgPrice: 2.73, priceEvo: 0.8, promoWeight: 23, sovProspectus: 15 },
];

const staticProcessedGrowthData = [
    { name: 'CA N-1', value: 4500000, range: [0, 4500000] },
    { name: 'Effet Volume', value: 300000, range: [4500000, 4800000] },
    { name: 'Effet Prix', value: 150000, range: [4800000, 4950000] },
    { name: 'Effet Promo', value: -50000, range: [4950000, 4900000] },
    { name: 'CA N', value: 4900000, range: [0, 4900000] },
];


export default function PricingPerformanceTab({ filters }: PricingPerformanceTabProps) {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pont de Croissance du CA</CardTitle>
          <CardDescription>Décomposition de l'évolution du chiffre d'affaires entre N-1 et N.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
             <BarChart data={staticProcessedGrowthData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value:number) => `${(value / 1000000).toFixed(1)}M €`} />
              <Tooltip formatter={(value: number, name: string, props) => [`${props.payload.value.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €`, name]} />
              <Bar dataKey="range" name="Contribution">
                {staticProcessedGrowthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 || index === staticProcessedGrowthData.length-1 ? 'hsl(var(--secondary-foreground))' : entry.value > 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}/>
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
            {staticPriceEvoData.map((row) => (
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
                <p className="text-sm text-muted-foreground">La croissance du CA de <strong>+8.9%</strong> est principalement portée par l'effet <strong>volume (+300k€)</strong> et l'effet <strong>prix (+150k€)</strong>. L'effet promotionnel est négatif (-50k€), suggérant des promotions trop coûteuses ou inefficaces.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Revoir la stratégie promotionnelle chez E.Leclerc où le poids promo est le plus élevé mais l'évolution du prix est négative. Optimiser la mécanique ou la générosité des offres.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

