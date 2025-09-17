'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DollarSign, Package, Home, Percent, Sparkles, MoveRight } from "lucide-react";
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

interface OfflinePerformanceTabProps {
    filters: Filters;
}

const exportableItems = {
    data: ["KPIs de performance (Ventes, Unités...)", "Tableau du Top 5 Produits", "Tableau de la Performance par Enseigne"],
    graphs: ["Arbre de décomposition du CA", "Évolution des Ventes vs N-1"],
};

const generateOfflineData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const random = (min: number, max: number) => {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max - min) + min;
    };
    
    const salesOverTime = Array.from({length: 12}, (_, i) => ({
      name: `S-${12-i}`,
      GMS: random(350000, 450000) + i * 20000,
      'En Ligne': random(80000, 120000) + i * 10000
    }));

    const topProducts = [
        {id: 1, name: "Yaourt Nature Bio 4x125g", sales: random(40000, 50000), evolution: random(2, 8)},
        {id: 2, name: "Yaourt Grec 2x150g", sales: random(35000, 45000), evolution: random(8, 15)},
        {id: 3, name: "Skyr Nature 450g", sales: random(30000, 40000), evolution: random(20, 30)},
        {id: 4, name: "Yaourt Fruits Rouges Bio 4x125g", sales: random(25000, 35000), evolution: random(0, 5)},
        {id: 5, name: "Yaourt Végétal Amande 2x100g", sales: random(20000, 30000), evolution: random(-5, 0)},
    ].sort((a,b) => b.sales - a.sales);

    const treeData = {
        ca: { title: "CA Sell-Out", value: `${(random(2.2, 2.6)).toFixed(1)}M €`, trend: `+${random(13,17).toFixed(1)}%` },
        transactions: { title: "Transactions", value: `${random(1.0, 1.2).toFixed(1)}M`, trend: `+${random(10,14).toFixed(1)}%` },
        panier: { title: "Panier Moyen", value: `€${random(2.1, 2.3).toFixed(2)}`, trend: `+${random(1,3).toFixed(1)}%` },
        upt: { title: "Unités / Panier", value: `${random(1.3, 1.5).toFixed(1)}`, trend: `+${random(0.5,1.5).toFixed(1)}%` },
        prix: { title: "Prix Moyen / U", value: `€${random(1.5, 1.6).toFixed(2)}`, trend: `+${random(0.5,1.2).toFixed(1)}%` },
    };

    const retailerData = [
        { retailer: 'Carrefour', sellout: `${random(650, 700).toFixed(0)}k €`, dn: 98 },
        { retailer: 'E.Leclerc', sellout: `${random(600, 650).toFixed(0)}k €`, dn: 99 },
        { retailer: 'Intermarché', sellout: `${random(450, 500).toFixed(0)}k €`, dn: 95 },
        { retailer: 'Système U', sellout: `${random(350, 400).toFixed(0)}k €`, dn: 96 },
    ];

    const kpis = {
        totalSales: `€${random(2.3, 2.5).toFixed(1)}M`,
        totalSalesChange: `+${random(14,16).toFixed(1)}% vs. S1 2023`,
        unitsSold: `${random(1.0, 1.2).toFixed(1)}M`,
        unitsSoldChange: `+${random(11,14).toFixed(1)}% vs. S1 2023`,
        penetration: `${random(17,19).toFixed(1)}%`,
        penetrationChange: `+${random(0.3, 0.7).toFixed(1)} pts vs. S1 2023`,
        marketShare: `${random(21,23).toFixed(1)}%`,
        marketShareChange: `+${random(1.0, 1.5).toFixed(1)} pts vs. S1 2023`,
    };

    return { salesOverTime, topProducts, treeData, retailerData, kpis };
};


const EvolutionBadge = ({ value }: { value: number }) => {
    if (value > 0) return <Badge className="bg-green-100 text-green-800">+{value.toFixed(1)}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{value.toFixed(1)}%</Badge>;
}

