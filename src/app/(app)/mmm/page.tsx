
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { TrendingUp, Percent, Download, BrainCircuit, Sparkles, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { mmmData } from '@/services/data-service';

const COLORS = ['#1e293b', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const countryData: Record<string, { flag: string, lastUpdate: string }> = {
    'France': { flag: '🇫🇷', lastUpdate: '01/07/2025' },
    'USA': { flag: '🇺🇸', lastUpdate: '15/07/2025' },
    'Japan': { flag: '🇯🇵', lastUpdate: '20/06/2025' }
};

const MmmCountryView = ({ country, onBack }: { country: 'France' | 'USA' | 'Japan', onBack: () => void }) => {
    const countryPeriods = Object.keys(mmmData[country]);
    const [selectedPeriod, setSelectedPeriod] = useState(countryPeriods[0]);

    const data = useMemo(() => mmmData[country][selectedPeriod as keyof typeof mmmData[typeof country]], [country, selectedPeriod]);

    const { contributions, investments, baseline } = data;

    const contributionChartData = useMemo(() => {
        const mediaContributions = Object.entries(contributions).map(([channel, value]) => ({ name: channel, value }));
        return [{ name: 'Baseline', value: baseline }, ...mediaContributions];
    }, [contributions, baseline]);

    const roasTableData = useMemo(() => {
        return Object.entries(investments).map(([lever, investment]) => {
            const contribution = contributions[lever as keyof typeof contributions] || 0;
            const roi = investment > 0 ? (contribution / investment) : 0;
            return { lever, investment, contribution, roi };
        }).sort((a,b) => b.roi - a.roi);
    }, [investments, contributions]);
    
    const globalRoas = useMemo(() => {
        const totalInvestment = Object.values(investments).reduce((a, b) => a + b, 0);
        const totalContribution = Object.values(contributions).reduce((a, b) => a + b, 0);
        return totalInvestment > 0 ? totalContribution / totalInvestment : 0;
    }, [investments, contributions]);

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
                                    <BarChart data={contributionChartData} layout="vertical" stackOffset="expand">
                                        <XAxis type="number" hide tickFormatter={(tick) => `${tick * 100}%`} />
                                        <YAxis type="category" dataKey="name" width={0} />
                                        <Tooltip formatter={(value, name, props) => [`${(props.payload.value).toLocaleString('fr-FR')}€ (${(value * 100).toFixed(1)}%)`, name]} />
                                        <Legend />
                                        {Object.keys(contributions).map((key, index) => (
                                            <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} name={key} />
                                        ))}
                                        <Bar dataKey="Baseline" stackId="a" fill="#e2e8f0" name="Baseline" />
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

    const handleBudgetChange = (id: string, value: number) => {
        setBudgets(prev => ({...prev, [id]: value}));
    };
    
    const handleLeverToggle = (id: string) => {
        setVisibleLevers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    }
    
    const { totalCa, totalRoas } = useMemo(() => {
        let totalInvest = 0, totalCa = 0;
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
            totalCa += interpolate(investment, simConfig.labels, lever.values);
        });
        return {
            totalCa: totalCa,
            totalRoas: totalInvest > 0 ? totalCa / totalInvest : 0,
        }
    }, [budgets, simConfig]);

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
                            <XAxis dataKey="x" type="number" domain={[0, 'dataMax']} label={{ value: 'Investissement (k€)', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'CA Additionnel (k€)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value, name) => [`${value}k€`, name]}/>
                            <Legend />
                             {simConfig.datasets.filter(d => visibleLevers.includes(d.id)).map(lever => (
                                <Line key={lever.id} type="monotone" dataKey="y" data={lever.values.map((v, i) => ({x: simConfig.labels[i], y: v}))} name={lever.name} stroke={lever.color} dot={false} strokeWidth={2} />
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
                        <div className="flex justify-between"><span>CA Total Prévu:</span> <span className="font-bold text-primary">€{Math.round(totalCa * 1000).toLocaleString('fr-FR')}</span></div>
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

