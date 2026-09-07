'use client';

import React from 'react';
import Link from 'next/link';

export const PathRightRail: React.FC = () => {
  return (
    <aside className="duo-path-aside flex flex-col gap-4">
      {/* Card 1: Try Super for free */}
      <div className="w-full rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3 shadow-none relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            {/* Super tag */}
            <div className="inline-block px-2 py-0.5 rounded-md bg-gradient-to-r from-[#ce82ff] via-[#1cb0f6] to-[#58cc02] p-[1.5px] mb-2.5">
              <div className="px-2 py-0.5 rounded-[4px] bg-[var(--bg-surface)]">
                <span className="text-[11px] font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ce82ff] via-[#1cb0f6] to-[#58cc02]">
                  SUPER
                </span>
              </div>
            </div>

            <h3 className="font-black text-base text-[var(--text-primary)] leading-tight">
              Try Super for free
            </h3>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-[190px]">
              No ads, personalized practice, and unlimited Legendary!
            </p>
          </div>

          {/* Authentic Cosmic Flying Super Duo Mascot */}
          <div className="w-[82px] h-[82px] shrink-0 -mr-1 -mt-2 relative flex items-center justify-center select-none">
            <img
              src="/images/super-duo-transparent@2x.png"
              alt="Super Duolingo Flying Owl"
              width={82}
              height={82}
              className="w-full h-full object-contain drop-shadow-md"
              draggable={false}
            />
          </div>
        </div>

        {/* 3D Blue Try 1 Week Free Button */}
        <Link href="/courses" className="no-underline block mt-1">
          <button
            type="button"
            className="w-full h-11 rounded-2xl bg-[#3c4be8] hover:bg-[#4d5cf0] border-b-4 border-[#2935b0] active:border-b-0 active:translate-y-1 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            TRY 1 WEEK FREE
          </button>
        </Link>
      </div>

      {/* Card 2: Unlock Leaderboards! */}
      <div className="w-full rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3 shadow-none">
        <h3 className="font-black text-base text-[var(--text-primary)]">
          Unlock Leaderboards!
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-14 flex items-center justify-center shrink-0 select-none">
            <svg width="44" height="48" viewBox="0 0 44 48" fill="none">
              <path
                d="M22 2L6 8V22C6 34 13 42 22 46C31 42 38 34 38 22V8L22 2Z"
                fill="#32444f"
                stroke="#465864"
                strokeWidth="2"
              />
              <circle cx="22" cy="20" r="3.5" fill="#1b2830" />
              <path d="M20 22H24V28H20V22Z" fill="#1b2830" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[var(--text-secondary)] leading-snug">
            Complete 2 more lessons to start competing
          </p>
        </div>
      </div>

      {/* Card 3: Daily Quests */}
      <div className="w-full rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3 shadow-none">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-[var(--text-primary)]">
            Daily Quests
          </h3>
          <Link
            href="/quests"
            className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline no-underline"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl text-[#ffc800] shrink-0 select-none">⚡</span>
          <div className="flex-1">
            <div className="font-black text-sm text-[var(--text-primary)] mb-1.5">
              Earn 10 XP
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] overflow-hidden relative flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-[#ffc800] rounded-full"
                  style={{ width: '100%' }}
                />
                <span className="relative z-10 text-[10px] font-black text-[#131f24]">
                  10 / 10
                </span>
              </div>
              {/* Bronze Chest Gift Icon */}
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="8" width="20" height="13" rx="2" fill="#8d5b4c" stroke="#a06b5b" strokeWidth="1.5" />
                  <rect x="10" y="8" width="4" height="13" fill="#ffc800" />
                  <rect x="1" y="4" width="22" height="5" rx="1.5" fill="#a06b5b" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Using an ad blocker? matching Screenshot 2 & 3 */}
      <div className="w-full rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden flex flex-col shadow-none">
        {/* Banner with Gradient & Peeking Neon Super Duo */}
        <div className="w-full h-32 bg-gradient-to-b from-[#164e63] via-[#0e3b4a] to-[#131f24] flex items-center justify-center relative select-none">
          <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
            {/* Neon Green/Cyan Mask */}
            <path
              d="M20 30 C20 16 35 12 55 12 C75 12 90 16 90 30 C90 48 82 66 55 66 C28 66 20 48 20 30 Z"
              fill="url(#neonMask)"
            />
            {/* Glowing Big Eyes */}
            <circle cx="42" cy="38" r="14" fill="white" />
            <circle cx="68" cy="38" r="14" fill="white" />
            <circle cx="44" cy="38" r="7" fill="#0f172a" />
            <circle cx="66" cy="38" r="7" fill="#0f172a" />
            <circle cx="42" cy="35" r="2.5" fill="white" />
            <circle cx="68" cy="35" r="2.5" fill="white" />
            {/* Neon Nose/Beak */}
            <polygon points="51,46 59,46 55,54" fill="#00f5d4" />

            <defs>
              <linearGradient id="neonMask" x1="20" y1="12" x2="90" y2="66">
                <stop stopColor="#00f5d4" />
                <stop offset="0.5" stopColor="#10b981" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="p-5 pt-2 text-center flex flex-col items-center">
          <h3 className="font-black text-lg text-[var(--text-primary)] mb-2 leading-snug">
            Using an ad blocker?
          </h3>
          <p className="text-xs font-semibold text-[var(--text-secondary)] leading-relaxed mb-5">
            Support education with Super Duolingo and we&apos;ll remove ads for you
          </p>

          <div className="w-full flex flex-col gap-2.5">
            {/* TRY SUPER FOR FREE (White / Light 3D Button) */}
            <button
              type="button"
              className="w-full h-11 rounded-2xl bg-white hover:bg-[#e5e5e5] border-b-4 border-[#cbd5e1] active:border-b-0 active:translate-y-1 text-[#131f24] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              TRY SUPER FOR FREE
            </button>

            {/* DISABLE AD BLOCKER (Surface Pill Button) */}
            <button
              type="button"
              className="w-full h-11 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] border-b-4 border-[var(--border-color)] active:border-b-0 active:translate-y-1 text-[var(--text-primary)] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              DISABLE AD BLOCKER
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <footer className="pt-2 pb-6 text-center select-none">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
          <span className="hover:text-[var(--text-primary)] cursor-pointer">ABOUT</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">BLOG</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">STORE</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">EFFICACY</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">CAREERS</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mt-2">
          <span className="hover:text-[var(--text-primary)] cursor-pointer">INVESTORS</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">TERMS</span>
          <span>•</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer">PRIVACY</span>
        </div>
      </footer>
    </aside>
  );
};
