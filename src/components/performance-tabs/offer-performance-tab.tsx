
'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis } from 'recharts';
import { Sparkles, MoveRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OfferByRetailerTab from './offer-by-retailer-tab';
import DecisionTreeTab from './decision-tree-tab';
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

interface OfferPerformanceTabProps {
    filters: Filters;
}

const exportableAssortment = {
    data: ["Classement des Références"],
    graphs: ["Matrice de l'Offre (BCG)"],
};

const generateRankingData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const seededRandom = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };
    
    return [
        { rank: 1, name: 'Yaourt Brassé Fraise 4x125g', ca: seededRandom(4000, 5000), vmh: seededRandom(1000, 1400), marge: seededRandom(1.0, 1.4), exclusifs: seededRandom(15, 20), nourriture: seededRandom(30, 40) },
        { rank: 2, name: 'Grand Pot Nature Bio 450g', ca: seededRandom(3000, 4000), vmh: seededRandom(700, 900), marge: seededRandom(1.3, 1.7), exclusifs: seededRandom(20, 30), nourriture: seededRandom(40, 50) },
        { rank: 3, name: 'Skyr Nature 150g', ca: seededRandom(2800, 3500), vmh: seededRandom(1300, 1700), marge: seededRandom(0.7, 1.0), exclusifs: seededRandom(10, 15), nourriture: seededRandom(20, 30) },
        { rank: 4, name: 'Yaourt à la Grecque Miel 2x150g', ca: seededRandom(2500, 3000), vmh: seededRandom(600, 800), marge: seededRandom(1.6, 2.0), exclusifs: seededRandom(20, 25), nourriture: seededRandom(25, 35) },
        { rank: 5, name: 'Gourde Fraise-Banane 4x90g', ca: seededRandom(2200, 2800), vmh: seededRandom(800, 1000), marge: seededRandom(1.0, 1.3), exclusifs: seededRandom(13, 18), nourriture: seededRandom(35, 45) },
    ].sort((a,b) => b.ca - a.ca).map((item, index) => ({...item, rank: index + 1}));
};

const bcgData = [
  { name: 'Vaches à Lait', vmh: 300, marge: 8, ca: 8000 },
  { name: 'Étoiles', vmh: 320, marge: 18, ca: 6000 },
  { name: 'Dilemmes', vmh: 100, marge: 15, ca: 2000 },
  { name: 'Poids Morts', vmh: 80, marge: 5, ca: 1000 },
];

const AssortmentAnalysisTab = ({ filters }: { filters: Filters }) => {
    const rankingData = useMemo(() => generateRankingData(filters), [filters]);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <ExportDialog tabTitle="Analyse Assortiment" items={exportableAssortment} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Classement des Références</CardTitle>
                    <CardDescription>Performance de chaque produit de votre assortiment.</CardDescription>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rang</TableHead>
                            <TableHead>Référence</TableHead>
                            <TableHead className="text-right">CA Hebdo.</TableHead>
                            <TableHead className="text-right">VMH</TableHead>
                            <TableHead className="text-right">Marge (€)</TableHead>
                            <TableHead className="text-right">% Acheteurs Excl.</TableHead>
                            <TableHead className="text-right">Taux Nourriture</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rankingData.map((row) => (
                            <TableRow key={row.rank}>
                                <TableCell className="font-bold">{row.rank}</TableCell>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell className="text-right">€{row.ca.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</TableCell>
                                <TableCell className="text-right">{row.vmh.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</TableCell>
                                <TableCell className="text-right">€{row.marge.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{row.exclusifs.toFixed(0)}%</TableCell>
                                <TableCell className="text-right">{row.nourriture.toFixed(0)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Matrice de l'Offre (BCG)</CardTitle>
                    <CardDescription>Positionnement stratégique de vos produits (VMH vs Marge).</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="vmh" name="Performance (VMH)" domain={[0, 'dataMax + 50']} />
                            <YAxis type="number" dataKey="marge" name="Rentabilité (Marge %)" unit="%" domain={[0, 'dataMax + 5']} />
                            <ZAxis type="number" dataKey="ca" range={[500, 4000]} name="CA (€)" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => (name === 'CA (€)' ? `${(value as number).toLocaleString('fr-FR')}€` : value)} />
                            <Legend />
                            <Scatter name="Vaches à Lait" data={[bcgData[0]]} fill="hsl(var(--chart-1))" />
                            <Scatter name="Étoiles" data={[bcgData[1]]} fill="hsl(var(--chart-2))" />
                            <Scatter name="Dilemmes" data={[bcgData[2]]} fill="hsl(var(--chart-3))" />
                            <Scatter name="Poids Morts" data={[bcgData[3]]} fill="hsl(var(--chart-4))" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={24} height={24} className="object-contain" />
                    <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">À retenir</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Le produit <strong>Skyr Nature</strong> est un "Dilemme" : forte rentabilité mais faibles ventes. C'est une étoile en devenir.</li>
                            <li>Le <strong>Grand Pot Nature Bio</strong> est un produit clé avec un fort taux d'acheteurs exclusifs ({rankingData.find(p => p.name.includes('Bio'))?.exclusifs.toFixed(0)}%), crucial pour la fidélisation.</li>
                            <li>Le <strong>Yaourt Végétal</strong> est un "Poids Mort" et pourrait être délisté s'il n'est pas stratégique.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Nos recommandations</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li><strong>Développer :</strong> Investir en promotion ou en visibilité sur le <strong>Skyr Nature</strong> pour augmenter ses ventes (VMH) et le transformer en "Étoile".</li>
                            <li><strong>Protéger :</strong> Assurer une disponibilité parfaite et un bon positionnement en rayon pour le <strong>Grand Pot Bio</strong>.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                        <Button variant="link" asChild className="p-0 h-auto">
                           <Link href="/performances?tab=offer&subtab=decision-tree">Analyser l'arbre de décision <MoveRight className="ml-1" /></Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
};

export default function OfferPerformanceTab({ filters }: OfferPerformanceTabProps) {
  return (
    <Tabs defaultValue="assortment" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="assortment">Analyse Assortiment</TabsTrigger>
        <TabsTrigger value="retailer">Analyse par Enseigne</TabsTrigger>
        <TabsTrigger value="decision-tree">Arbre de Décision</TabsTrigger>
      </TabsList>
      <TabsContent value="assortment" className="mt-6">
        <AssortmentAnalysisTab filters={filters} />
      </TabsContent>
      <TabsContent value="retailer" className="mt-6">
        <OfferByRetailerTab filters={filters} />
      </TabsContent>
      <TabsContent value="decision-tree" className="mt-6">
        <DecisionTreeTab filters={filters} />
      </TabsContent>
    </Tabs>
  );
}

    

    