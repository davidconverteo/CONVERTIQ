
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, ShoppingCart, Percent, Users, Store, LineChart as LineChartIcon } from "lucide-react";
import SalesPerformancePage from "@/components/performance-tabs/sales-performance";
import ConsumerDataPage from "@/app/(app)/donnees-consommateurs/page";
import DigitalShelfPage from "@/app/(app)/digital-shelf/page";


export default function PerformancesPage() {
  return (
    <div className="space-y-6">
       <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="sales">
            <DollarSign className="mr-2"/>
            Performances Commerciales
          </TabsTrigger>
          <TabsTrigger value="consumers">
            <Users className="mr-2"/>
            Données Consommateurs
          </TabsTrigger>
          <TabsTrigger value="shelf">
            <Store className="mr-2"/>
            Digital Shelf
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
            <SalesPerformancePage />
        </TabsContent>
        <TabsContent value="consumers" className="mt-6">
            <ConsumerDataPage />
        </TabsContent>
        <TabsContent value="shelf" className="mt-6">
            <DigitalShelfPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

