'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/lesson/')) {
    return null;
  }

  const navItems = [
    { name: 'Learn', href: '/', icon: '🏠' },
    { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
    { name: 'Practice', href: '/practice', icon: '⚡' },
    { name: 'Shop', href: '/shop', icon: '💎' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <nav className="duo-mobile-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-extrabold no-underline transition-colors ${
              isActive
                ? 'text-[var(--duo-blue)] bg-[var(--duo-blue-light)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
