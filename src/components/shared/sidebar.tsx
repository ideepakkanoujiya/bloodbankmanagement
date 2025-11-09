'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Droplets,
  HeartPulse,
  BarChart2,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from '../logo';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donors', label: 'Donors', icon: Users },
  { href: '/inventory', label: 'Inventory', icon: Droplets },
  { href: '/requests', label: 'Requests', icon: HeartPulse },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-72 border-r border-border/20 bg-background/50 backdrop-blur-xl z-10">
      <TooltipProvider delayDuration={0}>
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-center border-b border-border/20">
             <Link href="/" className="flex items-center gap-2 group">
                <HeartPulse className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h1 className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Bloodflow</h1>
            </Link>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-center md:justify-start gap-3 rounded-lg px-3 py-3 text-foreground/70 transition-all hover:text-foreground hover:bg-primary/10',
                      pathname === item.href && 'bg-primary/20 text-primary font-semibold'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-all',
                        pathname === item.href ? 'text-primary' : 'group-hover:text-accent'
                      )}
                      style={{ animation: 'float 3s ease-in-out infinite' }}
                    />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="block md:hidden">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </div>
      </TooltipProvider>
    </aside>
  );
}
