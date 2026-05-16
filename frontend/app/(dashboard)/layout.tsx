'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MobileNav } from '@/components/sidebar/MobileNav';
import { CatMobileTabs } from '@/components/cat/CatMobileTabs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isCatRoute = pathname?.startsWith('/cat');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out pb-20 md:pb-0`}
      >
        {isCatRoute && <CatMobileTabs />}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 w-full">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
