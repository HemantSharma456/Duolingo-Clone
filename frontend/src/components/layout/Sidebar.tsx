'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '../../context/GameContext';

// Authentic Duolingo Vector Icons matching Reference Screenshot
const BirdhouseIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path
      d="M7 14L17 6.5L27 14V26C27 27.6569 25.6569 29 24 29H10C8.34315 29 7 27.6569 7 26V14Z"
      fill="#ffc800"
    />
    <path
      d="M7 26.5V27C7 28.1 7.9 29 9 29H25C26.1 29 27 28.1 27 27V26.5C27 27.6 26.1 28.5 25 28.5H9C7.9 28.5 7 27.6 7 26.5Z"
      fill="#e5a800"
    />
    <path
      d="M4.5 15.5L17 5L29.5 15.5C30.1 16 30.1 16.9 29.5 17.4C28.9 17.9 28 17.9 27.5 17.4L17 8.5L6.5 17.4C6 17.9 5.1 17.9 4.5 17.4C3.9 16.9 3.9 16 4.5 15.5Z"
      fill="#ff4b4b"
    />
    <circle cx="17" cy="18" r="3.75" fill="#2d1b0d" />
    <circle cx="17" cy="24" r="1.5" fill="#e5a800" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path
      d="M16 4H8C6.9 4 6 4.9 6 6V15C6 21.5 12 25.8 16 27.5V4Z"
      fill="#ffc800"
    />
    <path
      d="M16 4H24C25.1 4 26 4.9 26 6V15C26 21.5 20 25.8 16 27.5V4Z"
      fill="#e5a800"
    />
  </svg>
);

const QuestsIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <rect x="5" y="14" width="24" height="13" rx="2" fill="#ffc800" />
    <rect x="5" y="24" width="24" height="3" rx="1" fill="#e5a800" />
    <path d="M5 14C5 9.5 8.5 6 13 6H21C25.5 6 29 9.5 29 14H5Z" fill="#ffc800" />
    <rect x="9.5" y="6" width="3.5" height="21" fill="#92400e" />
    <rect x="21" y="6" width="3.5" height="21" fill="#92400e" />
    <rect x="4.5" y="13" width="25" height="2.5" rx="0.8" fill="#e5a800" />
    <rect x="14" y="11.5" width="6" height="5.5" rx="1.2" fill="#ffe066" stroke="#92400e" strokeWidth="1.2" />
    <circle cx="17" cy="14" r="0.9" fill="#78350f" />
  </svg>
);

const ShopIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <rect x="7" y="18" width="20" height="11" rx="2" fill="#788896" />
    <rect x="7" y="26" width="20" height="3" rx="1" fill="#586874" />
    <rect x="9.5" y="21" width="6" height="6.5" rx="1" fill="#60a5fa" />
    <rect x="18.5" y="21" width="5.5" height="8" rx="1" fill="#d1d5db" />
    <path d="M5 11L6.8 18H10.5L9 11H5Z" fill="#ff4b4b" />
    <path d="M9 11L10.5 18H14.5L13 11H9Z" fill="#ffffff" />
    <path d="M13 11L14.5 18H19.5L18 11H13Z" fill="#ff4b4b" />
    <path d="M18 11L19.5 18H23.5L22 11H18Z" fill="#ffffff" />
    <path d="M22 11L23.5 18H27.2L25 11H22Z" fill="#ff4b4b" />
    <path d="M25 11L27.2 18H29L27 11H25Z" fill="#ffffff" />
    <rect x="5" y="17.2" width="24" height="2" rx="1" fill="#ea2b2b" />
  </svg>
);

/** Profile Avatar Icon matching girl character in reference screenshot */
const ProfileAvatarIcon = () => (
  <div className="w-[34px] h-[34px] rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="17" fill="#8842d0" />
      <circle cx="17" cy="19" r="10" fill="#f7d0b5" />
      <path
        d="M7 16 C7 6 27 6 27 16 C27 20 25 24 23 26 C21 21 20 18 17 18 C14 18 13 21 11 26 C9 24 7 20 7 16 Z"
        fill="#9353d3"
      />
      <circle cx="24" cy="11" r="3.5" fill="#ff7089" />
      <circle cx="14" cy="19" r="1.3" fill="#131f24" />
      <circle cx="20" cy="19" r="1.3" fill="#131f24" />
      <path d="M15 22 Q17 25 19 22" stroke="#131f24" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

const MoreIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="17" cy="17" r="14.5" fill="#ce82ff" />
    <circle cx="10.5" cy="17" r="2" fill="#ffffff" />
    <circle cx="17" cy="17" r="2" fill="#ffffff" />
    <circle cx="23.5" cy="17" r="2" fill="#ffffff" />
  </svg>
);

// Icons for the MORE Popover Menu
const EnglishTestIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path
      d="M16 2L19.5 5.5L24.5 5L26 10L30.5 12.5L29.5 17.5L32 22L28 25.5L27.5 30.5L22.5 30L19.5 33.5L16 31L12.5 33.5L9.5 30L4.5 30.5L4 25.5L0 22L2.5 17.5L1.5 12.5L6 10L7.5 5L12.5 5.5L16 2Z"
      fill="#58cc02"
    />
    <path
      d="M11 16C11 13 13 11 16 11C18.5 11 20 12.5 20.5 14C21.5 14 23 15 22.5 16.5C22 18 20.5 18 19.5 18C18.5 19.5 16.5 21 13.5 20.5C12 20 11 18.5 11 16Z"
      fill="white"
    />
    <circle cx="15" cy="14" r="1" fill="#3c3c3c" />
  </svg>
);

const SchoolsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path d="M10 27H22 M16 23V27" stroke="#e5a800" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 16C8 20.4 11.6 24 16 24C20.4 24 24 20.4 24 16" stroke="#e5a800" strokeWidth="2.5" fill="none" />
    <circle cx="16" cy="15" r="9" fill="#1cb0f6" />
    <path d="M11 13C12 11 15 11 16 13C17 15 15 17 13 17C11.5 17 11 15 11 13Z" fill="#58cc02" />
    <path d="M18 16C19 15 21 16 22 17C21 19 19 20 18 19C17 18 17 17 18 16Z" fill="#58cc02" />
    <path d="M13 20C15 20 16 22 15 23C13.5 23.5 12.5 22 13 20Z" fill="#58cc02" />
  </svg>
);

const PodcastIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path d="M7 17C7 12 11 8 16 8C21 8 25 12 25 17" stroke="#ce82ff" strokeWidth="3" strokeLinecap="round" />
    <rect x="5" y="15" width="5" height="10" rx="2.5" fill="#ce82ff" />
    <rect x="22" y="15" width="5" height="10" rx="2.5" fill="#ce82ff" />
  </svg>
);

interface NavItem {
  name: string;
  href: string;
  renderIcon: () => React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'LEARN', href: '/', renderIcon: () => <BirdhouseIcon /> },
  { name: 'LEADERBOARDS', href: '/leaderboard', renderIcon: () => <ShieldIcon /> },
  { name: 'QUESTS', href: '/quests', renderIcon: () => <QuestsIcon /> },
  { name: 'SHOP', href: '/shop', renderIcon: () => <ShopIcon /> },
  { name: 'PROFILE', href: '/profile', renderIcon: () => <ProfileAvatarIcon /> },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useGame();

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMoreMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setMoreMenuOpen(false);
    }, 150);
  };

  // Hide sidebar on the full-screen interactive lesson screen
  if (pathname.startsWith('/lesson/')) {
    return null;
  }

  const isMoreActive = pathname === '/settings' || moreMenuOpen;

  return (
    <aside className="duo-sidebar">
      {/* Brand Header: Authentic Duolingo green wordmark */}
      <div className="pt-7 pb-6 px-4 shrink-0">
        <Link href="/" className="no-underline inline-block group">
          <span className="text-[32px] font-black tracking-[-0.6px] text-[var(--duo-green)] leading-none select-none block">
            duolingo
          </span>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-1.5 shrink-0 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`duo-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                {item.renderIcon()}
              </div>
              <span className="font-extrabold tracking-wider text-[15px]">{item.name}</span>
            </Link>
          );
        })}

        {/* MORE item with Hover Popover Menu */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`duo-nav-item cursor-pointer select-none transition-colors ${
              isMoreActive ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-color)]' : ''
            }`}
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <MoreIcon />
            </div>
            <span className="font-extrabold tracking-wider text-[15px]">MORE</span>
          </div>

          {/* FLOATING MORE POPOVER MENU MATCHING REFERENCE SCREENSHOT */}
          {moreMenuOpen && (
            <div
              className="absolute left-[calc(100%+8px)] top-0 z-50 w-[270px] bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col text-left select-none"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Invisible hover bridge to eliminate dead-zone between button and menu */}
              <div className="absolute -left-3 top-0 bottom-0 w-3 pointer-events-auto" />
              {/* Top Section with Icons */}
              <div className="flex flex-col gap-1">
                {/* 1. DUOLINGO ENGLISH TEST */}
                <Link
                  href="/practice"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <EnglishTestIcon />
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#58cc02] transition-colors leading-tight">
                    DUOLINGO ENGLISH TEST
                  </span>
                </Link>

                {/* 2. SCHOOLS */}
                <Link
                  href="/practice"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <SchoolsIcon />
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors leading-tight">
                    SCHOOLS
                  </span>
                </Link>

                {/* 3. PODCAST */}
                <Link
                  href="/practice"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <PodcastIcon />
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#ce82ff] transition-colors leading-tight">
                    PODCAST
                  </span>
                </Link>
              </div>

              {/* Horizontal Divider Line */}
              <div className="h-[1px] bg-[var(--border-color)] my-2 mx-1" />

              {/* Bottom Section: Text Only, Uppercase Bold */}
              <div className="flex flex-col gap-0.5">
                {/* 4. CREATE A PROFILE */}
                <Link
                  href="/onboarding?step=6"
                  onClick={() => setMoreMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors block">
                    CREATE A PROFILE
                  </span>
                </Link>

                {/* 5. SETTINGS */}
                <Link
                  href="/settings"
                  onClick={() => setMoreMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors block">
                    SETTINGS
                  </span>
                </Link>

                {/* 6. HELP */}
                <Link
                  href="/settings"
                  onClick={() => setMoreMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors block">
                    HELP
                  </span>
                </Link>

                {/* 7. SIGN IN */}
                <Link
                  href="/welcome"
                  onClick={() => setMoreMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group no-underline"
                >
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors block">
                    SIGN IN
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};
