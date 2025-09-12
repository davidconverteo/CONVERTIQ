
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const scorecardData = [
  { retailer: 'E.Leclerc Drive', sellout: '€875k', oos: 1.5, sov: 35, rating: 4.8, priceIndex: 101 },
  { retailer: 'Carrefour Drive', sellout: '€750k', oos: 2.1, sov: 28, rating: 4.7, priceIndex: 103 },
  { retailer: 'Courses U', sellout: '€500k', oos: 3.5, sov: 25, rating: 4.5, priceIndex: 102 },
  { retailer: 'Auchan Drive', sellout: '€375k', oos: 2.8, sov: 22, rating: 4.6, priceIndex: 102 },
];

const comparisonData = [
    { indicator: 'Panier Moyen', drive: 4.55, offline: 3.79, diff: 20.1 },
    { indicator: 'Articles / Panier', drive: 1.8, offline: 1.4, diff: 28.6 },
    { indicator: 'Prix Moyen / Article', drive: 2.53, offline: 2.71, diff: -6.6 },
    { indicator: 'Poids Ventes Promo', drive: 28, offline: 18, diff: 55.6 },
];

export default function OnlinePerformanceTab() {
  return (
    <div className="space-y-6">
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
                  <TableCell className="text-right">{row.sellout}</TableCell>
                  <TableCell className={`text-right ${row.oos > 3 ? 'text-red-500' : 'text-green-500'}`}>{row.oos}%</TableCell>
                  <TableCell className="text-right">{row.sov}%</TableCell>
                  <TableCell className="text-right">{row.rating}</TableCell>
                  <TableCell className={`text-right ${row.priceIndex > 100 ? 'text-red-500' : 'text-green-500'}`}>{row.priceIndex}</TableCell>
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
                          <TableCell className="text-right">{row.indicator.includes('Promo') ? `${row.drive.toFixed(1)}%` : `€${row.drive.toFixed(2)}`}</TableCell>
                          <TableCell className="text-right">{row.indicator.includes('Promo') ? `${row.offline.toFixed(1)}%` : `€${row.offline.toFixed(2)}`}</TableCell>
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
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Le canal Drive montre un <strong>panier moyen supérieur de 20%</strong> à l'offline, tiré par un nombre d'articles par panier plus élevé. La sensibilité à la promotion y est également plus forte.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Le taux de rupture chez Courses U (3.5%) est un point d'attention. Coordonnez-vous avec l'enseigne pour optimiser les stocks sur vos références clés. </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
