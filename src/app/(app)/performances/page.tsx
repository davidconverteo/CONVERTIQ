
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Power, Tv, Wifi, TrendingUp, Tag, Boxes } from "lucide-react";
import OfflinePerformanceTab from "@/components/performance-tabs/offline-performance-tab";
import D2CPerformanceTab from "@/components/performance-tabs/d2c-performance-tab";
import OnlinePerformanceTab from "@/components/performance-tabs/online-performance-tab";
import PotentialPerformanceTab from "@/components/performance-tabs/potential-performance-tab";
import PricingPerformanceTab from "@/components/performance-tabs/pricing-performance-tab";
import OfferPerformanceTab from "@/components/performance-tabs/offer-performance-tab";


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
            <D2CPerformanceTab />
        </TabsContent>
        <TabsContent value="offline" className="mt-6">
            <OfflinePerformanceTab />
        </TabsContent>
        <TabsContent value="online" className="mt-6">
            <OnlinePerformanceTab />
        </TabsContent>
        <TabsContent value="potential" className="mt-6">
            <PotentialPerformanceTab />
        </TabsContent>
        <TabsContent value="pricing" className="mt-6">
            <PricingPerformanceTab />
        </TabsContent>
        <TabsContent value="offer" className="mt-6">
            <OfferPerformanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
