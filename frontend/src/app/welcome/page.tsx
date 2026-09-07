'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FlagIcon } from '../../components/ui/FlagIcon';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';

// =============================================================================
// AUTHENTIC DUOLINGO VECTOR ASSETS & SPLASH ILLUSTRATION
// =============================================================================

/** Duolingo Brand Header Logo (Green Mascot Face + duolingo Wordmark) */
const DuolingoBrandLogo = () => (
  <div className="flex items-center gap-2 select-none cursor-pointer group">
    {/* Duo Face Icon */}
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="shrink-0">
      <ellipse cx="20" cy="20" rx="18" ry="17" fill="#58cc02" />
      {/* Eye patches */}
      <circle cx="13" cy="18" r="6" fill="#ffffff" />
      <circle cx="27" cy="18" r="6" fill="#ffffff" />
      {/* Pupils */}
      <circle cx="14" cy="18" r="3.2" fill="#4b4b4b" />
      <circle cx="26" cy="18" r="3.2" fill="#4b4b4b" />
      <circle cx="15" cy="17" r="1.2" fill="#ffffff" />
      <circle cx="27" cy="17" r="1.2" fill="#ffffff" />
      {/* Orange Beak */}
      <polygon points="20,19 16,24 24,24" fill="#ff9600" />
    </svg>

    {/* duolingo text */}
    <span className="text-[28px] sm:text-[31px] font-black text-[#58cc02] tracking-[-0.04em] leading-none lowercase group-hover:brightness-105 transition-all">
      duolingo
    </span>
  </div>
);

/**
 * The Iconic 3D Duolingo Splash Art matching user's reference screenshot:
 * Flying Duo owl, tilted green smartphone with gold lesson nodes, and character cast
 * (Lily, Zari, Junior, Bea, Oscar, Lucy, Lin) leaping out in celebration.
 */
