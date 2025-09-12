
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DollarSign, ShoppingCart, Users, Percent, UserPlus, Repeat } from "lucide-react";

const kpiData = [
    { title: "Chiffre d'Affaires", value: "€125k", change: "+12.5%", icon: DollarSign },
    { title: "Commandes", value: "3,450", change: "+8.2%", icon: ShoppingCart },
    { title: "Panier Moyen", value: "€36.35", change: "+4.1%", icon: DollarSign },
    { title: "Taux de Conv.", value: "2.8%", change: "+0.3 pts", icon: Percent },
    { title: "Nouveaux Clients", value: "1,980", change: "+21%", icon: UserPlus },
    { title: "Taux de Rachat", value: "35%", change: "+5 pts", icon: Repeat },
];

const funnelData = [
  { name: 'Visites', value: 125000 },
  { name: 'Vues Produit', value: 80000 },
  { name: 'Ajouts Panier', value: 25000 },
  { name: 'Paiement', value: 15000 },
  { name: 'Achat', value: 3450 },
];

export default function D2CPerformanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {kpiData.map((kpi) => (
            <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change} vs. mois dernier</p>
                </CardContent>
            </Card>
        ))}
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Funnel de Conversion D2C</CardTitle>
          <CardDescription>Parcours client de la visite à l'achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR')} />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" name="Utilisateurs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
