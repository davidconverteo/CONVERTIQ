
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, ShoppingCart, Percent, Users, Store, LineChart as LineChartIcon, Tv, Wifi, Power, TrendingUp, Tag, Boxes } from "lucide-react";
import OfflinePerformanceTab from "@/components/performance-tabs/offline-performance-tab";


export default function PerformancesPage() {
  return (
    <div className="space-y-6">
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
            <Card><CardHeader><CardTitle>D2C</CardTitle><CardContent><p>Contenu à venir pour le D2C.</p></CardContent></CardHeader></Card>
        </TabsContent>
        <TabsContent value="offline" className="mt-6">
            <OfflinePerformanceTab />
        </TabsContent>
        <TabsContent value="online" className="mt-6">
            <Card><CardHeader><CardTitle>Online (Drive)</CardTitle><CardContent><p>Contenu à venir pour le Online (Drive).</p></CardContent></CardHeader></Card>
        </TabsContent>
        <TabsContent value="potential" className="mt-6">
            <Card><CardHeader><CardTitle>Potentiel</CardTitle><CardContent><p>Contenu à venir pour le Potentiel.</p></CardContent></CardHeader></Card>
        </TabsContent>
        <TabsContent value="pricing" className="mt-6">
            <Card><CardHeader><CardTitle>Prix & Promotions</CardTitle><CardContent><p>Contenu à venir pour les Prix & Promotions.</p></CardContent></CardHeader></Card>
        </TabsContent>
        <TabsContent value="offer" className="mt-6">
            <Card><CardHeader><CardTitle>Offre</CardTitle><CardContent><p>Contenu à venir pour l'Offre.</p></CardContent></CardHeader></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
