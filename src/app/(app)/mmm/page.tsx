
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { TrendingUp, Percent, Download, BrainCircuit, Sparkles, SlidersHorizontal, BarChart2, MoveRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { mmmData, countryData } from '@/services/data-service';
import Image from 'next/image';
import Link from 'next/link';

const COLORS = ['#1e293b', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];


const MmmCountryView = ({ country, onBack }: { country: 'France' | 'USA' | 'Japan', onBack: () => void }) => {
    const countryPeriods = Object.keys(mmmData[country]);
    const [selectedPeriod, setSelectedPeriod] = useState(countryPeriods[0]);

    const data = useMemo(() => mmmData[country][selectedPeriod as keyof typeof mmmData[typeof country]], [country, selectedPeriod]);

    const { contributions, investments, baseline } = data;
    
    const totalContribution = useMemo(() => {
        return Object.values(contributions).reduce((a, b) => a + b, 0);
    }, [contributions]);

    const contributionChartData = useMemo(() => {
        const contributionEntries = Object.entries(contributions);
        const totalSales = baseline + totalContribution;
        let cumulative = 0;

        const chartData = [
            {
                name: 'Baseline',
                value: baseline,
                phantom: 0,
                color: '#e2e8f0', // Muted color for baseline
            },
            ...contributionEntries.map(([name, value], index) => {
                const item = {
                    name,
                    value,
                    phantom: cumulative + baseline,
                    color: COLORS[index % COLORS.length],
                };
                cumulative += value;
                return item;
            }),
            {
                name: 'Ventes Totales',
                value: totalSales,
                phantom: 0,
                color: '#10b981', // Green for total sales
            },
        ];
        return chartData;
    }, [contributions, baseline, totalContribution]);


    const roasTableData = useMemo(() => {
        return Object.entries(investments).map(([lever, investment]) => {
            const contribution = contributions[lever as keyof typeof contributions] || 0;
            const roi = investment > 0 ? (contribution / investment) : 0;
            return { lever, investment, contribution, roi };
        }).sort((a,b) => b.roi - a.roi);
    }, [investments, contributions]);
    
    const globalRoas = useMemo(() => {
        const totalInvestment = Object.values(investments).reduce((a, b) => a + b, 0);
        return totalInvestment > 0 ? totalContribution / totalInvestment : 0;
    }, [investments, totalContribution]);

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-4">
                           <span className="text-4xl">{countryData[country].flag}</span>
                           <span>Marketing Mix Modeling: {country}</span>
                        </CardTitle>
                        <CardDescription>Analysez la contribution et le ROI de chaque levier marketing.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Télécharger le rapport</Button>
                        <Select onValueChange={setSelectedPeriod} value={selectedPeriod}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Période" />
                            </SelectTrigger>
                            <SelectContent>
                                {countryPeriods.map(p => <SelectItem key={p} value={p}>{p.replace('-', ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={onBack} variant="outline">Retour</Button>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="analysis">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analysis"><BarChart2 className="mr-2" />Analyse de Contribution</TabsTrigger>
                    <TabsTrigger value="simulation"><SlidersHorizontal className="mr-2" />Simulation Budgétaire</TabsTrigger>
                </TabsList>
                <TabsContent value="analysis" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Décomposition des Ventes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                     <BarChart
                                        data={contributionChartData}
                                        layout="vertical"
                                      >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M €`} />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip formatter={(value, name, props) => [`${props.payload.value.toLocaleString('fr-FR')} €`, props.payload.name]} cursor={{fill: 'transparent'}}/>
                                        <Bar dataKey="phantom" stackId="a" fill="transparent" />
                                        <Bar dataKey="value" stackId="a">
                                            {contributionChartData.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                      </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Analyse du ROAS par Levier</CardTitle>
                                <CardDescription>ROAS Global: <strong className="text-primary">{globalRoas.toFixed(2)}x</strong></CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Levier</TableHead><TableHead className="text-right">Investissement</TableHead><TableHead className="text-right">Contribution</TableHead><TableHead className="text-right">ROAS</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {roasTableData.map(row => (
                                            <TableRow key={row.lever}>
                                                <TableCell className="font-medium">{row.lever}</TableCell>
                                                <TableCell className="text-right">€{row.investment.toLocaleString('fr-FR')}</TableCell>
                                                <TableCell className="text-right">€{row.contribution.toLocaleString('fr-FR')}</TableCell>
                                                <TableCell className={`text-right font-bold ${row.roi > globalRoas ? 'text-green-600' : 'text-amber-600'}`}>{row.roi.toFixed(2)}x</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader className="flex-row items-center gap-2 space-y-0">
                            <Image src="https://i.postimg.cc/sX4YyC2j/Convert-IQ-logo-2.png" alt="ConvertIQ Logo" width={24} height={24} className="object-contain" />
                            <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold mb-1">À retenir</h4>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Le levier <strong>{roasTableData[0]?.lever}</strong> est le plus performant avec un ROAS de <strong>{roasTableData[0]?.roi.toFixed(2)}x</strong>.</li>
                                    <li>La baseline (ventes non-dépendantes du marketing) représente <strong>{(baseline / (baseline + totalContribution) * 100).toFixed(0)}%</strong> des ventes totales.</li>
                                    <li>Le levier <strong>{roasTableData[roasTableData.length-1]?.lever}</strong> a le ROAS le plus faible ({roasTableData[roasTableData.length-1]?.roi.toFixed(2)}x).</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Nos recommandations</h4>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li><strong>Optimiser :</strong> Envisagez de réallouer 15% du budget de <strong>{roasTableData[roasTableData.length-1]?.lever}</strong> vers <strong>{roasTableData[0]?.lever}</strong> pour maximiser le retour sur investissement.</li>
                                    <li><strong>Simuler :</strong> Utilisez le simulateur pour tester ce scénario et visualiser l'impact sur le CA total avant de prendre une décision.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                                <p className="text-muted-foreground">Utilisez l'onglet "Simulation Budgétaire" pour appliquer ces recommandations et voir l'impact en temps réel.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="simulation" className="mt-6">
                    <SimulationTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

const SimulationTab = () => {
    const simConfig = mmmData.simulation;
    const initialBudgets = simConfig.datasets.reduce((acc, d) => ({...acc, [d.id]: d.initialBudget}), {} as Record<string, number>);

    const [budgets, setBudgets] = useState<Record<string, number>>(initialBudgets);
    const [visibleLevers, setVisibleLevers] = useState<string[]>(simConfig.datasets.map(d => d.id));
    const totalContribution = useMemo(() => Object.values(mmmData.France["s1-2025"].contributions).reduce((a, b) => a + b, 0), []);

    const handleBudgetChange = (id: string, value: number) => {
        setBudgets(prev => ({...prev, [id]: value}));
    };
    
    const handleLeverToggle = (id: string) => {
        setVisibleLevers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    }
    
    const { totalCa, totalRoas } = useMemo(() => {
        let totalInvest = 0, totalCaContribution = 0;
        const interpolate = (x: number, x_points: number[], y_points: number[]) => { 
            if (x <= x_points[0]) return y_points[0]; 
            if (x >= x_points[x_points.length - 1]) return y_points[y_points.length - 1]; 
            let i = 1; while (x_points[i] < x) i++; 
            const [x1, y1, x2, y2] = [x_points[i - 1], y_points[i - 1], x_points[i], y_points[i]]; 
            return y1 + (y2 - y1) * (x - x1) / (x2 - x1); 
        };
        simConfig.datasets.forEach(lever => {
            const investment = budgets[lever.id];
            totalInvest += investment;
            totalCaContribution += interpolate(investment, simConfig.labels, lever.values);
        });
        
        // Note: totalCaContribution from simulation is a relative value (k€). 
        // We can scale it to the actual contribution values from the MMM model for a more realistic total CA.
        const totalSimulatedContribution = simConfig.datasets.reduce((sum, d) => sum + interpolate(d.initialBudget, simConfig.labels, d.values), 0);
        const scalingFactor = totalContribution / totalSimulatedContribution;

        const finalTotalCa = mmmData.France["s1-2025"].baseline + (totalCaContribution * scalingFactor);

        return {
            totalCa: finalTotalCa,
            totalRoas: totalInvest > 0 ? (totalCaContribution * scalingFactor) / (totalInvest * 1000) : 0,
        }
    }, [budgets, simConfig, totalContribution]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Courbes de Saturation par Levier</CardTitle>
                    <CardDescription>Visualisez le rendement décroissant de chaque investissement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                        {simConfig.datasets.map(lever => (
                             <div key={lever.id} className="flex items-center">
                                <input type="checkbox" id={`cb-${lever.id}`} checked={visibleLevers.includes(lever.id)} onChange={() => handleLeverToggle(lever.id)} style={{accentColor: lever.color}} />
                                <label htmlFor={`cb-${lever.id}`} className="ml-2 text-sm" style={{color: lever.color}}>{lever.name}</label>
                             </div>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" type="number" domain={[0, 'dataMax']} label={{ value: 'Investissement (k€)', position: 'insideBottom', offset: -5 }} tickFormatter={(val) => (val/1000).toFixed(0)+'k'} />
                            <YAxis label={{ value: 'Contribution CA (k€)', angle: -90, position: 'insideLeft' }} tickFormatter={(val) => (val/1000).toFixed(0)+'k'} />
                            <Tooltip formatter={(value, name) => [`${(value as number).toLocaleString('fr-FR')}k€`, name]} labelFormatter={(label) => `Invest: ${label.toLocaleString('fr-FR')}k€`} />
                            <Legend />
                             {simConfig.datasets.filter(d => visibleLevers.includes(d.id)).map(lever => (
                                <Line key={lever.id} type="monotone" dataKey="y" data={lever.values.map((v, i) => ({x: simConfig.labels[i] * 1000, y: v * 1000}))} name={lever.name} stroke={lever.color} dot={false} strokeWidth={2} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Console de Simulation</CardTitle>
                        <CardDescription>Ajustez les budgets pour voir l'impact.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {simConfig.datasets.map(lever => (
                            <div key={lever.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <label htmlFor={`${lever.id}-slider`}>{lever.name}</label>
                                    <span className="font-bold" style={{color: lever.color}}>€{(budgets[lever.id] * 1000).toLocaleString('fr-FR')}</span>
                                </div>
                                <Slider id={`${lever.id}-slider`} min={0} max={lever.maxBudget} step={1} value={[budgets[lever.id]]} onValueChange={(val) => handleBudgetChange(lever.id, val[0])} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Résultats de la Simulation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-lg">
                        <div className="flex justify-between"><span>CA Total Prévu:</span> <span className="font-bold text-primary">€{Math.round(totalCa).toLocaleString('fr-FR')}</span></div>
                        <div className="flex justify-between"><span>ROAS Total Prévu:</span> <span className="font-bold text-primary">{totalRoas.toFixed(2)}x</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function MMMPage() {
  const [selectedCountry, setSelectedCountry] = useState<'France' | 'USA' | 'Japan' | null>(null);

  const activeCountries = Object.keys(mmmData).filter(k => k !== 'simulation');

  if (!selectedCountry) {
    return (
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Marketing Mix Modeling (MMM)</CardTitle>
                    <CardDescription>Sélectionnez un pays pour analyser la contribution de chaque levier marketing à vos ventes.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pays</TableHead>
                                <TableHead>Dernière Mise à Jour</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeCountries.map(country => (
                                <TableRow key={country}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <span className="text-2xl">{countryData[country as keyof typeof countryData].flag}</span>
                                        {country}
                                    </TableCell>
                                    <TableCell>{countryData[country as keyof typeof countryData].lastUpdate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => setSelectedCountry(country as any)}>Voir le modèle</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
  }

  return <MmmCountryView country={selectedCountry} onBack={() => setSelectedCountry(null)} />;
}
