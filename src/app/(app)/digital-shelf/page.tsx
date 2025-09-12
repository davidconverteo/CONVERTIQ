
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Search, Filter, AlertTriangle, CheckCircle2, XCircle, FileWarning, Lightbulb, MapPin, Building, Package, Layers, Star, MessageSquare, Image as ImageIcon, Heading1 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countryOptions, retailerOptions, brandOptions, gammeOptions } from "@/services/filters-data";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

type Filters = {
    country: string;
    retailer: string;
    brand: string;
    gamme: string;
};

// --- Data Generation ---
const generateDigitalShelfData = (filters: Filters) => {
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(JSON.stringify(filters));
    const seededRandom = (min: number, max: number, salt = "") => {
        let t = seed + hashCode(salt) + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return result * (max - min) + min;
    };

    const products = [
        'Yaourt Brassé Fraise 4x125g', 'Yaourt Brassé Vanille 4x125g', 'Grand Pot Nature Bio 450g',
        'Skyr Nature 150g', 'Yaourt à la Grecque Miel 2x150g', 'Gourde Fraise-Banane 4x90g', 'Dessert Végétal Amande 2x100g'
    ];

    const allRetailers = retailerOptions.filter(r => r.value !== 'all').map(r => r.label);
    const selectedRetailerLabel = retailerOptions.find(r => r.value === filters.retailer)?.label;
    
    const activeRetailers = (filters.retailer === 'all' || !selectedRetailerLabel) ? allRetailers : [selectedRetailerLabel];

    // Availability Data
    const availabilityMatrix = products.map(product => {
        const statuses: { [key: string]: 'in_stock' | 'low_stock' | 'out_of_stock' } = {};
        activeRetailers.forEach(retailer => {
            const rand = seededRandom(0, 1, product + retailer);
            if (rand < 0.8) statuses[retailer] = 'in_stock';
            else if (rand < 0.95) statuses[retailer] = 'low_stock';
            else statuses[retailer] = 'out_of_stock';
        });
        return { product, ...statuses };
    });

    const alerts = availabilityMatrix.flatMap(row => 
        Object.entries(row)
            .filter(([key, value]) => key !== 'product' && value !== 'in_stock')
            .map(([enseigne, statut]) => ({
                product: row.product as string,
                enseigne: enseigne,
                statut: statut as string,
                duree: `${Math.floor(seededRandom(1, 4, row.product + enseigne))} jours`
            }))
    );
    
    const oosCount = alerts.filter(a => a.statut === 'out_of_stock').length;
    const availabilityRate = (products.length * activeRetailers.length > 0) 
        ? (1 - (oosCount / (products.length * activeRetailers.length))) * 100 
        : 100;
    const notReferencedCount = Math.floor(seededRandom(0, 3, "non-ref"));

    // Search Data
    const searchShare = seededRandom(25, 35, 'search-share');
    const avgRank = seededRandom(2.5, 4.5, 'avg-rank');
    const keywordRanking = [
        { keyword: 'yaourt', rank: Math.floor(seededRandom(1, 3, 'kw-yaourt')), share: seededRandom(30, 40, 'kw-yaourt-s') },
        { keyword: 'yaourt bio', rank: Math.floor(seededRandom(2, 4, 'kw-bio')), share: seededRandom(18, 25, 'kw-bio-s') },
        { keyword: 'skyr', rank: Math.floor(seededRandom(1, 2, 'kw-skyr')), share: seededRandom(40, 55, 'kw-skyr-s') },
        { keyword: 'dessert végétal', rank: Math.floor(seededRandom(4, 7, 'kw-veg')), share: seededRandom(10, 15, 'kw-veg-s') },
        { keyword: 'yaourt enfant', rank: Math.floor(seededRandom(3, 5, 'kw-enfant')), share: seededRandom(15, 22, 'kw-enfant-s') },
    ].sort((a,b) => a.rank - b.rank);

    // Content Data
    const contentScore = seededRandom(75, 95, 'content-score');
    const avgRating = seededRandom(4.3, 4.8, 'avg-rating');
    const reviewCount = Math.floor(seededRandom(500, 1200, 'review-count'));
    const contentRadarData = [
        { subject: 'Titre', A: seededRandom(80, 100, 'radar-title'), fullMark: 100 },
        { subject: 'Images', A: seededRandom(70, 95, 'radar-images'), fullMark: 100 },
        { subject: 'Description', A: seededRandom(65, 90, 'radar-desc'), fullMark: 100 },
        { subject: 'Bullet Points', A: seededRandom(75, 98, 'radar-bullets'), fullMark: 100 },
        { subject: 'Avis', A: avgRating * 20, fullMark: 100 },
    ];
    const reviewKeywords = ['frais', 'bon', 'crémeux', 'bio', 'nature', 'cher', 'emballage', 'doux', 'texture'];


    return { 
        availabilityRate, oosCount, notReferencedCount, availabilityMatrix, alerts,
        searchShare, avgRank, keywordRanking,
        contentScore, avgRating, reviewCount, contentRadarData, reviewKeywords
    };
};


