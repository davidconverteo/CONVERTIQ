
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Youtube, DollarSign, Eye, MousePointerClick, TrendingUp } from "lucide-react";

const campaignData = [
  { name: 'Campagne Hiver', platform: 'Facebook', spend: 5000, reach: 120000, clicks: 8500, status: 'active' },
  { name: 'Lancement Végétal', platform: 'Instagram', spend: 7500, reach: 250000, clicks: 15000, status: 'active' },
  { name: 'Recettes Estivales', platform: 'Youtube', spend: 12000, reach: 800000, clicks: 45000, status: 'completed' },
  { name: 'Promo Rentrée', platform: 'Facebook', spend: 4000, reach: 95000, clicks: 6200, status: 'paused' },
];

const performanceByPlatform = [
  { platform: 'Facebook', ROI: 4.5, CPA: 1.2 },
  { platform: 'Instagram', ROI: 5.2, CPA: 0.9 },
  { platform: 'Youtube', ROI: 3.8, CPA: 2.5 },
  { platform: 'TikTok', ROI: 6.1, CPA: 0.7 },
];

const budgetAllocation = [
    {name: 'Facebook', value: 30},
    {name: 'Instagram', value: 40},
    {name: 'Youtube', value: 20},
    {name: 'Autres', value: 10},
]
const COLORS = ['#4267B2', '#E1306C', '#FF0000', '#6B7280'];


const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
        case 'instagram': return <Instagram className="h-5 w-5 text-pink-500" />;
        case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />;
        default: return null;
    }
};
const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'active': return <Badge className="bg-green-500">Active</Badge>;
        case 'paused': return <Badge variant="secondary" className="bg-yellow-500">En Pause</Badge>;
        case 'completed': return <Badge variant="outline">Terminée</Badge>;
        default: return null;
    }
}


export default function MediaBrandPage() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">€28,500</div>
                    <p className="text-xs text-muted-foreground">+5% ce mois-ci</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portée Totale (Reach)</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2M</div>
                    <p className="text-xs text-muted-foreground">Personnes uniques touchées</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clics Totaux</CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">74,700</div>
                    <p className="text-xs text-muted-foreground">Taux de clics moyen: 6.2%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI Global</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.8x</div>
                    <p className="text-xs text-muted-foreground">Retour sur investissement</p>
                </CardContent>
            </Card>
        </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance par Plateforme</CardTitle>
            <CardDescription>Comparaison du ROI et du Coût par Acquisition (CPA).</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceByPlatform}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="ROI" fill="hsl(var(--primary))" name="ROI" />
                    <Bar yAxisId="right" dataKey="CPA" fill="hsl(var(--accent))" name="CPA (€)" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Allocation Budgétaire</CardTitle>
                <CardDescription>Répartition des dépenses par canal.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={budgetAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {budgetAllocation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Détail des Campagnes</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {campaignData.map(campaign => (
                    <div key={campaign.name} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <PlatformIcon platform={campaign.platform} />
                            <div>
                                <p className="font-semibold">{campaign.name}</p>
                                <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                            </div>
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-4 text-sm sm:grid-cols-4 sm:text-center">
                            <div>
                                <p className="font-medium">€{campaign.spend.toLocaleString()}</p>
                                <p className="text-muted-foreground">Dépensé</p>
                            </div>
                             <div>
                                <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                                <p className="text-muted-foreground">Portée</p>
                            </div>
                             <div>
                                <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                                <p className="text-muted-foreground">Clics</p>
                            </div>
                             <div className="flex items-center justify-end sm:justify-center">
                                <StatusBadge status={campaign.status} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
