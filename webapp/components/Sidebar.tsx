'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/campaigns', label: 'Campaigns', icon: '📢' },
    { href: '/keywords', label: 'Keywords', icon: '🔑' },
    { href: '/optimization', label: 'Optimization', icon: '⚡' },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Amazon Ads</h1>
        <p className="text-gray-400 text-sm">Optimizer Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
