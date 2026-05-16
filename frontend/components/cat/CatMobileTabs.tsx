'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const catNavItems = [
  { href: '/cat/dashboard', label: 'Dashboard' },
  { href: '/cat/daily-log', label: 'Daily Log' },
  { href: '/cat/mocks', label: 'Mock Tests' },
  { href: '/cat/analytics', label: 'Analytics' },
  { href: '/cat/schedule', label: 'Schedule' },
  { href: '/cat/strategy', label: 'Strategy' },
];

export function CatMobileTabs() {
  const pathname = usePathname();

  return (
    <div className="md:hidden bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide sticky top-0 z-40 -mx-4 -mt-6 mb-6">
      <div className="flex px-4 py-3 gap-2 w-max">
        {catNavItems.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
