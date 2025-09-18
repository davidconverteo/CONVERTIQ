
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, Treemap } from 'recharts';
import { cn } from '@/lib/utils';
import { retailerOptions as allRetailerOptions } from '@/services/filters-data';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface OfferByRetailerTabProps {
    filters: Filters;
}

const generatePotentialData = (retailer: string) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(retailer);
    const seededRandom = (min: number, max: number, salt: string) => {
        let t = seed + hashCode(salt) + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max - min) + min;
    };

    const allProducts = [
        'Yaourt Brassé Fraise 4x125g', 'Yaourt Brassé Vanille 4x125g', 'Grand Pot Nature Bio 450g', 'Skyr Nature 150g', 'Yaourt à la Grecque Miel 2x150g',
        'Gourde Pomme 4x90g', 'Dessert Végétal Amande 2x100g', 'Yaourt Brassé Pêche 4x125g', 'Skyr sur lit de fruits 150g', 'Yaourt Végétal Coco 2x100g',
        'Crème Dessert Chocolat 4x100g', 'Yaourt à boire Framboise 500ml', 'Fromage Blanc 500g', 'Petit Suisse Nature 6x60g', 'Kéfir de Lait Nature 1L',
        'Yaourt Bio Citron 4x125g', 'Skyr Vanille 150g', 'Yaourt Grec Myrtille 2x150g', 'Gourde Poire 4x90g', 'Dessert Végétal Soja Nature 4x100g'
    ];

    const potential = allProducts
        .map((p, i) => ({
            name: p,
            gain: seededRandom(10000, 50000, p) / (1 + i * 0.2), // Diminishing returns
            listed: seededRandom(0, 1, p) > 0.6
        }))
        .filter(p => !p.listed)
        .sort((a,b) => b.gain - a.gain)
        .slice(0, 20);

    let cumulativeGain = 0;
    const baseCA = 250000;
    const saturation = potential.map((p, index) => {
        const previousCA = baseCA + cumulativeGain;
        cumulativeGain += p.gain;
        return {
            name: `${index + 1}. ${p.name}`,
            references: index + 1,
            base: previousCA,
            increment: p.gain,
            total: previousCA + p.gain,
        };
    });

    const planogram = [
        { name: 'La Prairie Gourmande', size: seededRandom(15, 25, 'lpg') },
        { name: 'MDD', size: seededRandom(30, 45, 'mdd') },
        { name: 'Yoplait', size: seededRandom(10, 20, 'yoplait') },
        { name: 'Danone', size: seededRandom(18, 28, 'danone') },
        { name: 'Autres', size: seededRandom(5, 10, 'autres') },
    ];


    return { potential, saturation, planogram };
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-bold text-foreground">{`${data.name}`}</p>
          <p className="text-sm text-primary">{`Gain Incrémental : ${data.increment.toLocaleString('fr-FR')}€`}</p>
          <p className="text-sm text-muted-foreground">{`CA Total : ${data.total.toLocaleString('fr-FR')}€`}</p>
        </div>
      );
    }
    return null;
};


export default function OfferByRetailerTab({ filters }: OfferByRetailerTabProps) {
    const retailerOptions = allRetailerOptions.filter(o => o.value !== 'all');
    const [selectedRetailer, setSelectedRetailer] = useState(retailerOptions[0].value);
    const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);

    const { potential, saturation, planogram } = useMemo(() => generatePotentialData(selectedRetailer), [selectedRetailer, filters]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <label htmlFor="retailer-select" className="font-medium">Choisir une enseigne :</label>
                        <Select onValueChange={setSelectedRetailer} value={selectedRetailer}>
                            <SelectTrigger id="retailer-select" className="w-[220px]">
                                <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                                {retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Potentiel de Référencement</CardTitle>
                        <CardDescription>Gain de CA potentiel en référençant ces produits.</CardDescription>
                    </CardHeader>
                     <div className="h-[350px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-card">
                                <TableRow>
                                    <TableHead>Référence Non Listée</TableHead>
                                    <TableHead className="text-right">Gain de CA Potentiel</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {potential.map((p, index) => (
                                    <TableRow 
                                        key={p.name}
                                        className={cn("transition-colors", highlightedProduct === `${index + 1}. ${p.name}` ? "bg-primary/10" : "")}
                                        onMouseEnter={() => setHighlightedProduct(`${index + 1}. ${p.name}`)}
                                        onMouseLeave={() => setHighlightedProduct(null)}
                                    >
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">{p.gain.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Courbe de Saturation</CardTitle>
                        <CardDescription>Impact du référencement de nouvelles références sur le CA.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart 
                                data={saturation} 
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                onMouseMove={(state) => {
                                    if (state.isTooltipActive && state.activePayload) {
                                        setHighlightedProduct(state.activePayload[0].payload.name);
                                    }
                                }}
                                onMouseLeave={() => setHighlightedProduct(null)}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="references" name="Nb. Réf." />
                                <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" payload={[{ value: 'CA existant', type: 'rect', color: 'hsl(var(--muted))' }, { value: 'Gain incrémental', type: 'rect', color: 'hsl(var(--primary))' }]} />
                                <Bar dataKey="base" name="CA existant" stackId="a" fill="hsl(var(--muted))" />
                                <Bar dataKey="increment" name="Gain incrémental" stackId="a" fill="hsl(var(--primary))">
                                    {saturation.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            className={cn(highlightedProduct === entry.name ? "opacity-100" : "opacity-75", "transition-opacity")}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Planogramme Illustratif</CardTitle>
                    <CardDescription>RAYON ULTRA-FRAIS // ENSEIGNE: {allRetailerOptions.find(o => o.value === selectedRetailer)?.label.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <Treemap
                            data={planogram}
                            dataKey="size"
                            stroke="#fff"
                            fill="hsl(var(--primary))"
                            aspectRatio={4 / 1}
                            content={<CustomizedTreemapContent />}
                        />
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
}

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomizedTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, rank, name = '' } = props;
  
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: COLORS[index % COLORS.length],
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {
          width > 80 && height > 40 ? 
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={14}>
            {name}
          </text>
          : null
        }
      </g>
    );
  };
