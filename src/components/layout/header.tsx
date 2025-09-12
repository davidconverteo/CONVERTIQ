'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './sidebar';
import Link from 'next/link';
import ChatbotTrigger from '@/components/chatbot';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Cockpit Marketing', subtitle: "Vue d'ensemble de votre performance." },
  '/creative-studio': { title: 'Studio Créatif IA', subtitle: "Générez et adaptez vos visuels de campagne." },
  '/media-brand': { title: 'Media Brand', subtitle: "Analyse de la performance de vos campagnes." },
  '/retail-media': { title: 'Retail Media', subtitle: "Performance de vos activations e-commerce." },
  '/mmm': { title: 'Marketing Mix Modeling', subtitle: "Analysez la contribution de vos leviers." },
  '/performances': { title: 'Performances Commerciales', subtitle: "Analysez vos ventes sur tous les canaux." },
  '/digital-shelf': { title: 'Digital Shelf', subtitle: "Monitorez votre présence en ligne." },
  '/donnees-consommateurs': { title: 'Données Consommateurs', subtitle: "Comprenez le profil de vos acheteurs." },
  '/settings': { title: 'Paramètres', subtitle: "Gérez les préférences de votre compte." },
};

export default function Header() {
  const pathname = usePathname();
  const { title, subtitle } = pageTitles[pathname] ?? { title: 'ConvertIQ', subtitle: 'Bienvenue' };
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6 md:px-8">
       <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-md p-2 hover:bg-muted">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] bg-sidebar p-0">
            {/* We need to re-create the sidebar here for mobile, but as a standard div not aside */}
            <div className="flex h-full flex-col text-sidebar-foreground">
                <div className="flex h-20 items-center gap-3 px-6">
                  <Link href="/dashboard" className="flex items-center gap-3">
                     <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={140} height={32} className="h-8 w-auto object-contain brightness-[10] contrast-[1.2]" />
                  </Link>
                </div>
                <Sidebar>
                  <ChatbotTrigger />
                </Sidebar>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div>
        <h1 className="font-headline text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <Avatar>
          {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}