export default function OfflinePerformanceTab({ filters }: OfflinePerformanceTabProps) {
  const { salesOverTime, topProducts, treeData, retailerData, kpis } = useMemo(() => generateOfflineData(filters), [filters]);

  return (
    <div className="space-y-6">
       <div className="flex justify-end">
            <ExportDialog tabTitle="Offline" items={exportableItems} />
        </div>
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes Totales (GMS)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpis.totalSales}</div>
                <p className="text-xs text-muted-foreground">{kpis.totalSalesChange}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unités Vendues</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpis.unitsSold}</div>
                <p className="text-xs text-muted-foreground">{kpis.unitsSoldChange}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pénétration des foyers</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpis.penetration}</div>
                <p className="text-xs text-muted-foreground">{kpis.penetrationChange}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Part de Marché</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpis.marketShare}</div>
                <p className="text-xs text-muted-foreground">{kpis.marketShareChange}</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Arbre de Décomposition du CA</CardTitle>
                    <CardDescription>Comprenez les leviers de votre croissance.</CardDescription>
                </div>
              </div>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center text-center">
                 <div className="rounded-lg border p-4 w-48">
                    <p className="text-sm text-gray-500">{treeData.ca.title}</p>
                    <p className="text-lg font-bold">{treeData.ca.value}</p>
                    <p className={`text-sm ${treeData.ca.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{treeData.ca.trend}</p>
                 </div>
                 <div className="w-px bg-gray-300 h-8"></div>
                 <div className="flex w-full justify-around relative">
                    <div className="absolute top-0 h-px bg-gray-300 w-1/2 left-1/4"></div>
                    <div className="flex flex-col items-center w-1/2">
                         <div className="w-px bg-gray-300 h-8"></div>
                         <div className="rounded-lg border p-4 w-48">
                            <p className="text-sm text-gray-500">{treeData.transactions.title}</p>
                            <p className="text-lg font-bold">{treeData.transactions.value}</p>
                             <p className={`text-sm ${treeData.transactions.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{treeData.transactions.trend}</p>
                         </div>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <div className="w-px bg-gray-300 h-8"></div>
                        <div className="rounded-lg border p-4 w-48">
                             <p className="text-sm text-gray-500">{treeData.panier.title}</p>
                            <p className="text-lg font-bold">{treeData.panier.value}</p>
                             <p className={`text-sm ${treeData.panier.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{treeData.panier.trend}</p>
                        </div>
                        <div className="w-px bg-gray-300 h-8"></div>
                        <div className="flex w-full justify-around relative">
                             <div className="absolute top-0 h-px bg-gray-300 w-full"></div>
                             <div className="flex flex-col items-center w-1/2">
                                <div className="w-px bg-gray-300 h-8"></div>
                                <div className="rounded-lg border p-2 text-xs w-32">
                                    <p className="text-gray-500">{treeData.upt.title}</p>
                                    <p className="font-bold">{treeData.upt.value}</p>
                                    <p className={`text-xs ${treeData.upt.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{treeData.upt.trend}</p>
                                </div>
                             </div>
                             <div className="flex flex-col items-center w-1/2">
                                 <div className="w-px bg-gray-300 h-8"></div>
                                <div className="rounded-lg border p-2 text-xs w-32">
                                     <p className="text-gray-500">{treeData.prix.title}</p>
                                    <p className="font-bold">{treeData.prix.value}</p>
                                    <p className={`text-xs ${treeData.prix.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{treeData.prix.trend}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                 </div>
             </div>
          </CardContent>
      </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
            <CardTitle>Évolution des Ventes vs N-1</CardTitle>
        </CardHeader>
        <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString('fr-FR', {maximumFractionDigits: 0})}`} />
                    <Legend />
                    <Line type="monotone" dataKey="GMS" name="Ventes GMS" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="En Ligne" name="Ventes en Ligne" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Top 5 Produits</CardTitle>
            <CardDescription>Les produits les plus performants en GMS.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Ventes (CA)</TableHead>
              <TableHead className="text-center">Évolution vs. N-1</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
                <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">€{product.sales.toLocaleString('fr-FR', {maximumFractionDigits: 0})}</TableCell>
                    <TableCell className="text-center">
                        <EvolutionBadge value={product.evolution} />
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Performance par Enseigne</CardTitle></CardHeader>
            <Table>
                <TableHeader><TableRow><TableHead>Enseigne</TableHead><TableHead className="text-right">Sell-Out</TableHead><TableHead className="text-right">DN (%)</TableHead></TableRow></TableHeader>
                <TableBody>
                    {retailerData.map(r => (
                        <TableRow key={r.retailer}>
                            <TableCell className="font-medium">{r.retailer}</TableCell>
                            <TableCell className="text-right">{r.sellout}</TableCell>
                            <TableCell className="text-right">{r.dn}%</TableCell>
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
                        <li>La croissance du CA ({treeData.ca.trend}) est saine, principalement portée par la hausse du <strong>nombre de transactions</strong> ({treeData.transactions.trend}).</li>
                        <li>Votre part de marché gagne <strong>{kpis.marketShareChange.split(' ')[0]}</strong> points.</li>
                        <li>Le produit <strong>Skyr Nature</strong> connaît une croissance explosive (+{topProducts.find(p=>p.name.includes('Skyr'))?.evolution.toFixed(0)}%).</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Nos recommandations</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li><strong>Consolider :</strong> Maintenir une pression promotionnelle sur le Skyr Nature pour soutenir la croissance.</li>
                        <li><strong>Développer :</strong> Lancer un plan d'action spécifique pour Intermarché où la DN (95%) est en retrait par rapport aux autres enseignes.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/performances?tab=potential">Identifier le potentiel de développement par enseigne <MoveRight className="ml-1" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}
