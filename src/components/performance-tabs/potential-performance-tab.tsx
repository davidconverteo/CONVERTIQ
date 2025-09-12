
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ZAxis, Cell } from 'recharts';

const data = [
  { retailer: 'E.Leclerc', pdm: 24.1, perf: 115, volume: 350000, color: 'hsl(var(--chart-1))' },
  { retailer: 'Carrefour', pdm: 25.5, perf: 110, volume: 300000, color: 'hsl(var(--chart-2))' },
  { retailer: 'Auchan', pdm: 15, perf: 120, volume: 250000, color: 'hsl(var(--chart-3))' },
  { retailer: 'Casino', pdm: 28, perf: 85, volume: 150000, color: 'hsl(var(--chart-4))' },
  { retailer: 'Lidl', pdm: 8, perf: 90, volume: 200000, color: 'hsl(var(--chart-5))' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Enseigne
            </span>
            <span className="font-bold text-foreground">{data.retailer}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Volume
            </span>
            <span className="font-bold text-foreground">
              {data.volume.toLocaleString('fr-FR')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              PDM
            </span>
            <span className="font-bold text-foreground">{data.pdm}%</span>
          </div>
           <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Perf. Cat.
            </span>
            <span className="font-bold text-foreground">{data.perf}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export default function PotentialPerformanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matrice de Potentiel de Développement</CardTitle>
        <CardDescription>
          Croisement de notre part de marché par enseigne et de la performance de la catégorie dans cette enseigne.
          La taille de la bulle représente le volume des ventes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis type="number" dataKey="pdm" name="Part de Marché" unit="%" />
            <YAxis type="number" dataKey="perf" name="Performance Catégorie" unit="" />
            <ZAxis type="number" dataKey="volume" range={[100, 1000]} name="Volume" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
            <Scatter name="Enseignes" data={data}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
