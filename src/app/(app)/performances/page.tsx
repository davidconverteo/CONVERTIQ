
'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Power, Tv, Wifi, TrendingUp, Tag, Boxes, Filter, MapPin, Building, Package, Layers, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

import OfflinePerformanceTab from "@/components/performance-tabs/offline-performance-tab";
import D2CPerformanceTab from "@/components/performance-tabs/d2c-performance-tab";
import OnlinePerformanceTab from "@/components/performance-tabs/online-performance-tab";
import PotentialPerformanceTab from "@/components/performance-tabs/potential-performance-tab";
import PricingPerformanceTab from "@/components/performance-tabs/pricing-performance-tab";
import OfferPerformanceTab from "@/components/performance-tabs/offer-performance-tab";
import { countryOptions, retailerOptions, brandOptions, gammeOptions } from "@/services/filters-data";

const exportableItems = {
  d2c: {
    title: "D2C",
    data: ["KPIs de performance D2C"],
    graphs: ["Évolution des KPIs D2C", "Analyse du Funnel de Conversion"],
  },
  offline: {
    title: "Offline",
    data: ["KPIs de performance (Ventes, Unités...)", "Tableau du Top 5 Produits", "Tableau de la Performance par Enseigne"],
    graphs: ["Arbre de décomposition du CA", "Évolution des Ventes vs N-1"],
  },
  online: {
    title: "Online (Drive)",
    data: ["Scorecard Digital Shelf", "Tableau comparatif Drive vs. Offline"],
    graphs: [],
  },
  potential: {
    title: "Potentiel",
    data: [],
    graphs: ["Matrice de Potentiel de Développement"],
  },
  pricing: {
    title: "Prix & Promotions",
    data: ["Tableau de pilotage Prix & Promo"],
    graphs: ["Pont de Croissance du CA"],
  },
  offer: {
    title: "Offre",
    data: ["Classement des Références"],
    graphs: ["Matrice de l'Offre (BCG)"],
  },
};

const ExportDialog = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    setIsOpen(false);
    toast({
      title: "Export en cours de génération...",
      description: "Votre fichier sera téléchargé dans quelques instants.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="mr-2" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurer l'Export</DialogTitle>
          <DialogDescription>
            Sélectionnez les données et graphiques à inclure dans votre export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Accordion type="multiple" defaultValue={Object.keys(exportableItems)} className="w-full">
            {Object.entries(exportableItems).map(([key, value]) => (
              <AccordionItem value={key} key={key}>
                <AccordionTrigger>{value.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Données</h4>
                      <div className="space-y-2">
                        {value.data.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={`${key}-${item}`} defaultChecked />
                            <Label htmlFor={`${key}-${item}`} className="text-sm font-normal">{item}</Label>
                          </div>
                        ))}
                         {value.data.length === 0 && <p className="text-sm text-muted-foreground">Aucune donnée</p>}
                      </div>
                    </div>
                    <div>
                       <h4 className="font-semibold mb-2">Graphiques</h4>
                      <div className="space-y-2">
                        {value.graphs.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={`${key}-${item}`} defaultChecked />
                            <Label htmlFor={`${key}-${item}`} className="text-sm font-normal">{item}</Label>
                          </div>
                        ))}
                        {value.graphs.length === 0 && <p className="text-sm text-muted-foreground">Aucun graphique</p>}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="space-y-2 pt-4">
             <h4 className="font-semibold">Format de sortie</h4>
              <RadioGroup defaultValue="pdf" className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xls" id="format-xls" />
                  <Label htmlFor="format-xls">Excel (XLS)</Label>
                </div>
              </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleExport}>Générer l'export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function PerformancesPage() {
  const [country, setCountry] = useState(countryOptions[0].value);
  const [retailer, setRetailer] = useState(retailerOptions[0].value);
  const [brand, setBrand] = useState(brandOptions[0].value);
  const [gamme, setGamme] = useState(gammeOptions[0].value);

  const filters = { country, retailer, brand, gamme };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Filter /> Filtres Globaux</CardTitle>
                  <CardDescription>Affinez l'analyse pour l'ensemble des onglets de performance.</CardDescription>
              </div>
               <div className="flex items-center gap-2">
                 <ExportDialog />
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

       <Tabs defaultValue="offline" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="d2c">
            <Power className="mr-2"/>
            D2C
          </TabsTrigger>
          <TabsTrigger value="offline">
            <Tv className="mr-2"/>
            Offline
          </TabsTrigger>
          <TabsTrigger value="online">
            <Wifi className="mr-2"/>
            Online (Drive)
          </TabsTrigger>
          <TabsTrigger value="potential">
            <TrendingUp className="mr-2"/>
            Potentiel
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Tag className="mr-2"/>
            Prix & Promotions
          </TabsTrigger>
          <TabsTrigger value="offer">
            <Boxes className="mr-2"/>
            Offre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="d2c" className="mt-6">
            <D2CPerformanceTab filters={filters} />
        </TabsContent>
        <TabsContent value="offline" className="mt-6">
            <OfflinePerformanceTab filters={filters} />
        </TabsContent>
        <TabsContent value="online" className="mt-6">
            <OnlinePerformanceTab filters={filters} />
        </TabsContent>
        <TabsContent value="potential" className="mt-6">
            <PotentialPerformanceTab filters={filters} />
        </TabsContent>
        <TabsContent value="pricing" className="mt-6">
            <PricingPerformanceTab filters={filters} />
        </TabsContent>
        <TabsContent value="offer" className="mt-6">
            <OfferPerformanceTab filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
