
'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Sparkles, MoveRight } from "lucide-react";
import ExportDialog from './export-dialog';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface PricingPerformanceTabProps {
    filters: Filters;
}

const exportableItems = {
    data: ["Tableau de pilotage Prix & Promo"],
    graphs: ["Pont de Croissance du CA"],
};

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

    const priceEvoData = [
      { retailer: 'Carrefour', avgPrice: random(2.7, 2.8), priceEvo: random(1, 2), promoWeight: random(20,24), sovProspectus: random(28,32) },
      { retailer: 'E.Leclerc', avgPrice: random(2.65, 2.75), priceEvo: random(-1, 0), promoWeight: random(23, 27), sovProspectus: random(23, 27) },
      { retailer: 'Intermarché', avgPrice: random(2.78, 2.85), priceEvo: random(1.5, 2.5), promoWeight: random(16, 20), sovProspectus: random(18, 22) },
      { retailer: 'Système U', avgPrice: random(2.7, 2.76), priceEvo: random(0.5, 1.2), promoWeight: random(21, 25), sovProspectus: random(13, 17) },
    ];
    
    const caN1 = random(4000000, 5000000);
    const effetVolume = random(250000, 350000);
    const effetPrix = random(100000, 200000);
    const effetPromo = random(-70000, -30000);
    const caN = caN1 + effetVolume + effetPrix + effetPromo;
    
    const growthData = [
      { name: 'CA N-1', value: caN1 },
      { name: 'Effet Volume', value: effetVolume },
      { name: 'Effet Prix', value: effetPrix },
      { name: 'Effet Promo', value: effetPromo },
      { name: 'CA N', value: caN },
    ];

    return { priceEvoData, growthData };
};


export default function PricingPerformanceTab({ filters }: PricingPerformanceTabProps) {
  const { priceEvoData, growthData } = useMemo(() => generatePricingData(filters), [filters]);

  const processedGrowthData = useMemo(() => {
    let cumulative = 0;
    return growthData.map((item, index) => {
        let phantom = 0;
        let val = item.value;

        if (index > 0 && index < growthData.length - 1) {
            phantom = cumulative;
            cumulative += val;
        } else if (index === growthData.length - 1) { // CA N
            phantom = 0;
            cumulative += val;
        } else { // CA N-1
            cumulative += val;
        }
        
        return {
            name: item.name,
            value: val,
            range: [phantom, cumulative]
        };
    });
  }, [growthData]);


  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <ExportDialog tabTitle="Prix & Promotions" items={exportableItems} />
        </div>
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
            <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Image src="https://i.postimg.cc/sX4YyC2j/Convert-IQ-logo-2.png" alt="ConvertIQ Logo" width={24} height={24} className="object-contain" />
                <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <div>
                    <h4 className="font-semibold mb-1">À retenir</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li>La croissance du CA est saine, tirée par les effets <strong>volume</strong> et <strong>prix</strong>.</li>
                        <li>L'effet promotionnel est négatif (<strong>{growthData[3].value.toLocaleString('fr-FR')}€</strong>), suggérant des promotions trop coûteuses ou inefficaces.</li>
                        <li><strong>E.Leclerc</strong> a le poids promo le plus élevé ({priceEvoData.find(d=>d.retailer==='E.Leclerc')?.promoWeight.toFixed(0)}%) et une évolution de prix négative.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Nos recommandations</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li><strong>Analyser :</strong> Examiner en détail le retour sur investissement des promotions chez E.Leclerc.</li>
                        <li><strong>Optimiser :</strong> Tester des mécaniques promotionnelles moins coûteuses (ex: 2+1 au lieu de -50% sur le 2ème) chez les enseignes où la pression promo est forte.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/retail-media">Consulter les détails des campagnes Retail Media <MoveRight className="ml-1" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    

    

    