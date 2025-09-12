
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { Sparkles } from "lucide-react";

const growthData = [
  { name: 'CA N-1', value: 4500000 },
  { name: 'Effet Volume', value: 300000 },
  { name: 'Effet Prix', value: 150000 },
  { name: 'Effet Promo', value: -50000 },
  { name: 'CA N', value: 4900000 },
];

const priceEvoData = [
  { retailer: 'Carrefour', avgPrice: 2.75, priceEvo: '+1.2%', promoWeight: '22%', sovProspectus: '30%' },
  { retailer: 'E.Leclerc', avgPrice: 2.71, priceEvo: '-0.5%', promoWeight: '25%', sovProspectus: '25%' },
  { retailer: 'Intermarché', avgPrice: 2.78, priceEvo: '+2.1%', promoWeight: '18%', sovProspectus: '20%' },
  { retailer: 'Système U', avgPrice: 2.73, priceEvo: '+0.8%', promoWeight: '23%', sovProspectus: '15%' },
];

// Custom bar for waterfall chart
const WaterfallBar = (props: any) => {
  const { x, y, width, height, value, name } = props;
  let color = 'hsl(var(--primary))';
  if (name === 'CA N-1' || name === 'CA N') color = 'hsl(var(--secondary-foreground))';
  else if (value < 0) color = 'hsl(var(--destructive))';
  return <rect x={x} y={y} width={width} height={height} fill={color} />;
};


export default function PricingPerformanceTab() {
    const processedGrowthData = growthData.reduce((acc, entry, index) => {
        if (index === 0 || index === growthData.length - 1) {
            acc.push({ name: entry.name, value: entry.value, range: [0, entry.value] });
        } else {
            const prevEnd = acc[acc.length - 1].range[1];
            acc.push({ name: entry.name, value: entry.value, range: [prevEnd, prevEnd + entry.value] });
        }
        return acc;
    }, [] as any[]);


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
              <Tooltip formatter={(value: number, name: string, props) => [`${props.payload.value.toLocaleString('fr-FR')} €`, name]} />
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
                <TableCell className={`text-right font-medium ${row.priceEvo.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{row.priceEvo}</TableCell>
                <TableCell className="text-right">{row.promoWeight}</TableCell>
                <TableCell className="text-right">{row.sovProspectus}</TableCell>
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
                <p className="text-sm text-muted-foreground">La croissance du CA de <strong>+400k€</strong> est principalement portée par l'effet <strong>volume (+300k€)</strong> et l'effet <strong>prix (+150k€)</strong>. L'effet promotionnel est négatif (-50k€), suggérant des promotions trop coûteuses ou inefficaces.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Revoir la stratégie promotionnelle chez E.Leclerc où le poids promo est le plus élevé mais l'évolution du prix est négative. Optimiser la mécanique ou la générosité des offres.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
