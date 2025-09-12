
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis } from 'recharts';
import { Sparkles } from "lucide-react";

const rankingData = [
    { rank: 1, name: 'Yaourt Brassé Fraise 4x125g', ca: 4800, vmh: 1200, marge: 1.2, exclusifs: 18, nourriture: 35 },
    { rank: 2, name: 'Grand Pot Nature Bio 450g', ca: 3500, vmh: 800, marge: 1.5, exclusifs: 25, nourriture: 45 },
    { rank: 3, name: 'Skyr Nature 150g', ca: 3200, vmh: 1500, marge: 0.8, exclusifs: 12, nourriture: 25 },
    { rank: 4, name: 'Yaourt à la Grecque Miel 2x150g', ca: 2800, vmh: 700, marge: 1.8, exclusifs: 22, nourriture: 30 },
    { rank: 5, name: 'Gourde Fraise-Banane 4x90g', ca: 2500, vmh: 900, marge: 1.1, exclusifs: 15, nourriture: 40 },
];

const bcgData = [
  { name: 'Vaches à Lait', vmh: 300, marge: 8, ca: 8000 },
  { name: 'Étoiles', vmh: 320, marge: 18, ca: 6000 },
  { name: 'Dilemmes', vmh: 100, marge: 15, ca: 2000 },
  { name: 'Poids Morts', vmh: 80, marge: 5, ca: 1000 },
];


export default function OfferPerformanceTab() {
  return (
    <div className="space-y-6">
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
                            <TableCell className="text-right">€{row.ca.toLocaleString('fr-FR')}</TableCell>
                            <TableCell className="text-right">{row.vmh.toLocaleString('fr-FR')}</TableCell>
                            <TableCell className="text-right">€{row.marge.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{row.exclusifs}%</TableCell>
                            <TableCell className="text-right">{row.nourriture}%</TableCell>
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
            <CardHeader className="flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Votre produit <strong>Skyr Nature</strong> est un "Dilemme" : forte rentabilité mais faible performance commerciale. Il nécessite un plan d'action pour le faire passer en "Étoile".</p>
                <p className="text-sm text-muted-foreground mt-4">Le <strong>Grand Pot Nature Bio</strong> est un produit clé, avec un fort taux d'acheteurs exclusifs (25%). Il est crucial pour la fidélisation.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Investir en promotion ou en visibilité sur le Skyr Nature pour augmenter ses ventes (VMH). Protéger la position du Grand Pot Bio en assurant une disponibilité parfaite.</p>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
