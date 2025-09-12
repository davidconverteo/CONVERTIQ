
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Search, Filter, AlertTriangle, CheckCircle2, XCircle, FileWarning, Lightbulb, MapPin, Building, Package, Layers } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countryOptions, retailerOptions, brandOptions, gammeOptions } from "@/services/filters-data";

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

    const retailers = ['Carrefour Drive', 'E.Leclerc DRIVE', 'Auchan Drive', 'Courses U'];

    const availabilityMatrix = products.map(product => {
        const statuses: { [key: string]: 'in_stock' | 'low_stock' | 'out_of_stock' } = {};
        retailers.forEach(retailer => {
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
                product: row.product,
                enseigne,
                statut,
                duree: `${Math.floor(seededRandom(1, 4, row.product + enseigne))} jours`
            }))
    );
    
    const oosCount = alerts.filter(a => a.statut === 'out_of_stock').length;
    const availabilityRate = (1 - (oosCount / (products.length * retailers.length))) * 100;
    const notReferencedCount = Math.floor(seededRandom(0, 3, "non-ref"));

    return { availabilityRate, oosCount, notReferencedCount, availabilityMatrix, alerts };
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


// --- Main Page Component ---
export default function DigitalShelfPage() {
    const [country, setCountry] = useState(countryOptions[0].value);
    const [retailer, setRetailer] = useState(retailerOptions[0].value);
    const [brand, setBrand] = useState(brandOptions[0].value);
    const [gamme, setGamme] = useState(gammeOptions[0].value);

    const filters = { country, retailer, brand, gamme };

    const { availabilityRate, oosCount, notReferencedCount, availabilityMatrix, alerts } = useMemo(() => generateDigitalShelfData(filters), [filters]);

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
          <TabsTrigger value="availability">Présence & Disponibilité</TabsTrigger>
          <TabsTrigger value="search">Performance de Recherche</TabsTrigger>
          <TabsTrigger value="content">Contenu & Conversion</TabsTrigger>
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
                                    {Object.keys(availabilityMatrix[0] || {}).filter(k => k !== 'product').map(retailerName => (
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
         <TabsContent value="search" className="mt-6">
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">La section "Performance de Recherche" est en cours de construction.</p>
            </div>
        </TabsContent>
         <TabsContent value="content" className="mt-6">
             <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">La section "Contenu & Conversion" est en cours de construction.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


    