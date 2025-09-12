
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight } from 'lucide-react';
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

const decisionTreeData = [
    {
        name: 'Dessert Plaisir',
        size: 45,
        formats: [
            {
                name: 'Pot Individuel',
                size: 25,
                brands: [
                    { name: 'La Prairie Gourmande', size: 10 },
                    { name: 'Danone', size: 8 },
                    { name: 'Autres', size: 7 },
                ]
            },
            {
                name: 'Pack',
                size: 20,
                brands: [
                    { name: 'MDD', size: 8 },
                    { name: 'Yoplait', size: 7 },
                    { name: 'La Prairie Gourmande', size: 5 },
                ]
            },
        ]
    },
    {
        name: 'Snack Sain',
        size: 30,
        formats: [
             {
                name: 'Pot Individuel',
                size: 18,
                brands: [
                    { name: 'La Prairie Gourmande (Skyr)', size: 9 },
                    { name: 'Danone (Light & Free)', size: 5 },
                    { name: 'Autres', size: 4 },
                ]
            },
            {
                name: 'A boire',
                size: 12,
                brands: [
                    { name: 'Yoplait (Yop)', size: 6 },
                    { name: 'Danone (Actimel)', size: 4 },
                    { name: 'La Prairie Gourmande', size: 2 },
                ]
            },
        ]
    },
    {
        name: 'Basique Cuisine',
        size: 15,
        formats: [
            {
                name: 'Grand Pot',
                size: 15,
                brands: [
                     { name: 'MDD', size: 7 },
                    { name: 'La Prairie Gourmande (Bio)', size: 5 },
                    { name: 'Autres', size: 3 },
                ]
            }
        ]
    },
     {
        name: 'Pour les enfants',
        size: 10,
        formats: [
            {
                name: 'Gourde',
                size: 7,
                brands: [
                    { name: 'Pom Potes', size: 4 },
                    { name: 'La Prairie Gourmande', size: 3 },
                ]
            },
            {
                name: 'Petit Pot',
                size: 3,
                brands: [
                     { name: 'Nestlé', size: 2 },
                     { name: 'MDD', size: 1 },
                ]
            },
        ]
    },
];

const Column = ({ title, items, selectedItem, onItemClick }: { title: string, items: any[], selectedItem: string | null, onItemClick: (item: any) => void }) => (
    <div className="flex flex-col gap-2">
        <h4 className="font-semibold text-center text-muted-foreground">{title}</h4>
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-2 min-h-[400px]">
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onItemClick(item)}
                    className={cn(
                        "rounded-md border p-3 text-left transition-all duration-300 w-full",
                        selectedItem === item.name ? "border-primary bg-primary/10 shadow-lg" : "bg-card hover:bg-card/80",
                    )}
                >
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-foreground">{item.name}</span>
                        <span className="text-lg font-bold text-primary">{item.size}%</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

export default function DecisionTreeTab({ filters }: DecisionTreeTabProps) {
    const [selectedNeed, setSelectedNeed] = useState<any | null>(decisionTreeData[0]);
    const [selectedFormat, setSelectedFormat] = useState<any | null>(decisionTreeData[0].formats[0]);

    const handleNeedClick = (need: any) => {
        setSelectedNeed(need);
        setSelectedFormat(need.formats[0]);
    };

    const handleFormatClick = (format: any) => {
        setSelectedFormat(format);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Arbre de Décision Shopper - Catégorie Ultra-Frais</CardTitle>
                    <CardDescription>Visualisation des critères de choix des consommateurs. Cliquez sur un élément pour explorer son chemin de décision.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                        <Column
                            title="1. Unité de Besoin"
                            items={decisionTreeData}
                            selectedItem={selectedNeed?.name || null}
                            onItemClick={handleNeedClick}
                        />
                        <Column
                            title="2. Format"
                            items={selectedNeed?.formats || []}
                            selectedItem={selectedFormat?.name || null}
                            onItemClick={handleFormatClick}
                        />
                        <Column
                            title="3. Marque"
                            items={selectedFormat?.brands || []}
                            selectedItem={null}
                            onItemClick={() => {}} // No action on brand click
                        />
                    </div>
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
                    <div>
                        <strong>Recommandation Stratégique :</strong>
                        <ol className="mt-2 list-decimal pl-5 space-y-1">
                            <li><strong>Défendre :</strong> Protéger votre position sur les pots individuels "plaisir" et "sain".</li>
                            <li><strong>Attaquer :</strong> Envisager le lancement d'un produit "à boire" sous la gamme Skyr pour concurrencer directement Yop et Actimel sur le segment "Snack Sain".</li>
                            <li><strong>Développer :</strong> Augmenter la part de voix sur les formats "Pack Plaisir" via des offres promotionnelles ciblées pour contester la dominance de la MDD.</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