// --- Components ---

const AvailabilityStatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'in_stock': return <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />;
        case 'low_stock': return <FileWarning className="h-5 w-5 text-yellow-500 mx-auto" />;
        case 'out_of_stock': return <XCircle className="h-5 w-5 text-red-500 mx-auto" />;
        default: return null;
    }
};

const AlertStatusBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'low_stock': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Stock Faible</Badge>;
        case 'out_of_stock': return <Badge variant="destructive">Rupture</Badge>;
        default: return null;
    }
};

const KeywordRankBadge = ({ rank }: { rank: number }) => {
    if (rank <= 3) return <Badge className="bg-green-100 text-green-800 border-green-300">Top 3</Badge>;
    if (rank <= 5) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Top 5</Badge>;
    return <Badge variant="secondary">Hors Top 5</Badge>;
};


// --- Main Page Component ---
export default function DigitalShelfPage() {
    const [country, setCountry] = useState(countryOptions[0].value);
    const [retailer, setRetailer] = useState(retailerOptions[0].value);
    const [brand, setBrand] = useState(brandOptions[0].value);
    const [gamme, setGamme] = useState(gammeOptions[0].value);

    const filters = { country, retailer, brand, gamme };

    const { availabilityRate, oosCount, notReferencedCount, availabilityMatrix, alerts, searchShare, avgRank, keywordRanking, contentScore, avgRating, reviewCount, contentRadarData, reviewKeywords } = useMemo(() => generateDigitalShelfData(filters), [filters]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Filter /> Filtres Globaux</CardTitle>
                  <CardDescription>Affinez l'analyse pour le Digital Shelf.</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Select onValueChange={setCountry} value={country}>
                      <SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger>
                      <SelectContent>
                          {countryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <Select onValueChange={setRetailer} value={retailer}>
                      <SelectTrigger><SelectValue placeholder="Enseigne" /></SelectTrigger>
                      <SelectContent>
                           {retailerOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <Select onValueChange={setBrand} value={brand}>
                      <SelectTrigger><SelectValue placeholder="Marque" /></SelectTrigger>
                      <SelectContent>
                           {brandOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <Select onValueChange={setGamme} value={gamme}>
                      <SelectTrigger><SelectValue placeholder="Gamme" /></SelectTrigger>
                      <SelectContent>
                           {gammeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground">Données de la semaine du {new Date('2025-08-04').toLocaleDateString('fr-FR')}</p>
      </div>

       <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability">Présence &amp; Disponibilité</TabsTrigger>
          <TabsTrigger value="search">Performance de Recherche</TabsTrigger>
          <TabsTrigger value="content">Contenu &amp; Conversion</TabsTrigger>
        </TabsList>
        <TabsContent value="availability" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Taux de disponibilité moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{availabilityRate.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Produits en rupture (OOS)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-500">{oosCount}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Produits non référencés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-500">{notReferencedCount}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Matrice de Disponibilité</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    {availabilityMatrix.length > 0 && Object.keys(availabilityMatrix[0]).filter(k => k !== 'product').map(retailerName => (
                                        <TableHead key={retailerName} className="text-center">{retailerName}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availabilityMatrix.map(row => (
                                    <TableRow key={row.product}>
                                        <TableCell className="font-medium">{row.product}</TableCell>
                                        {Object.entries(row).filter(([key]) => key !== 'product').map(([key, value]) => (
                                            <TableCell key={key}><AvailabilityStatusIcon status={value as string} /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Alertes Actuelles</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Enseigne</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Durée</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alerts.map((alert, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium truncate max-w-[150px]">{alert.product}</TableCell>
                                        <TableCell>{alert.enseigne}</TableCell>
                                        <TableCell><AlertStatusBadge status={alert.statut as string} /></TableCell>
                                        <TableCell>{alert.duree}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                        <CardTitle className="text-blue-900 dark:text-blue-200">Analyse IA</CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">Votre taux de disponibilité est bon, mais des ruptures sont détectées sur des produits à forte rotation chez E.Leclerc. Priorisez la résolution de ces alertes pour éviter une perte de chiffre d'affaires.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </TabsContent>
         <TabsContent value="search" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Part de Voix Recherche (1ère page)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{searchShare.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Rang Moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{avgRank.toFixed(1)}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Mots-clés en Top 3</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{keywordRanking.filter(k => k.rank <= 3).length}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Classement par Mot-Clé</CardTitle>
                        <CardDescription>Votre positionnement sur les recherches stratégiques.</CardDescription>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mot-clé</TableHead>
                                <TableHead className="text-center">Rang</TableHead>
                                <TableHead className="text-right">Part de Voix</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keywordRanking.map(kw => (
                                <TableRow key={kw.keyword}>
                                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                                    <TableCell className="text-center"><KeywordRankBadge rank={kw.rank} /></TableCell>
                                    <TableCell className="text-right">{kw.share.toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                        <Lightbulb className="h-5 w-5 text-blue-500 mt-1" />
                        <div>
                            <CardTitle className="text-blue-900 dark:text-blue-200">Analyse IA</CardTitle>
                            <CardDescription className="text-blue-700 dark:text-blue-300">
                                Vous êtes leader sur le mot-clé "skyr", ce qui est excellent. Cependant, votre rang moyen sur "dessert végétal" est de {keywordRanking.find(k => k.keyword === 'dessert végétal')?.rank}, ce qui indique une opportunité d'optimisation (mots-clés dans le titre, campagnes de produits sponsorisés).
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </TabsContent>
         <TabsContent value="content" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Score de Contenu Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{contentScore.toFixed(0)}/100</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Note Moyenne des Avis</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-3xl font-bold text-primary flex items-center gap-1">{avgRating.toFixed(1)} <Star className="h-7 w-7 text-yellow-400 fill-yellow-400" /></p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Nombre Total d'Avis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{Math.floor(reviewCount)}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Détail du Score de Contenu</CardTitle>
                        <CardDescription>Performance sur les 5 piliers du contenu.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={contentRadarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                                <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Thématiques des Avis Clients</CardTitle>
                        <CardDescription>Principaux termes mentionnés par vos consommateurs.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2 items-center justify-center">
                        {reviewKeywords.map((kw, i) => (
                            <Badge 
                                key={kw} 
                                variant="outline"
                                style={{ 
                                    fontSize: `${(2 - i * 0.15)}rem`,
                                    opacity: 1 - i * 0.1,
                                }}
                                className="font-bold"
                            >
                                {kw}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
            </div>
             <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                        <CardTitle className="text-blue-900 dark:text-blue-200">Analyse IA</CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                           Votre score de contenu est bon, principalement grâce à des titres et bullet points bien optimisés. Cependant, la qualité des images pourrait être améliorée. Les avis mentionnent souvent le mot "cher", suggérant une sensibilité au prix. Valorisez le rapport qualité-prix dans vos descriptions.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    