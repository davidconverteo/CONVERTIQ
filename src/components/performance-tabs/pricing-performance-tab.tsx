
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const growthData = [
  { name: 'CA N-1', value: 4500000 },
  { name: 'Effet Volume', value: 300000 },
  { name: 'Effet Prix', value: -50000 },
  { name: 'Effet Promo', value: 150000 },
  { name: 'CA N', value: 4900000 },
];

const priceEvoData = [
  { retailer: 'Carrefour', avgPrice: 2.75, priceEvo: '+1.2%', promoWeight: '22%', sovProspectus: '30%' },
  { retailer: 'E.Leclerc', avgPrice: 2.71, priceEvo: '-0.5%', promoWeight: '25%', sovProspectus: '25%' },
  { retailer: 'Intermarché', avgPrice: 2.78, priceEvo: '+2.1%', promoWeight: '18%', sovProspectus: '20%' },
  { retailer: 'Système U', avgPrice: 2.73, priceEvo: '+0.8%', promoWeight: '23%', sovProspectus: '15%' },
];


export default function PricingPerformanceTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contribution à la Croissance du CA</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value:number) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR')}/>
              <Legend />
              <Bar dataKey="value" name="Contribution" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pilotage Prix & Promo par Enseigne</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enseigne</TableHead>
              <TableHead className="text-right">Prix Moyen/U</TableHead>
              <TableHead className="text-right">Évo. Prix</TableHead>
              <TableHead className="text-right">Poids Promo</TableHead>
              <TableHead className="text-right">PDV Prospectus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceEvoData.map((row) => (
              <TableRow key={row.retailer}>
                <TableCell className="font-medium">{row.retailer}</TableCell>
                <TableCell className="text-right">€{row.avgPrice.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${row.priceEvo.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{row.priceEvo}</TableCell>
                <TableCell className="text-right">{row.promoWeight}</TableCell>
                <TableCell className="text-right">{row.sovProspectus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
