
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Users, Cake, MapPin, Heart, ShoppingBag } from 'lucide-react';

const ageData = [
  { name: '18-24', value: 25 },
  { name: '25-34', value: 45 },
  { name: '35-44', value: 15 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 5 },
];

const locationData = [
  { name: 'Île-de-France', value: 35 },
  { name: 'Auvergne-Rhône-Alpes', value: 20 },
  { name: 'PACA', value: 15 },
  { name: 'Hauts-de-France', value: 12 },
  { name: 'Autres', value: 18 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];


const interestData = [
    { subject: 'Bio', A: 120, fullMark: 150 },
    { subject: 'Local', A: 98, fullMark: 150 },
    { subject: 'Promotions', A: 86, fullMark: 150 },
    { subject: 'Nouveautés', A: 99, fullMark: 150 },
    { subject: 'Recettes', A: 85, fullMark: 150 },
    { subject: 'Écologie', A: 65, fullMark: 150 },
];

const segmentData = [
    { name: 'Familles', description: "Achats fréquents, panier moyen élevé, sensibles aux promotions." },
    { name: 'Jeunes Actifs', description: "Recherche de praticité, produits sains et nouveautés. Moins sensibles au prix." },
    { name: 'Seniors', description: "Fidèles à la marque, recherche de qualité et de produits traditionnels." },
    { name: 'Étudiants', description: "Budget serré, recherche de basiques et de promotions. Achats impulsifs." },
]


export default function ConsumerDataPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Cake /> Répartition par Âge</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={60} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin /> Répartition Géographique</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={locationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                           {locationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart /> Centres d'Intérêt</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={interestData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Users /> Segments de Consommateurs</CardTitle>
          <CardDescription>Profils types de vos clients basés sur leurs comportements d'achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {segmentData.map((segment) => (
                <div key={segment.name} className="rounded-lg border bg-card p-4">
                    <h3 className="flex items-center gap-2 font-semibold text-primary"><ShoppingBag className="h-5 w-5"/> {segment.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{segment.description}</p>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
