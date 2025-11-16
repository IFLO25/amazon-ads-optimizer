'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  Key, 
  TrendingUp,
  DollarSign,
  BarChart3, 
  Bell,
  Calendar,
  Shield,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kampagnen', href: '/campaigns', icon: Target },
  { name: 'Keywords', href: '/keywords', icon: Key },
  { name: 'Optimierung', href: '/optimization', icon: TrendingUp },
  { name: 'Budget', href: '/budget', icon: DollarSign },
  { name: 'Berichte', href: '/reports', icon: BarChart3 },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Dayparting', href: '/dayparting', icon: Calendar },
  { name: 'Brand Protection', href: '/protection', icon: Shield },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Amazon Ads Optimizer</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-500">
          Vollautomatisches System
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Aktiv</span>
          </div>
        </div>
      </div>
    </div>
  );
}
