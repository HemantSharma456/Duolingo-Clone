'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/lesson/') || pathname === '/welcome' || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    {
      name: 'Learn',
      href: '/',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-active:scale-95">
          <path
            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
            fill={active ? '#58cc02' : 'none'}
            stroke={active ? '#58cc02' : '#6f8490'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      activeColor: 'text-[#58cc02]',
    },
    {
      name: 'Practice',
      href: '/practice',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-active:scale-95">
          <path
            d="M6.5 6.5L17.5 17.5M4 8L8 4M16 20L20 16M2 11L11 2M13 22L22 13"
            stroke={active ? '#ff9600' : '#6f8490'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      activeColor: 'text-[#ff9600]',
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-active:scale-95">
          <path
            d="M12 3L4 6V12C4 17 7.5 21 12 22C16.5 21 20 17 20 12V6L12 3Z"
            fill={active ? '#ffc800' : 'none'}
            stroke={active ? '#ffc800' : '#6f8490'}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M12 8L13.2 10.8L16 11.1L14 12.9L14.6 15.6L12 14.1L9.4 15.6L10 12.9L8 11.1L10.8 10.8L12 8Z"
            fill={active ? '#ffffff' : '#6f8490'}
          />
        </svg>
      ),
      activeColor: 'text-[#ffc800]',
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-active:scale-95">
          <path
            d="M7 4H17L21 9L12 21L3 9L7 4Z"
            fill={active ? '#1cb0f6' : 'none'}
            stroke={active ? '#1cb0f6' : '#6f8490'}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M7 4L12 21L17 4M3 9H21" stroke={active ? '#ffffff' : '#6f8490'} strokeWidth="1.6" />
        </svg>
      ),
      activeColor: 'text-[#1cb0f6]',
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-active:scale-95">
          <circle
            cx="12"
            cy="8"
            r="4.5"
            fill={active ? '#ce82ff' : 'none'}
            stroke={active ? '#ce82ff' : '#6f8490'}
            strokeWidth="2.2"
          />
          <path
            d="M4.5 19.5C4.5 16 7.5 14 12 14C16.5 14 19.5 16 19.5 19.5"
            stroke={active ? '#ce82ff' : '#6f8490'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ),
      activeColor: 'text-[#ce82ff]',
    },
  ];

  return (
    <nav
      className="duo-mobile-nav"
      aria-label="Mobile Navigation"
      style={{
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
      }}
    >
      <div className="w-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all select-none no-underline ${
                isActive
                  ? `${item.activeColor} bg-[#18282f] border border-[#2b3e48]`
                  : 'text-[#6f8490] hover:text-[#9cb1bc]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {item.icon(isActive)}
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
