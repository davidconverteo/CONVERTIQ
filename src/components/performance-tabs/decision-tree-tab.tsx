
'use client';

import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

interface DecisionTreeTabProps {
    filters: Filters;
}

const generateTreeData = (filters: Filters) => {
    // This data would typically come from a complex shopper behavior model
    return [
      {
        name: 'Dessert Plaisir (45%)',
        size: 45,
        children: [
          { name: 'Pot Individuel', size: 25, children: [
            { name: 'La Prairie Gourmande', size: 10 },
            { name: 'Danone', size: 8 },
            { name: 'Autres', size: 7 },
          ]},
          { name: 'Pack', size: 20, children: [
            { name: 'MDD', size: 8 },
            { name: 'Yoplait', size: 7 },
            { name: 'La Prairie Gourmande', size: 5 },
          ]},
        ],
      },
      {
        name: 'Snack Sain (30%)',
        size: 30,
        children: [
          { name: 'Pot Individuel', size: 18, children: [
            { name: 'La Prairie Gourmande (Skyr)', size: 9 },
            { name: 'Danone (Light & Free)', size: 5 },
            { name: 'Autres', size: 4 },
          ]},
          { name: 'A boire', size: 12, children: [
            { name: 'Yoplait (Yop)', size: 6 },
            { name: 'Danone (Actimel)', size: 4 },
            { name: 'La Prairie Gourmande', size: 2 },
          ]},
        ],
      },
      {
        name: 'Basique Cuisine (15%)',
        size: 15,
        children: [
          { name: 'Grand Pot', size: 15, children: [
            { name: 'MDD', size: 7 },
            { name: 'La Prairie Gourmande (Bio)', size: 5 },
            { name: 'Autres', size: 3 },
          ] },
        ],
      },
      {
        name: 'Pour les enfants (10%)',
        size: 10,
        children: [
          { name: 'Gourde', size: 7, children: [
             { name: 'Pom Potes', size: 4 },
             { name: 'La Prairie Gourmande', size: 3 },
          ] },
          { name: 'Petit Pot', size: 3, children: [
            { name: 'Nestlé', size: 2 },
            { name: 'MDD', size: 1 },
          ] },
        ],
      },
    ];
};

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name } = props;
    
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
        {depth === 1 && width > 30 && height > 30 ? (
          <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
            <div className="w-full h-full text-white font-semibold text-xs flex items-center justify-center text-center overflow-hidden">
                {name}
            </div>
          </foreignObject>
        ) : null}
         {depth > 1 && width > 50 && height > 25 ? (
          <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" fill="#fff" fontSize={12} className="font-medium">
            {name}
          </text>
        ) : null}
      </g>
    );
};

const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-bold text-foreground">{data.name}</p>
          <p className="text-sm text-primary">Poids dans les décisions : {data.size}%</p>
        </div>
      );
    }
    return null;
};


export default function DecisionTreeTab({ filters }: DecisionTreeTabProps) {
  const treeData = useMemo(() => generateTreeData(filters), [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Arbre de Décision Shopper - Catégorie Ultra-Frais</CardTitle>
                <CardDescription>Visualisation des critères de choix des consommateurs. La taille des rectangles représente le poids du critère dans la décision d'achat.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        data={treeData}
                        dataKey="size"
                        stroke="#fff"
                        fill="hsl(var(--primary))"
                        aspectRatio={4 / 3}
                        content={<CustomTreemapContent />}
                        isAnimationActive={false}
                    >
                      <Tooltip content={<CustomTooltipContent />} />
                    </Treemap>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Synthèse & Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                    L'arbre de décision montre que le <strong>"Dessert Plaisir"</strong> est le principal besoin (45% des occasions d'achat). Au sein de ce segment, votre marque est bien positionnée sur les pots individuels mais a une part plus faible sur les packs.
                </p>
                <p>
                    Le besoin <strong>"Snack Sain"</strong> (30%) est une autre opportunité majeure. Votre gamme Skyr capte bien ce besoin sur les pots individuels, mais vous êtes quasi-absent du format "à boire", dominé par Yoplait et Danone.
                </p>
                <p>
                    <strong>Recommandation Stratégique :</strong>
                    <ol className="mt-2 list-decimal pl-5 space-y-1">
                        <li><strong>Défendre :</strong> Protéger votre position sur les pots individuels "plaisir" et "sain".</li>
                        <li><strong>Attaquer :</strong> Envisager le lancement d'un produit "à boire" sous la gamme Skyr pour concurrencer directement Yop et Actimel sur le segment "Snack Sain".</li>
                        <li><strong>Développer :</strong> Augmenter la part de voix sur les formats "Pack Plaisir" via des offres promotionnelles ciblées pour contester la dominance de la MDD.</li>
                    </ol>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