const DuolingoHeroSplash = () => (
  <div className="relative w-full max-w-[460px] mx-auto select-none pointer-events-none flex items-center justify-center">
    <svg
      viewBox="0 0 480 440"
      className="w-full h-auto drop-shadow-sm"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#61e002" />
          <stop offset="100%" stopColor="#46a302" />
        </linearGradient>
        <linearGradient id="phoneScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f8d6" />
          <stop offset="100%" stopColor="#cbf0a3" />
        </linearGradient>
        <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffdc00" />
          <stop offset="100%" stopColor="#ffaa00" />
        </linearGradient>
      </defs>

      {/* ===================================================================
          1. PERSPECTIVE PHONE WITH LESSON NODES ON SCREEN
          =================================================================== */}
      <g transform="translate(130, 210) rotate(-18)">
        {/* Phone 3D depth shadow */}
        <polygon points="12,170 120,205 130,195 22,160" fill="#2d6e00" opacity="0.4" />
        {/* Phone Case Bottom Rim */}
        <rect x="0" y="8" width="130" height="175" rx="24" fill="#388502" />
        {/* Phone Body */}
        <rect x="0" y="0" width="130" height="175" rx="24" fill="url(#phoneBodyGrad)" />

        {/* Screen */}
        <rect x="8" y="10" width="114" height="155" rx="16" fill="url(#phoneScreenGrad)" />

        {/* Lesson Path Nodes on screen */}
        {/* Node 1 (Bottom Right) */}
        <g transform="translate(85, 128)">
          <ellipse cx="0" cy="4" rx="18" ry="12" fill="#d48800" />
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="url(#goldCoinGrad)" />
          <ellipse cx="0" cy="-2" rx="14" ry="8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.8" />
        </g>

        {/* Node 2 (Center Left) */}
        <g transform="translate(42, 92)">
          <ellipse cx="0" cy="4" rx="18" ry="12" fill="#d48800" />
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="url(#goldCoinGrad)" />
          <ellipse cx="0" cy="-2" rx="14" ry="8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.8" />
        </g>

        {/* Node 3 (Top Center) */}
        <g transform="translate(70, 50)">
          <ellipse cx="0" cy="4" rx="18" ry="12" fill="#d48800" />
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="url(#goldCoinGrad)" />
          <ellipse cx="0" cy="-2" rx="14" ry="8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.8" />
        </g>
      </g>

      {/* ===================================================================
          2. DUO THE OWL (FLYING FORWARD WITH SPREAD WINGS)
          =================================================================== */}
      <g transform="translate(230, 160)">
        {/* Shadow */}
        <ellipse cx="50" cy="115" rx="42" ry="12" fill="#131f24" opacity="0.08" />

        {/* Duo Orange Feet */}
        <ellipse cx="38" cy="98" rx="8" ry="4.5" fill="#ff9600" />
        <ellipse cx="62" cy="98" rx="8" ry="4.5" fill="#ff9600" />

        {/* Left Wing (Back/Left) */}
        <path d="M12 45 Q-25 15 2 70 Q15 65 22 55 Z" fill="#46a302" />
        <path d="M16 48 Q-18 22 5 68 Z" fill="#58cc02" />

        {/* Right Wing (Front/Right) */}
        <path d="M88 45 Q125 15 98 70 Q85 65 78 55 Z" fill="#46a302" />
        <path d="M84 48 Q118 22 95 68 Z" fill="#58cc02" />

        {/* Duo Green Body */}
        <ellipse cx="50" cy="54" rx="46" ry="42" fill="#58cc02" />

        {/* Duo Belly highlight */}
        <ellipse cx="50" cy="65" rx="30" ry="24" fill="#6fe010" />

        {/* Big White Eyes */}
        <circle cx="36" cy="45" r="14" fill="#ffffff" />
        <circle cx="64" cy="45" r="14" fill="#ffffff" />

        {/* Pupils looking slightly towards viewer */}
        <circle cx="38" cy="45" r="7.5" fill="#3c3c3c" />
        <circle cx="62" cy="45" r="7.5" fill="#3c3c3c" />

        {/* Pupil Eye Highlights */}
        <circle cx="40" cy="42" r="2.8" fill="#ffffff" />
        <circle cx="64" cy="42" r="2.8" fill="#ffffff" />

        {/* Cheerful Open Orange Beak */}
        <path d="M44 52 Q50 62 56 52 Q50 49 44 52 Z" fill="#ff9600" />
        <path d="M46 54 Q50 62 54 54 Z" fill="#e07200" />
      </g>

      {/* ===================================================================
          3. LILY (PURPLE SLEEK HAIR, FOLDED ARMS ON PHONE)
          =================================================================== */}
      <g transform="translate(195, 225)">
        {/* Purple Sleek Hair */}
        <path d="M10 25 Q20 2 34 16 L38 52 L6 52 Z" fill="#8842d0" />
        {/* Face */}
        <circle cx="22" cy="28" r="12" fill="#f7d0b5" />
        {/* Cool droopy eyes */}
        <line x1="16" y1="27" x2="20" y2="27" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="27" x2="28" y2="27" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        {/* Folded Arms & Dark Sweater */}
        <rect x="8" y="38" width="28" height="26" rx="6" fill="#3b2d54" />
        <path d="M12 48 Q22 54 32 48" stroke="#8842d0" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ===================================================================
          4. OSCAR (BOTTOM, BROWN HAIR, MUSTACHE & PINK SHIRT)
          =================================================================== */}
      <g transform="translate(180, 275)">
        {/* Head */}
        <circle cx="22" cy="22" r="16" fill="#e0a98b" />
        {/* Brown Curly Hair */}
        <path d="M6 16 Q22 4 38 16 Q36 8 22 8 Q10 8 6 16 Z" fill="#3c2f2f" />
        {/* Eyes looking up happily */}
        <circle cx="16" cy="18" r="2.2" fill="#131f24" />
        <circle cx="28" cy="18" r="2.2" fill="#131f24" />
        {/* Distinctive Mustache */}
        <path d="M14 26 Q22 22 30 26 Q22 31 14 26 Z" fill="#3c2f2f" />
        {/* Pink Outfit */}
        <path d="M4 36 Q22 30 40 36 L44 70 L0 70 Z" fill="#f472b6" />
      </g>

      {/* ===================================================================
          5. BEA (LEFT, AFRO BUNS, JOYFUL LEAP IN BLUE TOP)
          =================================================================== */}
      <g transform="translate(140, 230) rotate(-15)">
        {/* Dark Afro Puffs */}
        <circle cx="8" cy="14" r="8" fill="#2d1d13" />
        <circle cx="34" cy="14" r="8" fill="#2d1d13" />
        {/* Face */}
        <circle cx="21" cy="20" r="13" fill="#8c5835" />
        {/* Yellow Headband */}
        <path d="M10 16 Q21 11 32 16" stroke="#ffc800" strokeWidth="3.5" fill="none" />
        {/* Eyes & Smile */}
        <circle cx="16" cy="20" r="1.8" fill="#131f24" />
        <circle cx="26" cy="20" r="1.8" fill="#131f24" />
        <path d="M17 25 Q21 28 25 25" stroke="#131f24" strokeWidth="1.5" fill="none" />
        {/* Blue Jumpsuit */}
        <rect x="10" y="32" width="22" height="26" rx="8" fill="#1cb0f6" />
        {/* Yellow sneakers */}
        <ellipse cx="14" cy="62" rx="5" ry="3" fill="#ff4b4b" />
        <ellipse cx="28" cy="62" rx="5" ry="3" fill="#ff4b4b" />
      </g>

      {/* ===================================================================
          6. JUNIOR (TOP LEFT, TUMBLING HEAD-FIRST WITH LEGS UP)
          =================================================================== */}
      <g transform="translate(135, 125) rotate(140)">
        {/* Head */}
        <circle cx="18" cy="18" r="14" fill="#f7c8a0" />
        {/* Orange Cap */}
        <path d="M4 14 Q18 4 32 14" fill="#ff4b4b" />
        <path d="M28 14 L36 12 L34 16 Z" fill="#ff4b4b" />
        {/* Big excited eyes & open mouth */}
        <circle cx="13" cy="17" r="2.2" fill="#131f24" />
        <circle cx="23" cy="17" r="2.2" fill="#131f24" />
        <path d="M14 22 Q18 28 22 22 Z" fill="#131f24" />
        {/* Blue Shirt */}
        <rect x="6" y="30" width="24" height="24" rx="6" fill="#1cb0f6" />
        {/* Legs kicking */}
        <line x1="12" y1="52" x2="6" y2="68" stroke="#1cb0f6" strokeWidth="6" strokeLinecap="round" />
        <line x1="24" y1="52" x2="30" y2="68" stroke="#1cb0f6" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* ===================================================================
          7. ZARI (TOP-CENTER, PINK HOODIE/JUMPSUIT, ARMS SPREAD WIDE)
          =================================================================== */}
      <g transform="translate(170, 115) rotate(20)">
        {/* Pink/Magenta Hijab/Jumpsuit */}
        <path d="M6 18 C6 2 34 2 34 18 C34 32 32 40 28 44 L12 44 C8 40 6 32 6 18 Z" fill="#f472b6" />
        {/* Face */}
        <ellipse cx="20" cy="22" rx="10" ry="11" fill="#c48a5c" />
        {/* Cheerful Smile */}
        <circle cx="16" cy="20" r="1.8" fill="#131f24" />
        <circle cx="24" cy="20" r="1.8" fill="#131f24" />
        <path d="M16 26 Q20 31 24 26 Z" fill="#ffffff" stroke="#131f24" strokeWidth="1" />
        {/* Body */}
        <rect x="8" y="40" width="24" height="26" rx="8" fill="#f472b6" />
        {/* Arms wide open */}
        <line x1="8" y1="44" x2="-6" y2="36" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" />
        <line x1="32" y1="44" x2="46" y2="36" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* ===================================================================
          8. LUCY (TOP-RIGHT, WHITE BUN, YELLOW OUTFIT)
          =================================================================== */}
      <g transform="translate(225, 105) rotate(-25)">
        {/* Gray Hair Bun */}
        <circle cx="20" cy="10" r="12" fill="#cbd5e1" />
        <circle cx="20" cy="22" r="12" fill="#f7d0b5" />
        {/* Glasses */}
        <circle cx="16" cy="22" r="4" stroke="#4b4b4b" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="22" r="4" stroke="#4b4b4b" strokeWidth="1.5" fill="none" />
        {/* Yellow coat */}
        <path d="M6 34 Q20 28 34 34 L36 68 L4 68 Z" fill="#ff9600" />
        {/* Blue megaphone / horn */}
        <polygon points="36,36 48,30 48,46 36,40" fill="#1cb0f6" />
      </g>
    </svg>
  </div>
);

