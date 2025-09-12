
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { DollarSign, Package, ShoppingCart, Percent, Users, Home, TrendingUp, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const salesOverTime = Array.from({length: 12}, (_, i) => ({
  name: `S-${12-i}`,
  GMS: 350000 + Math.random() * 100000 + i * 20000,
  'En Ligne': 80000 + Math.random() * 40000 + i * 10000
}));

const topProducts = [
    {id: 1, name: "Yaourt Nature Bio 4x125g", sales: 45200, evolution: 5.2},
    {id: 2, name: "Yaourt Grec 2x150g", sales: 38900, evolution: 12.1},
    {id: 3, name: "Skyr Nature 450g", sales: 35100, evolution: 25.8},
    {id: 4, name: "Yaourt Fruits Rouges Bio 4x125g", sales: 28500, evolution: 2.3},
    {id: 5, name: "Yaourt Végétal Amande 2x100g", sales: 22300, evolution: -1.5},
];

const treeData = {
    ca: { title: "CA Sell-Out", value: "2.4M €", trend: "+15.2%" },
    transactions: { title: "Transactions", value: "1.1M", trend: "+12.8%" },
    panier: { title: "Panier Moyen", value: "2.18 €", trend: "+2.1%" },
    upt: { title: "Unités / Panier", value: "1.4", trend: "+1.2%" },
    prix: { title: "Prix Moyen / U", value: "1.56 €", trend: "+0.9%" },
};

const retailerData = [
    { retailer: 'Carrefour', sellout: '672k €', dn: 98 },
    { retailer: 'E.Leclerc', sellout: '624k €', dn: 99 },
    { retailer: 'Intermarché', sellout: '480k €', dn: 95 },
    { retailer: 'Système U', sellout: '360k €', dn: 96 },
];

const EvolutionBadge = ({ value }: { value: number }) => {
    if (value > 0) return <Badge className="bg-green-100 text-green-800">+{value}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{value}%</Badge>;
}

export default function OfflinePerformanceTab() {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes Totales (GMS)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">€2.4M</div>
                <p className="text-xs text-muted-foreground">+15.2% vs. S1 2023</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unités Vendues</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1.1M</div>
                <p className="text-xs text-muted-foreground">+12.8% vs. S1 2023</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pénétration des foyers</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">18.3%</div>
                <p className="text-xs text-muted-foreground">+0.5 pts vs. S1 2023</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Part de Marché</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">22.1%</div>
                <p className="text-xs text-muted-foreground">+1.2 pts vs. S1 2023</p>
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
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString('fr-FR')}`} />
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
                    <TableCell className="text-right">€{product.sales.toLocaleString('fr-FR')}</TableCell>
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
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">La croissance est saine, principalement portée par la hausse du nombre de transactions. La part de marché gagne 1.2 point.</p>
                <p className="text-sm text-muted-foreground mt-4"><strong>Recommandation :</strong> Consolider la croissance chez Carrefour où la DN est excellente. Lancer un plan d'action spécifique pour Intermarché où la DN est plus faible.</p>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}
