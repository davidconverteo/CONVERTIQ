'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  Home,
  Megaphone,
  ShoppingCart,
  Sparkles,
  PieChart,
  Tag,
  Store,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Accueil' },
  { href: '/media-brand', icon: Megaphone, label: 'Media Brand' },
  { href: '/retail-media', icon: ShoppingCart, label: 'Retail Media' },
  { href: '/creative-studio', icon: Sparkles, label: 'Studio Créatif' },
  { href: '/mmm', icon: PieChart, label: 'MMM' },
  { href: '/performances', icon: Tag, label: 'Performances Comm.' },
  { href: '/digital-shelf', icon: Store, label: 'Digital Shelf' },
  { href: '/donnees-consommateurs', icon: Users, label: 'Données Conso.' },
];

export default function Sidebar({ children }: { children?: ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
          <BrainCircuit className="h-6 w-6 text-primary" />
        </div>
        <span className="font-headline text-2xl font-bold text-sidebar-foreground">
          AdForge AI
        </span>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              pathname === item.href
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
