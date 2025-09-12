
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Treemap, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { TrendingUp, Percent, Download, BrainCircuit, Sparkles } from 'lucide-react';
import { mmmData } from '@/services/data-service';

const contributionData = mmmData.France['s1-2025'].contributions;
const investmentData = mmmData.France['s1-2025'].investments;

const chartData = Object.keys(contributionData).map(channel => ({
    channel: channel,
    contribution: (contributionData[channel as keyof typeof contributionData] / (mmmData.France['s1-2025'].baseline + Object.values(contributionData).reduce((a,b) => a+b, 0))) * 100,
    roi: investmentData[channel as keyof typeof investmentData] > 0 ? contributionData[channel as keyof typeof contributionData] / investmentData[channel as keyof typeof investmentData] : 0
}));


const digitalBreakdown = [
  { name: 'SEA', size: 45 },
  { name: 'Social Media', size: 30 },
  { name: 'Display', size: 15 },
  { name: 'Affiliation', size: 10 },
];

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
                        <BarChart data={chartData} layout="vertical">
                            <XAxis type="number" unit="%" />
                            <YAxis type="category" dataKey="channel" width={80} />
                            <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
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
                        <BarChart data={chartData}>
                            <XAxis dataKey="channel" />
                            <YAxis />
                            <Tooltip formatter={(value) => `x${(value as number).toFixed(1)}`} />
                            <Bar dataKey="roi" fill="hsl(var(--accent))" name="ROI" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Recommandation IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Le modèle MMM indique que le **Retail Media** et le **Social** sont vos leviers les plus rentables (ROAS &gt; 4.0). En revanche, la **Presse** et l'**Affichage** ont une contribution et un ROAS plus faibles.
                        <br/><br/>
                        <strong>Recommandation :</strong> Envisagez de réallouer une partie du budget Affichage et Presse (-20%) vers le Retail Media et le Social Media pour maximiser le retour sur investissement global sur le prochain semestre.
                    </p>
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
    if (!payload || !payload.size) return null;
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
