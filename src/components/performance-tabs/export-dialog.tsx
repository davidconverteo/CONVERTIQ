
'use client';

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Loader2 } from 'lucide-react';

interface ExportDialogProps {
    tabTitle: string;
    items: {
        data: string[];
        graphs: string[];
    };
}

export default function ExportDialog({ tabTitle, items }: ExportDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'xls'>('pdf');
  const [selectedData, setSelectedData] = useState<string[]>(items.data);
  const [selectedGraphs, setSelectedGraphs] = useState<string[]>(items.graphs);

  const handleDataCheckedChange = (item: string, checked: boolean) => {
    setSelectedData(prev => checked ? [...prev, item] : prev.filter(i => i !== item));
  };
  
  const handleGraphCheckedChange = (item: string, checked: boolean) => {
    setSelectedGraphs(prev => checked ? [...prev, item] : prev.filter(i => i !== item));
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast({
      title: "Export en cours de génération...",
      description: "Votre fichier sera téléchargé dans quelques instants.",
    });

    const exportUrl = process.env.NEXT_PUBLIC_EXPORT_FUNCTION_URL;

    if (!exportUrl) {
        toast({
            variant: "destructive",
            title: "Erreur de configuration",
            description: "L'URL de la fonction d'export n'est pas définie.",
        });
        setIsExporting(false);
        return;
    }

    try {
        const response = await fetch(exportUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tabTitle,
                selectedItems: {
                    data: selectedData,
                    graphs: selectedGraphs,
                },
                format,
            }),
        });

        if (!response.ok) {
            throw new Error(`Le serveur a répondu avec le statut ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${tabTitle.toLowerCase()}.${format === 'xls' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast({
            title: "Export terminé !",
            description: "Votre fichier a été téléchargé.",
        });

    } catch (error) {
        console.error("Export error:", error);
        toast({
            variant: "destructive",
            title: "Échec de l'export",
            description: "Une erreur est survenue lors de la génération du fichier.",
        });
    } finally {
        setIsExporting(false);
        setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!isExporting) setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2" />
          Exporter cet onglet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Exporter l'onglet: {tabTitle}</DialogTitle>
          <DialogDescription>
            Sélectionnez les éléments à inclure dans votre export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">Données</h4>
                    <div className="space-y-2">
                        {items.data.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`data-${item}`} 
                                    checked={selectedData.includes(item)}
                                    onCheckedChange={(checked) => handleDataCheckedChange(item, !!checked)}
                                />
                                <Label htmlFor={`data-${item}`} className="text-sm font-normal">{item}</Label>
                            </div>
                        ))}
                        {items.data.length === 0 && <p className="text-sm text-muted-foreground">Aucune donnée</p>}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Graphiques</h4>
                    <div className="space-y-2">
                        {items.graphs.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`graph-${item}`} 
                                    checked={selectedGraphs.includes(item)}
                                    onCheckedChange={(checked) => handleGraphCheckedChange(item, !!checked)}
                                />
                                <Label htmlFor={`graph-${item}`} className="text-sm font-normal">{item}</Label>
                            </div>
                        ))}
                        {items.graphs.length === 0 && <p className="text-sm text-muted-foreground">Aucun graphique</p>}
                    </div>
                </div>
            </div>
          
            <div className="space-y-2 pt-4">
                <h4 className="font-semibold">Format de sortie</h4>
                <RadioGroup value={format} onValueChange={(value: 'pdf' | 'xls') => setFormat(value)} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="format-pdf" />
                        <Label htmlFor="format-pdf">PDF</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="xls" id="format-xls" />
                        <Label htmlFor="format-xls">Excel (XLSX)</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>Annuler</Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
            Générer l'export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
