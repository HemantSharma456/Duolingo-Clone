'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Full-screen experiences (no desktop sidebar/topbar shell)
  const isFullScreen =
    pathname.startsWith('/lesson') ||
    pathname === '/onboarding' ||
    pathname === '/welcome';

  if (isFullScreen) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Layout */}
      <div className="duo-main-wrapper">
        {pathname !== '/courses' && pathname !== '/settings' && <Topbar />}
        <main className="duo-page-container">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </>
  );
}
