
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, Users, Repeat, HandCoins, Cake, Heart, Rocket, UserCheck, ShoppingBasket, Soup, Sun, Milk, Briefcase } from 'lucide-react';
import { retailerOptions, brandOptions } from '@/services/filters-data';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Filters = {
    retailer: string;
    brand: string;
};

// --- Data Generation ---

const generateDataForFilters = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number, salt: string) => {
        let t = seed + hashCode(salt);
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max - min) + min;
    };

    // --- Indicateurs & Ventes Data ---
    const salesTree = {
        ca: { value: random(4500000, 5000000, 'ca'), trend: random(8, 10, 'ca_t') },
        acheteurs: { value: random(2700000, 2900000, 'ach'), trend: random(1, 2, 'ach_t') },
        depense: { value: 0, trend: random(3, 4, 'dep_t') },
        frequence: { value: random(4.5, 5, 'freq'), trend: random(0.1, 0.5, 'freq_t') },
        panier: { value: 0, trend: random(1, 1.5, 'panier_t') }
    };
    salesTree.depense.value = salesTree.ca.value / salesTree.acheteurs.value;
    salesTree.panier.value = salesTree.depense.value / salesTree.frequence.value;

    const kpis = [
        { title: "Taux de Pénétration", value: `${random(15, 16, 'pen').toFixed(1)}%`, change: `-${random(0.1, 0.3, 'pen_t').toFixed(1)}pt`, icon: Users },
        { title: "Fréquence d'Achat", value: salesTree.frequence.value.toFixed(1), change: `+${salesTree.frequence.trend.toFixed(1)}pt`, icon: Repeat },
        { title: "Dépense par Acte", value: `${salesTree.panier.value.toFixed(2)}€`, change: `+${salesTree.panier.trend.toFixed(1)}pt`, icon: HandCoins },
    ];

    // --- Dynamiques Data ---
    const gains = [{ source: 'Danone', volume: random(15, 25, 'g-danone') }, { source: 'Yoplait', volume: random(10, 20, 'g-yoplait') }, { source: 'MDD', volume: random(20, 30, 'g-mdd') }, { source: 'Nouveaux Acheteurs', volume: random(30, 40, 'g-new') }].sort((a, b) => b.volume - a.volume);
    const pertes = [{ destination: 'Danone', volume: random(8, 15, 'p-danone') }, { destination: 'Yoplait', volume: random(12, 18, 'p-yoplait') }, { destination: 'MDD', volume: random(25, 35, 'p-mdd') }, { destination: 'Sortants Catégorie', volume: random(15, 25, 'p-exit') }].sort((a, b) => b.volume - a.volume);
    const totalGains = gains.reduce((sum, item) => sum + item.volume, 0);
    const totalPertes = pertes.reduce((sum, item) => sum + item.volume, 0);
    const dynamicsChartData = [{ name: 'Gains', Danone: gains.find(g => g.source === 'Danone')?.volume, Yoplait: gains.find(g => g.source === 'Yoplait')?.volume, MDD: gains.find(g => g.source === 'MDD')?.volume, 'Nouveaux Acheteurs': gains.find(g => g.source === 'Nouveaux Acheteurs')?.volume }, { name: 'Pertes', Danone: -pertes.find(p => p.destination === 'Danone')?.volume, Yoplait: -pertes.find(p => p.destination === 'Yoplait')?.volume, MDD: -pertes.find(p => p.destination === 'MDD')?.volume, 'Sortants Catégorie': -pertes.find(p => p.destination === 'Sortants Catégorie')?.volume }];

    // --- Profil Data ---
    const ageData = [{ name: '18-24', value: random(10, 15, 'a1') }, { name: '25-34', value: random(25, 35, 'a2') }, { name: '35-49', value: random(30, 40, 'a3') }, { name: '50-64', value: random(15, 20, 'a4') }, { name: '65+', value: random(5, 10, 'a5') }];
    const cspData = [{ name: 'CSP+', value: random(40, 50, 'c1') }, { name: 'CSP-', value: random(25, 35, 'c2') }, { name: 'Inactifs', value: random(20, 30, 'c3') }];
    const foyerData = [{ name: 'Familles', value: random(50, 60, 'f1') }, { name: 'Couples', value: random(20, 25, 'f2') }, { name: 'Célibataires', value: random(15, 20, 'f3') }];

    // --- Fidélité & Mixité Data ---
    const loyaltyData = [{ name: 'Acheteurs Exclusifs', value: random(15, 20, 'l1') }, { name: 'Acheteurs Réguliers', value: random(30, 40, 'l2') }, { name: 'Acheteurs Occasionnels', value: random(45, 55, 'l3') }];
    
    const proximityReferences = [
        'LPG-Skyr Nat 150g', 'LPG-Bio Fraise 4x125g', 'LPG-Grec Miel 2x150g', 'LPG-Végé Amande 2x100g', 'LPG-Gourde Pomme 4x90g',
        'Danone-Danette Choc 4x100g', 'Danone-Activia Nat 4x125g', 'Danone-Velouté Fruix 4x125g', 'Danone-Light&Free Pêche 4x115g', 'Danone-Actimel Nat x10',
        'Yoplait-Panier de Yoplait 4x125g', 'Yoplait-Perle de Lait Nat 4x125g', 'Yoplait-Yop Fraise 825g', 'Yoplait-Petits Filous x12', 'Yoplait-Skyr Nature 140g',
        'MDD-Yaourt Nat 16x125g', 'MDD-Fromage Blanc 1kg', 'MDD-Yaourt Fruits 8x125g', 'MDD-Crème Dessert Choc 4x125g', 'MDD-Bio Nature 4x125g',
    ];

    const proximityMatrix = proximityReferences.map((ref1, i) => {
        const row: { [key: string]: number | string } = { product: ref1 };
        proximityReferences.forEach((ref2, j) => {
            if (i === j) {
                row[ref2] = 100;
            } else {
                const salt = `${ref1}-${ref2}`.split('').sort().join(''); // Ensure salt is symmetrical
                row[ref2] = random(5, 95, salt);
            }
        });
        return row;
    });


    // --- Usages & Habitudes Data ---
    const momentData = [{ name: 'Petit-déjeuner', value: random(30, 40, 'u1') }, { name: 'Déjeuner (sur le pouce)', value: random(15, 20, 'u2') }, { name: 'Goûter', value: random(10, 15, 'u3') }, { name: 'Fin de repas (dessert)', value: random(40, 50, 'u4') }];
    const benefitData = [{ name: 'Plaisir / Gourmandise', value: random(40, 50, 'b1'), icon: Cake }, { name: 'Santé / Nutrition', value: random(25, 35, 'b2'), icon: Heart }, { name: 'Praticité / Facilité', value: random(20, 30, 'b3'), icon: Rocket }];

    return {
        salesTree, kpis,
        gains, pertes, totalGains, totalPertes, dynamicsChartData,
        ageData, cspData, foyerData,
        loyaltyData, proximityMatrix, proximityReferences,
        momentData, benefitData
    };
};


