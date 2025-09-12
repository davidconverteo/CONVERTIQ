
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Treemap, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { TrendingUp, Percent, Download, BrainCircuit } from 'lucide-react';

const contributionData = [
  { channel: 'TV', contribution: 40, roi: 3.5 },
  { channel: 'Digital', contribution: 35, roi: 5.2 },
  { channel: 'Presse', contribution: 10, roi: 2.1 },
  { channel: 'Affichage', contribution: 8, roi: 1.8 },
  { channel: 'Radio', contribution: 7, roi: 2.5 },
];

const digitalBreakdown = [
  { name: 'SEA', size: 45 },
  { name: 'Social Media', size: 30 },
  { name: 'Display', size: 15 },
  { name: 'Affiliation', size: 10 },
];

const haloEffectData = [
    { name: "TV -> Digital", value: 15 },
    { name: "Digital -> Magasin", value: 25 },
    { name: "Presse -> Digital", value: 8 },
]
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function MMMPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                 <CardTitle className="font-headline">Marketing Mix Modeling (MMM)</CardTitle>
                 <CardDescription>Analysez la contribution de chaque levier marketing à vos ventes.</CardDescription>
            </div>
            <Button><Download className="mr-2 h-4 w-4"/> Télécharger le rapport</Button>
        </CardHeader>
       </Card>

       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Percent /> Contribution aux Ventes</CardTitle>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={contributionData} layout="vertical">
                            <XAxis type="number" unit="%" />
                            <YAxis type="category" dataKey="channel" width={80} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Bar dataKey="contribution" fill="hsl(var(--primary))" name="Contribution" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> ROI par Levier</CardTitle>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={contributionData}>
                            <XAxis dataKey="channel" />
                            <YAxis />
                            <Tooltip formatter={(value) => `x${value}`} />
                            <Bar dataKey="roi" fill="hsl(var(--accent))" name="ROI" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit /> Effets de Halo</CardTitle>
                    <CardDescription>Influence indirecte entre les canaux.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={haloEffectData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {haloEffectData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}% de l'effet total`} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
       </div>

        <Card>
            <CardHeader>
                <CardTitle>Détail de la Contribution Digitale</CardTitle>
                <CardDescription>Répartition de l'impact au sein des canaux digitaux.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                     <Treemap
                        data={digitalBreakdown}
                        dataKey="size"
                        ratio={4 / 3}
                        stroke="#fff"
                        fill="hsl(var(--primary))"
                        content={<CustomTreemapContent />}
                    />
                </ResponsiveContainer>
            </CardContent>
             <CardFooter className="text-center text-sm text-muted-foreground">
                <p>La taille de chaque rectangle est proportionnelle à sa contribution aux ventes générées par le digital.</p>
             </CardFooter>
        </Card>
    </div>
  );
}

const CustomTreemapContent = ({ root, depth, x, y, width, height, index, payload, rank, name }: any) => {
    if (!payload) return null;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: `hsl(var(--primary) / ${ (depth + 1) / (root.children.length + 1) * 100 + 30}%)`,
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          className="font-bold"
        >
          {name}
        </text>
         <text
          x={x + width / 2}
          y={y + height / 2 + 20}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
        >
          ({payload.size}%)
        </text>
      </g>
    );
};
