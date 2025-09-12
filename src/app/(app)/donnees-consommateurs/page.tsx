'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Sparkles, ArrowRight, ArrowLeft, TrendingUp, TrendingDown, Users, Repeat, HandCoins } from 'lucide-react';
import { retailerOptions, brandOptions } from '@/services/filters-data';

type Filters = {
    retailer: string;
    brand: string;
};

const generateData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number, salt: string) => {
        let t = seed + hashCode(salt) + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max-min) + min;
    };

    const gains = [
        { source: 'Danone', volume: random(15, 25, 'g-danone') },
        { source: 'Yoplait', volume: random(10, 20, 'g-yoplait') },
        { source: 'MDD', volume: random(20, 30, 'g-mdd') },
        { source: 'Nouveaux Acheteurs', volume: random(30, 40, 'g-new') },
    ].sort((a,b) => b.volume - a.volume);

    const pertes = [
        { destination: 'Danone', volume: random(8, 15, 'p-danone') },
        { destination: 'Yoplait', volume: random(12, 18, 'p-yoplait') },
        { destination: 'MDD', volume: random(25, 35, 'p-mdd') },
        { destination: 'Sortants Catégorie', volume: random(15, 25, 'p-exit') },
    ].sort((a,b) => b.volume - a.volume);
    
    const totalGains = gains.reduce((sum, item) => sum + item.volume, 0);
    const totalPertes = pertes.reduce((sum, item) => sum + item.volume, 0);

    const chartData = [
        { name: 'Gains', Danone: gains.find(g => g.source === 'Danone')?.volume, Yoplait: gains.find(g => g.source === 'Yoplait')?.volume, MDD: gains.find(g => g.source === 'MDD')?.volume, 'Nouveaux Acheteurs': gains.find(g => g.source === 'Nouveaux Acheteurs')?.volume },
        { name: 'Pertes', Danone: -pertes.find(p => p.destination === 'Danone')?.volume, Yoplait: -pertes.find(p => p.destination === 'Yoplait')?.volume, MDD: -pertes.find(p => p.destination === 'MDD')?.volume, 'Sortants Catégorie': -pertes.find(p => p.destination === 'Sortants Catégorie')?.volume },
    ];
    
    return { gains, pertes, totalGains, totalPertes, chartData };
};


