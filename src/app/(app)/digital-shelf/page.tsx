
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileDown, Search, Filter } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const productData = [
  { id: 'PROD001', name: 'Yaourt Nature Bio', retailer: 'Carrefour', stock: 'in_stock', price: 2.5, position: 3, review: 4.5, contentScore: 95 },
  { id: 'PROD002', name: 'Yaourt aux Fruits', retailer: 'Auchan', stock: 'low_stock', price: 2.8, position: 8, review: 4.2, contentScore: 88 },
  { id: 'PROD003', name: 'Yaourt Grec', retailer: 'Leclerc', stock: 'out_of_stock', price: 3.1, position: 12, review: 4.8, contentScore: 92 },
  { id: 'PROD004', name: 'Skyr Nature', retailer: 'Carrefour', stock: 'in_stock', price: 3.5, position: 2, review: 4.9, contentScore: 98 },
  { id: 'PROD005', name: 'Yaourt Végétal', retailer: 'Monoprix', stock: 'in_stock', price: 3.2, position: 15, review: 4.0, contentScore: 85 },
  { id: 'PROD006', name: 'Yaourt à boire', retailer: 'Auchan', stock: 'low_stock', price: 1.9, position: 5, review: 4.3, contentScore: 90 },
];

const StockBadge = ({ status }: { status: string }) => {
    switch(status) {
        case 'in_stock': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">En Stock</Badge>;
        case 'low_stock': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Stock Faible</Badge>;
        case 'out_of_stock': return <Badge variant="destructive">En Rupture</Badge>;
        default: return <Badge variant="outline">Inconnu</Badge>;
    }
}

export default function DigitalShelfPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [retailerFilter, setRetailerFilter] = useState('all');

    const filteredData = productData
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => retailerFilter === 'all' || p.retailer === retailerFilter);
    
    const retailers = ['all', ...Array.from(new Set(productData.map(p => p.retailer)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analyse du Rayon Digital</CardTitle>
          <CardDescription>Surveillez la disponibilité, le prix et la performance de vos produits chez les distributeurs.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <Select onValueChange={setRetailerFilter} value={retailerFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par enseigne" />
                        </SelectTrigger>
                        <SelectContent>
                            {retailers.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'Toutes les enseignes' : r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Exporter
                    </Button>
                </div>
            </div>
        </CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Enseigne</TableHead>
              <TableHead>Disponibilité</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-center">Position Page</TableHead>
              <TableHead className="text-center">Note Moyenne</TableHead>
              <TableHead>Score Contenu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(product => (
                <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.retailer}</TableCell>
                    <TableCell><StockBadge status={product.stock} /></TableCell>
                    <TableCell className="text-right">€{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.position}</TableCell>
                    <TableCell className="text-center">{product.review.toFixed(1)}/5</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={product.contentScore} className="w-[100px]" />
                           <span>{product.contentScore}%</span>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="ghost">Charger plus de produits</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
