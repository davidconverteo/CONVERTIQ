
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DollarSign, Package, ShoppingCart, Percent } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const salesOverTime = [
  { date: '2023-01', GMS: 350000, 'En Ligne': 80000 },
  { date: '2023-02', GMS: 380000, 'En Ligne': 85000 },
  { date: '2023-03', GMS: 420000, 'En Ligne': 110000 },
  { date: '2023-04', GMS: 410000, 'En Ligne': 105000 },
  { date: '2023-05', GMS: 450000, 'En Ligne': 120000 },
  { date: '2023-06', GMS: 480000, 'En Ligne': 130000 },
];

const topProducts = [
    {id: 1, name: "Yaourt Nature Bio 4x125g", sales: 45200, evolution: 5.2},
    {id: 2, name: "Yaourt Grec 2x150g", sales: 38900, evolution: 12.1},
    {id: 3, name: "Skyr Nature 450g", sales: 35100, evolution: 25.8},
    {id: 4, name: "Yaourt Fruits Rouges Bio 4x125g", sales: 28500, evolution: 2.3},
    {id: 5, name: "Yaourt Végétal Amande 2x100g", sales: 22300, evolution: -1.5},
]

const EvolutionBadge = ({ value }: { value: number }) => {
    if (value > 0) return <Badge className="bg-green-100 text-green-800">+{value}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{value}%</Badge>;
}

export default function SalesPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes Totales (GMS)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">€2.4M</div>
                <p className="text-xs text-muted-foreground">+15.2% vs. S1 2022</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unités Vendues</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1.1M</div>
                <p className="text-xs text-muted-foreground">+12.8% vs. S1 2022</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">€25.40</div>
                <p className="text-xs text-muted-foreground">+2.1% vs. S1 2022</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Part de Marché</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">18.3%</div>
                <p className="text-xs text-muted-foreground">+0.5 pts vs. S1 2022</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Évolution des Ventes</CardTitle>
                    <CardDescription>Comparaison des ventes en GMS et en ligne.</CardDescription>
                </div>
                <Select defaultValue="6m">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1m">Dernier mois</SelectItem>
                        <SelectItem value="3m">3 derniers mois</SelectItem>
                        <SelectItem value="6m">6 derniers mois</SelectItem>
                        <SelectItem value="12m">12 derniers mois</SelectItem>
                    </SelectContent>
                </Select>
              </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString('fr-FR')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="GMS" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="En Ligne" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Top 5 Produits</CardTitle>
            <CardDescription>Les produits les plus performants en termes de chiffre d'affaires.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Ventes (CA)</TableHead>
              <TableHead className="text-center">Évolution vs. N-1</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product, index) => (
                <TableRow key={product.id}>
                    <TableCell className="font-bold">{index+1}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">€{product.sales.toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-center">
                        <EvolutionBadge value={product.evolution} />
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">Données pour le premier semestre 2023.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
