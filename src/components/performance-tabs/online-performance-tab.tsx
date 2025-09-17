'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Sparkles, MoveRight } from "lucide-react";
import ExportDialog from './export-dialog';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
};

interface OnlinePerformanceTabProps {
    filters: Filters;
}

const exportableItems = {
    data: ["Scorecard Digital Shelf", "Tableau comparatif Drive vs. Offline"],
    graphs: [],
};

const generateOnlineData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };
    
    const scorecardData = [
      { retailer: 'E.Leclerc Drive', sellout: random(800, 900), oos: random(1.0, 2.0), sov: random(33, 38), rating: random(4.7, 4.9), priceIndex: random(100, 102) },
      { retailer: 'Carrefour Drive', sellout: random(700, 800), oos: random(1.8, 2.5), sov: random(25, 30), rating: random(4.6, 4.8), priceIndex: random(102, 104) },
      { retailer: 'Courses U', sellout: random(450, 550), oos: random(3.0, 4.0), sov: random(23, 28), rating: random(4.4, 4.6), priceIndex: random(101, 103) },
      { retailer: 'Auchan Drive', sellout: random(350, 400), oos: random(2.5, 3.2), sov: random(20, 25), rating: random(4.5, 4.7), priceIndex: random(101, 103) },
    ];

    const comparisonData = [
        { indicator: 'Panier Moyen', drive: random(4.3, 4.8), offline: 3.79, diff: 0 },
        { indicator: 'Articles / Panier', drive: random(1.7, 2.0), offline: 1.4, diff: 0 },
        { indicator: 'Prix Moyen / Article', drive: random(2.5, 2.6), offline: 2.71, diff: 0 },
        { indicator: 'Poids Ventes Promo', drive: random(25, 30), offline: 18, diff: 0 },
    ].map(item => ({...item, diff: (item.drive / item.offline - 1) * 100 }));

    return { scorecardData, comparisonData };
};


export default function OnlinePerformanceTab({ filters }: OnlinePerformanceTabProps) {
  const { scorecardData, comparisonData } = useMemo(() => generateOnlineData(filters), [filters]);

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <ExportDialog tabTitle="Online (Drive)" items={exportableItems} />
        </div>
       <Card>
        <CardHeader>
          <CardTitle>Scorecard Digital Shelf par Enseigne (Drive)</CardTitle>
          <CardDescription>Performance de vos produits sur les sites de drive.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enseigne</TableHead>
                <TableHead className="text-right">CA Sell-Out</TableHead>
                <TableHead className="text-right">Taux Rupture (%)</TableHead>
                <TableHead className="text-right">Part de Voix (%)</TableHead>
                <TableHead className="text-right">Note Moyenne (/5)</TableHead>
                <TableHead className="text-right">Indice Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scorecardData.map((row) => (
                <TableRow key={row.retailer}>
                  <TableCell className="font-medium">{row.retailer}</TableCell>
                  <TableCell className="text-right">€{row.sellout.toFixed(0)}k</TableCell>
                  <TableCell className={`text-right ${row.oos > 3 ? 'text-red-500' : 'text-green-500'}`}>{row.oos.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{row.sov.toFixed(0)}%</TableCell>
                  <TableCell className="text-right">{row.rating.toFixed(1)}</TableCell>
                  <TableCell className={`text-right ${row.priceIndex > 100 ? 'text-red-500' : 'text-green-500'}`}>{row.priceIndex.toFixed(0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
          <CardHeader>
              <CardTitle>Analyse Stratégique : Drive vs. Offline</CardTitle>
              <CardDescription>Comparaison des comportements d'achat entre les deux canaux.</CardDescription>
          </CardHeader>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Indicateur</TableHead>
                      <TableHead className="text-right">Drive</TableHead>
                      <TableHead className="text-right">Offline</TableHead>
                      <TableHead className="text-right">Écart</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {comparisonData.map((row) => (
                      <TableRow key={row.indicator}>
                          <TableCell className="font-medium">{row.indicator}</TableCell>
                          <TableCell className="text-right">{row.indicator.includes('%') ? `${row.drive.toFixed(1)}%` : `€${row.drive.toFixed(2)}`}</TableCell>
                          <TableCell className="text-right">{row.indicator.includes('%') ? `${row.offline.toFixed(1)}%` : `€${row.offline.toFixed(2)}`}</TableCell>
                          <TableCell className={`text-right font-bold ${row.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {row.diff > 0 ? '+' : ''}{row.diff.toFixed(1)}%
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </Card>
       <Card>
            <CardHeader className="flex-row items-center gap-2">
                <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={32} height={32} className="object-contain" />
                <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold mb-1">À retenir</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li>Le panier moyen en Drive est <strong>supérieur de {comparisonData[0].diff.toFixed(0)}%</strong> à celui en magasin physique.</li>
                        <li>La sensibilité à la promotion est plus forte en Drive (<strong>{comparisonData.find(d => d.indicator === 'Poids Ventes Promo')?.drive.toFixed(0)}%</strong> des ventes).</li>
                        <li>Le taux de rupture chez <strong>Courses U ({scorecardData.find(d => d.retailer === 'Courses U')?.oos.toFixed(1)}%)</strong> est un point d'attention.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Nos recommandations</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li><strong>Optimiser :</strong> Coordonner avec Courses U pour optimiser les stocks sur vos références clés et réduire le taux de rupture.</li>
                        <li><strong>Cibler :</strong> Mettre en place des promotions exclusives au Drive pour maximiser le panier moyen.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/digital-shelf">Explorer les détails du Digital Shelf <MoveRight className="ml-1" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
