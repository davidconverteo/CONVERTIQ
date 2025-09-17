'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
                    <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={32} height={32} className="object-contain" />
                    <CardTitle className="text-lg">Analyse & Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">À retenir</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Le <strong>"Dessert Plaisir"</strong> est le principal besoin (45% des occasions d'achat).</li>
                            <li>Sur le besoin "Snack Sain", votre gamme <strong>Skyr</strong> est forte en pot, mais absente du format "à boire".</li>
                            <li>La <strong>MDD</strong> est un concurrent majeur sur les formats pack économiques.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Nos recommandations</h4>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li><strong>Attaquer :</strong> Lancer un produit "à boire" (type Yop) sous la gamme Skyr pour capter le besoin "Snack Sain" nomade.</li>
                            <li><strong>Défendre :</strong> Lancer une campagne promotionnelle sur les packs "Dessert Plaisir" pour contrer la MDD.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Pour aller plus loin</h4>
                        <p className="text-muted-foreground">Simuler un test de concept pour le nouveau produit "Skyr à boire" dans le Labo d'Insights.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
