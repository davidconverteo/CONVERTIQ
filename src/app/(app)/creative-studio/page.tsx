import CreativeStudio from '@/components/creative-studio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Bot } from 'lucide-react';
import ImageVariationsStudio from '@/components/image-variations-studio';

export default function CreativeStudioPage() {
  return (
    <Tabs defaultValue="creation" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="creation">
          <Palette className="mr-2" />
          Création & Adaptation
        </TabsTrigger>
        <TabsTrigger value="variations">
          <Bot className="mr-2" />
          Variations Rapides
        </TabsTrigger>
      </TabsList>
      <TabsContent value="creation" className="mt-6">
        <CreativeStudio />
      </TabsContent>
      <TabsContent value="variations" className="mt-6">
        <ImageVariationsStudio />
      </TabsContent>
    </Tabs>
  );
}