// --- Components ---

const DynamicsTab = ({ data }: { data: any }) => {
    const { gains, pertes, totalGains, totalPertes, dynamicsChartData } = data;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-200 dark:bg-green-950">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200"><TrendingUp />Gains de Volume</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold text-green-600">{(totalGains).toFixed(1)}%</p><p className="text-sm text-green-700 dark:text-green-300">du volume de la marque</p></CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200 dark:bg-red-950">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200"><TrendingDown />Pertes de Volume</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold text-red-600">{(totalPertes).toFixed(1)}%</p><p className="text-sm text-red-700 dark:text-red-300">du volume de la marque</p></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-muted-foreground">Solde Net</CardTitle></CardHeader>
                    <CardContent><p className={`text-3xl font-bold ${(totalGains - totalPertes) > 0 ? 'text-green-600' : 'text-red-600'}`}>{(totalGains - totalPertes).toFixed(1)} pts</p><p className="text-sm text-muted-foreground">Évolution de la part de marché</p></CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Détail des Transferts de Ventes</CardTitle></CardHeader>
                    <div className="grid grid-cols-2 gap-px bg-border"><Table className="bg-card"><TableHeader><TableRow><TableHead className="text-green-600">Gains (Provenance)</TableHead><TableHead className="text-right text-green-600">Volume (%)</TableHead></TableRow></TableHeader><TableBody>{gains.map((g: any) => (<TableRow key={g.source}><TableCell>{g.source}</TableCell><TableCell className="text-right font-bold">+{g.volume.toFixed(1)}%</TableCell></TableRow>))}</TableBody></Table><Table className="bg-card"><TableHeader><TableRow><TableHead className="text-red-500">Pertes (Destination)</TableHead><TableHead className="text-right text-red-500">Volume (%)</TableHead></TableRow></TableHeader><TableBody>{pertes.map((p: any) => (<TableRow key={p.destination}><TableCell>{p.destination}</TableCell><TableCell className="text-right font-bold">-{p.volume.toFixed(1)}%</TableCell></TableRow>))}</TableBody></Table></div>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Visualisation des Transferts</CardTitle></CardHeader>
                    <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={dynamicsChartData} layout="vertical" stackOffset="diverging"><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={60} /><Tooltip /><Legend /><Bar dataKey="Danone" fill="#8884d8" stackId="stack" /><Bar dataKey="Yoplait" fill="#82ca9d" stackId="stack" /><Bar dataKey="MDD" fill="#ffc658" stackId="stack" /><Bar dataKey="Nouveaux Acheteurs" fill="#00C49F" stackId="stack" /><Bar dataKey="Sortants Catégorie" fill="#FF8042" stackId="stack" /></BarChart></ResponsiveContainer></CardContent>
                </Card>
            </div>
            <Card><CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Synthèse & Recommandations IA</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Votre solde est positif, indiquant un gain de part de marché. Les gains proviennent principalement du recrutement de **nouveaux acheteurs** ({gains.find((g: any) => g.source === 'Nouveaux Acheteurs')?.volume.toFixed(1)}%) et de la **MDD**. Cependant, les pertes les plus importantes se font également au profit de la **MDD** ({pertes.find((p: any) => p.destination === 'MDD')?.volume.toFixed(1)}%), suggérant une forte sensibilité au prix sur une partie de votre base d'acheteurs.</p><p className="text-sm text-muted-foreground mt-2"><strong>Recommandation :</strong> Lancez une analyse de mixité des paniers pour comprendre ce que les acheteurs perdus au profit de la MDD achètent à la place. Envisagez une offre promotionnelle ciblée pour retenir ce segment volatil.</p></CardContent></Card>
        </div>
    );
};

