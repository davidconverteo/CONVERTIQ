
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { DollarSign, Eye, MousePointerClick, TrendingUp, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const kpiData = [
    { title: "ROAS Total", value: "5.2x", icon: TrendingUp },
    { title: "Dépenses Totales", value: "€45,800", icon: DollarSign },
    { title: "Impressions", value: "12.5M", icon: Eye },
    { title: "Taux de Clics (CTR)", value: "3.8%", icon: MousePointerClick },
]

const performanceByRetailer = [
  { retailer: 'Carrefour', spend: 15000, roas: 5.8, impressions: 4200000 },
  { retailer: 'Auchan', spend: 12000, roas: 4.9, impressions: 3500000 },
  { retailer: 'Leclerc', spend: 10000, roas: 5.5, impressions: 2800000 },
  { retailer: 'Monoprix', spend: 8800, roas: 4.5, impressions: 2000000 },
];

const roasEvolution = [
    {date: "Jan", roas: 4.8},
    {date: "Fév", roas: 5.1},
    {date: "Mar", roas: 5.5},
    {date: "Avr", roas: 5.3},
    {date: "Mai", roas: 5.2},
    {date: "Juin", roas: 5.6},
]

export default function RetailMediaPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
             <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <Card>
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Performance par Enseigne</CardTitle>
                    <CardDescription>Analyse des dépenses, du ROAS et des impressions pour chaque distributeur.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <Select defaultValue="roas">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="roas">ROAS (décroissant)</SelectItem>
                            <SelectItem value="spend">Dépenses (décroissant)</SelectItem>
                            <SelectItem value="impressions">Impressions (décroissant)</SelectItem>
                        </SelectContent>
                    </Select>
              </div>
          </CardHeader>
          <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Enseigne</TableHead>
                <TableHead className="text-right">Dépenses</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {performanceByRetailer.map(item => (
                    <TableRow key={item.retailer}>
                        <TableCell className="font-medium">{item.retailer}</TableCell>
                        <TableCell className="text-right">€{item.spend.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.roas}x</TableCell>
                        <TableCell className="text-right">{item.impressions.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dépenses vs ROAS</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceByRetailer}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="retailer" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" label={{ value: 'Dépenses (€)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" label={{ value: 'ROAS', angle: 90, position: 'insideRight' }}/>
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="spend" fill="hsl(var(--primary))" name="Dépenses" />
                            <Bar yAxisId="right" dataKey="roas" fill="hsl(var(--accent))" name="ROAS" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Évolution du ROAS Mensuel</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={roasEvolution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value}x`} />
                            <Legend />
                            <Line type="monotone" dataKey="roas" name="ROAS" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
