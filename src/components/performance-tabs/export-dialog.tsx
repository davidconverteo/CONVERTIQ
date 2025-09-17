
'use client';

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from 'lucide-react';

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
                            <Checkbox id={`data-${item}`} defaultChecked />
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
                            <Checkbox id={`graph-${item}`} defaultChecked />
                            <Label htmlFor={`graph-${item}`} className="text-sm font-normal">{item}</Label>
                            </div>
                        ))}
                        {items.graphs.length === 0 && <p className="text-sm text-muted-foreground">Aucun graphique</p>}
                    </div>
                </div>
            </div>
          
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
