
'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Power, Tv, Wifi, TrendingUp, Tag, Boxes, Filter, MapPin, Building, Package, Layers } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OfflinePerformanceTab from "@/components/performance-tabs/offline-performance-tab";
import D2CPerformanceTab from "@/components/performance-tabs/d2c-performance-tab";
import OnlinePerformanceTab from "@/components/performance-tabs/online-performance-tab";
import PotentialPerformanceTab from "@/components/performance-tabs/potential-performance-tab";
import PricingPerformanceTab from "@/components/performance-tabs/pricing-performance-tab";
import OfferPerformanceTab from "@/components/performance-tabs/offer-performance-tab";
import { countryOptions, retailerOptions, brandOptions, gammeOptions } from "@/services/filters-data";

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