const DynamicsTab = ({ filters }: { filters: Filters }) => {
    const { gains, pertes, totalGains, totalPertes, chartData } = useMemo(() => generateData(filters), [filters]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-green-50 border-green-200 dark:bg-green-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200"><TrendingUp />Gains de Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{(totalGains).toFixed(1)}%</p>
                        <p className="text-sm text-green-700 dark:text-green-300">du volume de la marque</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200"><TrendingDown />Pertes de Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">{(totalPertes).toFixed(1)}%</p>
                        <p className="text-sm text-red-700 dark:text-red-300">du volume de la marque</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">Solde Net</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-3xl font-bold ${(totalGains - totalPertes) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(totalGains - totalPertes).toFixed(1)} pts
                        </p>
                        <p className="text-sm text-muted-foreground">Évolution de la part de marché</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Détail des Transferts de Ventes</CardTitle></CardHeader>
                    <div className="grid grid-cols-2 gap-px bg-border">
                        <Table className="bg-card">
                            <TableHeader><TableRow><TableHead className="text-green-600">Gains (Provenance)</TableHead><TableHead className="text-right text-green-600">Volume (%)</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {gains.map(g => (<TableRow key={g.source}><TableCell>{g.source}</TableCell><TableCell className="text-right font-bold">+{g.volume.toFixed(1)}%</TableCell></TableRow>))}
                            </TableBody>
                        </Table>
                        <Table className="bg-card">
                            <TableHeader><TableRow><TableHead className="text-red-500">Pertes (Destination)</TableHead><TableHead className="text-right text-red-500">Volume (%)</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {pertes.map(p => (<TableRow key={p.destination}><TableCell>{p.destination}</TableCell><TableCell className="text-right font-bold">-{p.volume.toFixed(1)}%</TableCell></TableRow>))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Visualisation des Transferts</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                             <BarChart data={chartData} layout="vertical" stackOffset="diverging">
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={60} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Danone" fill="#8884d8" stackId="stack" />
                                <Bar dataKey="Yoplait" fill="#82ca9d" stackId="stack" />
                                <Bar dataKey="MDD" fill="#ffc658" stackId="stack" />
                                <Bar dataKey="Nouveaux Acheteurs" fill="#00C49F" stackId="stack" />
                                <Bar dataKey="Sortants Catégorie" fill="#FF8042" stackId="stack" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="flex-row items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle>Synthèse & Recommandations IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Votre solde est positif, indiquant un gain de part de marché. Les gains proviennent principalement du recrutement de **nouveaux acheteurs** ({gains.find(g => g.source === 'Nouveaux Acheteurs')?.volume.toFixed(1)}%) et de la **MDD**. 
                        Cependant, les pertes les plus importantes se font également au profit de la **MDD** ({pertes.find(p => p.destination === 'MDD')?.volume.toFixed(1)}%), suggérant une forte sensibilité au prix sur une partie de votre base d'acheteurs.
                    </p>
                     <p className="text-sm text-muted-foreground mt-2">
                        <strong>Recommandation :</strong> Lancez une analyse de mixité des paniers pour comprendre ce que les acheteurs perdus au profit de la MDD achètent à la place. Envisagez une offre promotionnelle ciblée pour retenir ce segment volatil.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};


export default function ConsumerDataPage() {
    const [selectedRetailer, setSelectedRetailer] = useState(retailerOptions[0].value);
    const [selectedBrand, setSelectedBrand] = useState(brandOptions[0].value);

    const filters = { retailer: selectedRetailer, brand: selectedBrand };

    const kpiData = [
        { title: "Taux de Pénétration", value: "15.7%", change: "-0.2pt", icon: Users },
        { title: "Fréquence d'Achat", value: "4.7", change: "+0.0pt", icon: Repeat },
        { title: "Dépense par Acte", value: "3.50€", change: "-0.0pt", icon: HandCoins },
    ];
  
    return (
        <div className="space-y-6">
             <Tabs defaultValue="indicators">
                <TabsList>
                    <TabsTrigger value="indicators">Indicateurs & Ventes</TabsTrigger>
                    <TabsTrigger value="profile">Profil Acheteurs</TabsTrigger>
                    <TabsTrigger value="loyalty">Fidélité & Mixité</TabsTrigger>
                    <TabsTrigger value="dynamics">Dynamiques</TabsTrigger>
                    <TabsTrigger value="habits">Usages & Habitudes</TabsTrigger>
                </TabsList>
                 <TabsContent value="indicators" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Filtres</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select onValueChange={setSelectedRetailer} value={selectedRetailer}>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Enseigne" /></SelectTrigger>
                                    <SelectContent>{retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select onValueChange={setSelectedBrand} value={selectedBrand}>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Marque" /></SelectTrigger>
                                    <SelectContent>{brandOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kpiData.map(kpi => (
                            <Card key={kpi.title}>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-3xl font-bold">{kpi.value}</span>
                                    <span className={`ml-2 text-sm ${kpi.change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>({kpi.change})</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader><CardTitle>Arbre de Décomposition des Ventes</CardTitle></CardHeader>
                            <CardContent className="flex justify-center items-center">
                                {/* Simplified sales tree */}
                                <div className="text-center">
                                    <div className="p-4 border rounded-lg inline-block">
                                        <p className="text-sm">Ventes en Valeur</p>
                                        <p className="text-xl font-bold">4.70M €</p>
                                        <p className="text-sm text-green-500">+8.6%</p>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <div className="w-px bg-gray-300 h-8"></div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="p-4 border rounded-lg inline-block mx-4">
                                            <p className="text-sm">Nombre d'Acheteurs</p>
                                            <p className="text-xl font-bold">2.80M</p>
                                            <p className="text-sm text-green-500">+1.8%</p>
                                        </div>
                                        <div className="p-4 border rounded-lg inline-block mx-4">
                                            <p className="text-sm">Dépense / Acheteur</p>
                                            <p className="text-xl font-bold">1.68 €</p>
                                            <p className="text-sm text-green-500">+3.5%</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Analyse des Indicateurs</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Pour Total Marque / Total Enseignes, la croissance est principalement tirée par la dépense par acheteur (+3.5%), tandis que le nombre d'acheteurs stagne.</p></CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="profile" className="mt-6">
                     <p className="text-muted-foreground text-center py-12">En construction</p>
                </TabsContent>
                <TabsContent value="loyalty" className="mt-6">
                     <p className="text-muted-foreground text-center py-12">En construction</p>
                </TabsContent>
                <TabsContent value="dynamics" className="mt-6">
                    <DynamicsTab filters={filters} />
                </TabsContent>
                <TabsContent value="habits" className="mt-6">
                    <p className="text-muted-foreground text-center py-12">En construction</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
