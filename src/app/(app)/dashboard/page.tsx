
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Users, Sparkles, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const kpiData = [
    { title: "Chiffre d'affaires", value: "€1.2M", change: "+12.5%", changeType: "increase", icon: DollarSign },
    { title: "Ventes en ligne", value: "8,452", change: "+8.2%", changeType: "increase", icon: ShoppingCart },
    { title: "Nouveaux Clients", value: "1,203", change: "-2.1%", changeType: "decrease", icon: Users },
    { title: "Coût d'acquisition", value: "€15.70", change: "+5.3%", changeType: "decrease", icon: DollarSign },
];

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Fév', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Avr', sales: 4500 },
  { name: 'Mai', sales: 6000 },
  { name: 'Juin', sales: 5500 },
];

const trafficData = [
  { name: 'Lun', uv: 400, pv: 2400 },
  { name: 'Mar', uv: 300, pv: 1398 },
  { name: 'Mer', uv: 200, pv: 9800 },
  { name: 'Jeu', uv: 278, pv: 3908 },
  { name: 'Ven', uv: 189, pv: 4800 },
  { name: 'Sam', uv: 239, pv: 3800 },
  { name: 'Dim', uv: 349, pv: 4300 },
];

const channelData = [
    { name: 'Organique', value: 400 },
    { name: 'Payant', value: 300 },
    { name: 'Direct', value: 200 },
    { name: 'Référents', value: 100 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
const creativeImage = PlaceHolderImages.find(img => img.id === 'creative-example');

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                        {kpi.changeType === 'increase' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {kpi.change} vs. mois dernier
                    </p>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Ventes Mensuelles</CardTitle>
                  <CardDescription>Évolution du chiffre d'affaires sur les 6 derniers mois.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Trafic du Site Web</CardTitle>
                  <CardDescription>Visiteurs uniques (UV) et pages vues (PV) cette semaine.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="pv" stroke="hsl(var(--primary))" name="Pages Vues" />
                        <Line type="monotone" dataKey="uv" stroke="hsl(var(--accent))" name="Visiteurs Uniques" />
                    </LineChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Répartition des Canaux</CardTitle>
                <CardDescription>Origine de votre trafic.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Studio Créatif IA</CardTitle>
                <CardDescription>Générez et adaptez vos visuels de campagne en un clic.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
                {creativeImage && (
                    <Image 
                        src={creativeImage.imageUrl} 
                        alt="Exemple de création" 
                        width={200}
                        height={200}
                        data-ai-hint={creativeImage.imageHint}
                        className="rounded-lg object-cover shadow-lg"
                    />
                )}
                <div className="space-y-4">
                    <p className="text-muted-foreground">Besoin d'un nouveau visuel pour votre prochaine campagne ? Laissez notre IA vous surprendre.</p>
                    <Button asChild>
                        <Link href="/creative-studio">
                            Aller au studio <MoveRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