const ProfileTab = ({ data }: { data: any }) => {
    const { ageData, cspData, foyerData } = data;
    const COLORS = ['#1e293b', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Répartition par Âge</CardTitle></CardHeader>
                    <CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={ageData}><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} /><Bar dataKey="value" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent>
                </Card>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                       <CardHeader><CardTitle>Répartition par CSP</CardTitle></CardHeader>
                       <CardContent><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={cspData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>{cspData.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} /><Legend /></PieChart></ResponsiveContainer></CardContent>
                    </Card>
                     <Card>
                       <CardHeader><CardTitle>Composition du Foyer</CardTitle></CardHeader>
                       <CardContent><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={foyerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>{foyerData.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} /><Legend /></PieChart></ResponsiveContainer></CardContent>
                    </Card>
                </div>
            </Card>
            <Card><CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Synthèse & Recommandations IA</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Votre cœur de cible est constitué de **familles ({(foyerData.find((f: any) => f.name === 'Familles').value).toFixed(0)}%)**, principalement âgées de **25 à 49 ans**, et appartenant aux **CSP+ ({(cspData.find((c: any) => c.name === 'CSP+').value).toFixed(0)}%)**.</p><p className="text-sm text-muted-foreground mt-2"><strong>Recommandation :</strong> Renforcez la communication sur les bénéfices familiaux et la qualité supérieure pour justifier le positionnement prix auprès de votre cible principale. Explorez des formats familiaux pour augmenter la dépense par acte.</p></CardContent></Card>
        </div>
    );
};

const LoyaltyTab = ({ data }: { data: any }) => {
    const { loyaltyData, proximityMatrix, proximityReferences } = data;

    const getBgColor = (value: number) => {
        if (value === 100) return 'bg-primary/80 text-primary-foreground';
        if (value > 75) return 'bg-green-700 text-white';
        if (value > 50) return 'bg-green-500 text-white';
        if (value > 25) return 'bg-yellow-400 text-yellow-900';
        return 'bg-amber-200 text-amber-800';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck />Matrice de Fidélité</CardTitle></CardHeader>
                    <CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={loyaltyData} layout="vertical"><XAxis type="number" unit="%" /><YAxis type="category" dataKey="name" width={150} /><Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} /><Bar dataKey="value" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent>
                </Card>
                <Card className="lg:col-span-2"><CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Synthèse & Recommandations IA</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">La part d'acheteurs **exclusifs est de {(loyaltyData.find((l: any) => l.name.includes('Exclusifs')).value).toFixed(0)}%**, ce qui est un bon signe de fidélité. Cependant, une grande partie de votre base est **occasionnelle**.</p><p className="text-sm text-muted-foreground mt-2">La matrice de proximité au niveau référence (ci-dessous) révèle des informations clés. Par exemple, une forte proximité entre votre **LPG-Skyr Nature** et le **Yoplait-Skyr Nature** (indice élevé) indique une concurrence directe et une forte substituabilité. À l'inverse, une faible proximité entre votre **LPG-Gourde Pomme** et **Danette** suggère des usages et des consommateurs très différents.</p><p className="text-sm text-muted-foreground mt-2"><strong>Recommandation :</strong> Pour convertir les acheteurs occasionnels, lancez une campagne promotionnelle ciblée sur les références où la concurrence avec la MDD est la plus forte (ex: Yaourt Nature vs MDD Yaourt Nature). Utilisez les proximités fortes pour des actions de défense (si un concurrent est en promo, protégez votre référence concurrente) et les proximités faibles pour identifier des opportunités de cross-selling au sein de votre propre gamme.</p></CardContent></Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShoppingBasket />Matrice de Proximité au niveau Référence</CardTitle>
                    <CardDescription>Indice de co-achat entre 20 références clés. Un score élevé signifie une forte probabilité que les deux produits se retrouvent dans le même panier.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="overflow-auto" style={{ maxWidth: 'calc(100vw - 150px)'}}>
                            <Table className="min-w-max border-collapse border border-border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 z-10 bg-card p-2 text-xs w-[150px] border-r border-border">Référence</TableHead>
                                        {proximityReferences.map((ref: string) => <TableHead key={ref} className="p-1 text-center text-[10px] h-32" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{ref}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {proximityMatrix.map((row: any) => (
                                        <TableRow key={row.product}>
                                            <TableCell className="sticky left-0 z-10 bg-card p-2 text-xs font-bold w-[150px] border-r border-border">{row.product}</TableCell>
                                            {proximityReferences.map((ref: string) => (
                                                <TableCell key={`${row.product}-${ref}`} className="p-0 text-center border border-border">
                                                    <div className={cn("m-0 flex h-12 w-12 items-center justify-center text-xs font-bold", getBgColor(row[ref]))}>
                                                        {Math.round(row[ref])}
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

const HabitsTab = ({ data }: { data: any }) => {
    const { momentData, benefitData } = data;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2"><Sun />Moment de Consommation</CardTitle></CardHeader>
                 <CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={momentData}><XAxis dataKey="name" /><YAxis unit="%" /><Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} /><Bar dataKey="value" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase />Bénéfices Recherchés</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {benefitData.map((b: any) => (
                        <div key={b.name}>
                            <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium flex items-center gap-2"><b.icon />{b.name}</span><span className="text-sm font-bold">{b.value.toFixed(0)}%</span></div>
                            <div className="w-full bg-muted rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${b.value}%` }}></div></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card><CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Synthèse & Recommandations IA</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Vos produits sont principalement consommés en **fin de repas** (dessert) et au **petit-déjeuner**. Le bénéfice principal recherché est la **gourmandise**, suivi de près par la **santé**.</p><p className="text-sm text-muted-foreground mt-2">Il existe une tension intéressante entre le plaisir et la nutrition.</p><p className="text-sm text-muted-foreground mt-2"><strong>Recommandation :</strong> Mettez en avant le double bénéfice "sain et gourmand" dans votre communication. Développez des recettes ou des suggestions de présentation pour l'usage au petit-déjeuner afin de renforcer ce moment de consommation.</p></CardContent></Card>
        </div>
    );
};


const SalesTree = ({ data }: { data: any }) => {
    const Node = ({ title, value, trend, isCurrency = false, isLast = false }: { title: string, value: number, trend: string, isCurrency?: boolean, isLast?: boolean }) => (
        <Card className="p-2 text-center w-44 shrink-0">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-lg font-bold">{isCurrency ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: isLast ? 2 : 0 }) : value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}</p>
            <p className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>
        </Card>
    );
    
    return (
        <div className="flex flex-col items-center gap-4 py-4 overflow-x-auto">
            {/* Level 1 */}
            <Node title="Ventes en Valeur" value={data.ca.value} trend={`+${data.ca.trend.toFixed(1)}%`} isCurrency />
            
            {/* Connector to Level 2 */}
            <div className="h-8 w-px bg-border"></div>
            <div className="relative flex justify-center">
                <div className="absolute top-0 h-px w-[500px] bg-border"></div>
                <div className="absolute top-0 h-8 w-px bg-border"></div>
            </div>

            {/* Level 2 */}
            <div className="flex items-start gap-32">
                 <Node title="Nombre d'Acheteurs" value={data.acheteurs.value} trend={`+${data.acheteurs.trend.toFixed(1)}%`} />
                
                <div className="flex flex-col items-center gap-4">
                    <Node title="Dépense / Acheteur" value={data.depense.value} trend={`+${data.depense.trend.toFixed(1)}%`} isCurrency />
                    {/* Connector to Level 3 */}
                    <div className="h-8 w-px bg-border"></div>
                    <div className="relative flex justify-center">
                        <div className="absolute top-0 h-px w-[300px] bg-border"></div>
                        <div className="absolute top-0 h-8 w-px bg-border"></div>
                    </div>
                    {/* Level 3 */}
                    <div className="flex gap-8">
                         <Node title="Fréquence d'Achat" value={data.frequence.value} trend={`+${data.frequence.trend.toFixed(1)}`} />
                         <Node title="Dépense par Acte" value={data.panier.value} trend={`+${data.panier.trend.toFixed(1)}%`} isCurrency isLast />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export default function ConsumerDataPage() {
    const [selectedRetailer, setSelectedRetailer] = useState(retailerOptions[0].value);
    const [selectedBrand, setSelectedBrand] = useState(brandOptions[0].value);

    const filters = { retailer: selectedRetailer, brand: selectedBrand };
    
    const data = useMemo(() => generateDataForFilters(filters), [filters]);
  
    return (
        <div className="space-y-6">
             <Tabs defaultValue="indicators" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="indicators">Indicateurs & Ventes</TabsTrigger>
                    <TabsTrigger value="dynamics">Dynamiques</TabsTrigger>
                    <TabsTrigger value="profile">Profil Acheteurs</TabsTrigger>
                    <TabsTrigger value="loyalty">Fidélité & Mixité</TabsTrigger>
                    <TabsTrigger value="habits">Usages & Habitudes</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <CardTitle>Filtres</CardTitle>
                            <div className="flex items-center gap-2 pt-4 md:pt-0">
                                <Select onValueChange={setSelectedRetailer} value={selectedRetailer}>
                                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Enseigne" /></SelectTrigger>
                                    <SelectContent>{retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select onValueChange={setSelectedBrand} value={selectedBrand}>
                                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Marque" /></SelectTrigger>
                                    <SelectContent>{brandOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                 <TabsContent value="indicators" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.kpis.map(kpi => (
                            <Card key={kpi.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle><kpi.icon className="h-4 w-4 text-muted-foreground" /></CardHeader>
                                <CardContent><span className="text-3xl font-bold">{kpi.value}</span><span className={`ml-2 text-sm ${kpi.change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>({kpi.change})</span></CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader><CardTitle>Arbre de Décomposition des Ventes</CardTitle></CardHeader>
                            <CardContent className="flex justify-center items-center overflow-x-auto">
                                <SalesTree data={data.salesTree} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /><CardTitle>Analyse des Indicateurs</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">La croissance est principalement tirée par la dépense par acheteur (+{data.salesTree.depense.trend.toFixed(1)}%), elle-même portée par une légère hausse de la fréquence d'achat. Le nombre d'acheteurs stagne, indiquant un levier de croissance potentiel.</p></CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="profile" className="mt-6">
                    <ProfileTab data={data} />
                </TabsContent>
                <TabsContent value="loyalty" className="mt-6">
                    <LoyaltyTab data={data} />
                </TabsContent>
                <TabsContent value="dynamics" className="mt-6">
                    <DynamicsTab data={data} />
                </TabsContent>
                <TabsContent value="habits" className="mt-6">
                    <HabitsTab data={data} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

