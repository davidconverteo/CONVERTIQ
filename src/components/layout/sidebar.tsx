
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Megaphone,
  ShoppingCart,
  Sparkles,
  PieChart,
  BarChart2,
  Store,
  Users,
  Settings,
  FlaskConical,
  LayoutTemplate,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import ChatbotTrigger from '../chatbot';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Accueil' },
  { href: '/brand-media', icon: Megaphone, label: 'Brand Media' },
  { href: '/retail-media', icon: ShoppingCart, label: 'Retail Media' },
  { href: '/creative-studio', icon: Sparkles, label: 'Studio Créatif' },
  { href: '/report-canvas', icon: LayoutTemplate, label: "Canevas d'Analyse" },
  { href: '/mmm', icon: BrainCircuit, label: 'MMM' },
  { href: '/performances', icon: BarChart2, label: 'Performances' },
  { href: '/digital-shelf', icon: Store, label: 'Digital Shelf' },
  { href: '/donnees-consommateurs', icon: Users, label: 'Données Conso.' },
  { href: '/labo-insights', icon: FlaskConical, label: "Labo d'Insights" },
];

export default function Sidebar({ children }: { children?: ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-20 items-center justify-center bg-white px-4">
        <Link href="/dashboard">
          <Image src="https://i.postimg.cc/BvSXnkMw/Convert-IQ-logo.png" alt="ConvertIQ Logo" width={180} height={41} className="h-10 w-auto object-contain" />
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(item.href) && item.href !== '/dashboard' || pathname === item.href
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="space-y-2 p-4">
        <ChatbotTrigger />
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            pathname === '/settings'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent/50'
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Link>
        {children}
      </div>
    </aside>
  );
}