// =============================================================================
// LANGUAGE CAROUSEL DATA MATCHING SCREENSHOT BOTTOM TICKER
// =============================================================================

const BOTTOM_LANGUAGES = [
  { code: 'en', label: 'ENGLISH', courseId: 8 },
  { code: 'chess', label: 'CHESS', courseId: null },
  { code: 'math', label: 'MATH', courseId: null },
  { code: 'es', label: 'SPANISH', courseId: 1 },
  { code: 'fr', label: 'FRENCH', courseId: 2 },
  { code: 'de', label: 'GERMAN', courseId: 3 },
  { code: 'it', label: 'ITALIAN', courseId: 4 },
  { code: 'pt', label: 'PORTUGUESE', courseId: 5 },
];

const SITE_LANGUAGES = [
  'English',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
  'Português',
  '中文',
  '日本語',
];

// =============================================================================
// LANDING PAGE MAIN COMPONENT
// =============================================================================

export default function WelcomeLandingPage() {
  const router = useRouter();
  const { refreshUser } = useGame();
  const carouselRef = useRef<HTMLDivElement>(null);

  // States
  const [siteLangOpen, setSiteLangOpen] = useState(false);
  const [selectedSiteLang, setSelectedSiteLang] = useState('English');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Scroll ticker left / right
  const scrollTicker = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      await api.login({ username, password });
      await refreshUser();
      setLoginModalOpen(false);
      router.push('/');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoggingIn(true);
    setLoginError(null);
    try {
      await api.login({ username: 'Alex', password: 'password123' });
      await refreshUser();
      setLoginModalOpen(false);
      router.push('/');
    } catch (err: any) {
      setLoginError(err.message || 'Failed to sign in as demo learner Alex');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSelectCourse = (courseId: number | null) => {
    if (courseId) {
      router.push(`/onboarding?course=${courseId}`);
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#4b4b4b] antialiased select-none font-sans justify-between">
      {/* =====================================================================
          1. TOP HEADER (Duolingo Logo & Site Language Dropdown)
          ===================================================================== */}
      <header className="w-full bg-white relative z-40">
        <div className="w-full max-w-[1040px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Duolingo Brand Logo */}
          <Link href="/welcome" className="no-underline flex items-center">
            <DuolingoBrandLogo />
          </Link>

          {/* Site Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSiteLangOpen(!siteLangOpen)}
              className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-black uppercase text-[#afafaf] hover:text-[#777777] tracking-wider transition-colors cursor-pointer"
            >
              <span>SITE LANGUAGE: {selectedSiteLang}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${siteLangOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Language Menu Popover */}
            {siteLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSiteLangOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border-2 border-[#e5e5e5] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  {SITE_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedSiteLang(lang);
                        setSiteLangOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-black transition-colors flex items-center justify-between cursor-pointer ${
                        selectedSiteLang === lang
                          ? 'text-[#1cb0f6] bg-[#f0f9ff]'
                          : 'text-[#4b4b4b] hover:bg-[#f7f7f7]'
                      }`}
                    >
                      <span>{lang}</span>
                      {selectedSiteLang === lang && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. CENTER HERO SECTION (Character Splash + Headline & 3D Buttons)
          ===================================================================== */}
      <main className="flex-1 flex items-center justify-center w-full max-w-[1040px] mx-auto px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full my-auto">
          {/* Left Column: Authentic 3D Duolingo Character Splash Illustration */}
          <div className="flex items-center justify-center w-full">
            <DuolingoHeroSplash />
          </div>

          {/* Right Column: Pitch Headline & Call to Action Buttons */}
          <div className="flex flex-col items-center text-center w-full max-w-[380px] mx-auto md:mx-0 md:items-center">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-[33px] md:text-[35px] font-black text-[#4b4b4b] text-center leading-[1.22] tracking-tight mb-8">
              The most fun way to learn
              <br />
              languages, chess, and more!
            </h1>

            {/* Action Buttons Stack */}
            <div className="w-full max-w-[340px] flex flex-col gap-3.5">
              {/* GET STARTED BUTTON (Green 3D) */}
              <Link href="/onboarding" className="w-full no-underline">
                <button
                  type="button"
                  className="w-full h-[50px] rounded-2xl bg-[#58cc02] hover:bg-[#61e002] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center"
                >
                  GET STARTED
                </button>
              </Link>

              {/* I ALREADY HAVE AN ACCOUNT BUTTON (White 3D with Blue Text) */}
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="w-full h-[50px] rounded-2xl bg-white hover:bg-[#f7f7f7] border-2 border-[#e5e5e5] border-b-4 border-b-[#e5e5e5] active:border-b-2 active:translate-y-0.5 text-[#1cb0f6] font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-2xs flex items-center justify-center"
              >
                I ALREADY HAVE AN ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================================
          3. BOTTOM LANGUAGE CAROUSEL / TICKER (Exact Match to Screenshot)
          ===================================================================== */}
      <footer className="w-full border-t border-[#e5e5e5] bg-white py-4 select-none">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTicker('left')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#afafaf] hover:text-[#4b4b4b] hover:bg-[#f7f7f7] transition-colors cursor-pointer shrink-0"
            aria-label="Scroll left"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Languages Horizontal Strip */}
          <div
            ref={carouselRef}
            className="flex-1 flex items-center justify-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          >
            {BOTTOM_LANGUAGES.map((lang) => (
              <button
                key={lang.label}
                type="button"
                onClick={() => handleSelectCourse(lang.courseId)}
                className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
              >
                <div className="group-hover:scale-105 transition-transform">
                  <FlagIcon code={lang.code} width={32} height={23} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#777777] group-hover:text-[#4b4b4b] transition-colors whitespace-nowrap">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTicker('right')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#afafaf] hover:text-[#4b4b4b] hover:bg-[#f7f7f7] transition-colors cursor-pointer shrink-0"
            aria-label="Scroll right"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </footer>

      {/* =====================================================================
          LOGIN MODAL
          ===================================================================== */}
      <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} title="Log in">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 py-2">
          {loginError && (
            <div className="p-3 rounded-xl bg-[var(--duo-red-light)] border border-[var(--duo-red-border)] text-[var(--duo-red-dark)] text-sm font-bold">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-[#777777] mb-1">
              Username or email
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              className="w-full px-4 h-12 rounded-xl border-2 border-[#e5e5e5] bg-white font-bold text-[#4b4b4b] focus:border-[#1cb0f6] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#777777] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 h-12 rounded-xl border-2 border-[#e5e5e5] bg-white font-bold text-[#4b4b4b] focus:border-[#1cb0f6] outline-hidden"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button variant="primary" fullWidth disabled={loggingIn} type="submit">
              {loggingIn ? 'LOGGING IN...' : 'LOG IN'}
            </Button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loggingIn}
              className="btn-3d btn-blue w-full h-12 text-xs font-black uppercase tracking-wider"
            >
              🚀 Fast-Track As Demo Learner (Alex)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
