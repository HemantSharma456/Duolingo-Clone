'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { useTheme } from '../../context/ThemeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FlagIcon } from '../ui/FlagIcon';
import { api } from '../../services/api';
import { CourseItem } from '../../types';

// Authentic Duolingo Header SVGs with crisp white outlines matching Image 4
const FlameIcon = () => (
  <svg width="26" height="28" viewBox="0 0 28 30" fill="none" className="shrink-0 select-none">
    {/* White outline path */}
    <path
      d="M14 2C14 2 6 9.5 6 16.5C6 21.5 10 26 15 26.5C12.2 23.8 12.2 20.5 14 18C16 15.5 18.5 14.5 19 11.5C21.5 14.5 22.5 17.5 21.5 20C23.5 17.5 23.5 14.5 22.5 12.5C21.5 10 23 7 23 7C23 7 19 8.5 17 11.5C17 8 14 2 14 2Z"
      fill="#ff9600"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Inner Yellow Flame */}
    <path
      d="M14.5 14C13 16 12.5 18 13.5 20.5C14 19 15 18 16 17.5C17 17 17.5 15 17.5 15C16.5 16.5 15 17.5 14.5 18.5C14.2 17 14.5 15.5 14.5 14Z"
      fill="#ffc800"
    />
  </svg>
);

const GemIcon = () => (
  <svg width="26" height="26" viewBox="0 0 30 30" fill="none" className="shrink-0 select-none">
    {/* Outer faceted polygon with white outline */}
    <path
      d="M9 5H21L27 12.5L15 26.5L3 12.5L9 5Z"
      fill="#1cb0f6"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Top facet lighter shade */}
    <path
      d="M9 5H21L18 11.5H12L9 5Z"
      fill="#64d1f8"
      fillOpacity="0.55"
    />
    {/* Left facet highlight */}
    <path
      d="M9 5L3 12.5L12 11.5L9 5Z"
      fill="#64d1f8"
      fillOpacity="0.3"
    />
    {/* Crisp white gleam highlight pill */}
    <ellipse cx="13" cy="7.5" rx="2.5" ry="1.2" fill="#ffffff" />
  </svg>
);

const HeartIcon = () => (
  <svg width="26" height="25" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
    {/* Main heart with white outline */}
    <path
      d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
      fill="#ff4b4b"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {/* Top-left gleam highlight */}
    <ellipse
      cx="9.5"
      cy="8"
      rx="3"
      ry="1.6"
      fill="#ffffff"
      fillOpacity="0.85"
      transform="rotate(-35 9.5 8)"
    />
  </svg>
);

// Friend Streaks Illustration: Lily with purple hair holding Duo with flame
const FriendStreakIllustration = () => (
  <div className="relative w-24 h-20 shrink-0 select-none pointer-events-none">
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Background yellow flame */}
      <path
        d="M25 8C25 8 12 22 12 36C12 48 20 56 30 57C24 51 24 45 28 40C32 35 37 33 38 27C43 33 45 40 43 45C47 40 47 33 45 29C43 24 46 18 46 18C46 18 38 21 34 27C34 20 25 8 25 8Z"
        fill="#ffc800"
        stroke="#ffffff"
        strokeWidth="2"
      />
      {/* Duo owl head on left */}
      <circle cx="28" cy="54" r="16" fill="#58cc02" />
      <circle cx="23" cy="50" r="5" fill="#ffffff" />
      <circle cx="33" cy="50" r="5" fill="#ffffff" />
      <circle cx="23" cy="50" r="2.5" fill="#3c3c3c" />
      <circle cx="33" cy="50" r="2.5" fill="#3c3c3c" />
      <polygon points="26,54 30,54 28,58" fill="#ff9600" />
      {/* Purple-haired character (Lily) on right */}
      <circle cx="68" cy="40" r="14" fill="#ffd1b3" />
      {/* Purple Bob Hair */}
      <path
        d="M52 38C52 24 64 20 74 20C86 20 86 32 86 44C86 48 82 56 82 56L78 44C78 44 68 46 64 42L56 56C56 56 52 48 52 38Z"
        fill="#a855f7"
      />
      {/* Closed happy eye */}
      <path d="M62 40C62 40 65 42 68 40" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" />
      {/* Jacket */}
      <path d="M54 58C54 52 64 50 74 50C84 50 90 52 90 58L88 74H56L54 58Z" fill="#4c1d95" />
    </svg>
  </div>
);

// Golden treasure chest overflowing with cyan gems matching the user reference screenshot
const GemChestIllustration = () => (
  <div className="w-[92px] h-[84px] shrink-0 select-none pointer-events-none flex items-center justify-center">
    <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
      {/* Open Lid in background */}
      {/* Top Handle / Latch */}
      <rect x="44" y="6" width="12" height="6" rx="2" fill="#ffc800" stroke="#e5a800" strokeWidth="1" />

      {/* Lid Body: warm brown wood */}
      <rect x="16" y="10" width="68" height="26" rx="5" fill="#8d4313" stroke="#ffc800" strokeWidth="3" />
      {/* Lid Interior Shadow (dark cavity inside open lid) */}
      <rect x="20" y="14" width="60" height="20" rx="3" fill="#4e2007" />
      {/* Inner Lid Rim Highlight */}
      <line x1="20" y1="14" x2="80" y2="14" stroke="#ffc800" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Overflowing Cyan Gems */}
      {/* Deep back gems */}
      <polygon points="26,24 38,17 48,25 38,36 24,32" fill="#0288d1" />
      <polygon points="26,24 38,17 35,26 26,24" fill="#29b6f6" />

      <polygon points="54,22 66,16 76,25 66,36 52,31" fill="#0277bd" />
      <polygon points="54,22 66,16 63,24 54,22" fill="#29b6f6" />

      {/* Mid layer gems */}
      <polygon points="36,18 52,14 62,22 52,34 36,28" fill="#0099e6" />
      <polygon points="36,18 52,14 46,24 36,20" fill="#80d8ff" />
      {/* Center glint */}
      <circle cx="44" cy="18" r="1.5" fill="#ffffff" />

      {/* Big front gems tumbling over rim */}
      {/* Left overflowing gem */}
      <polygon points="18,32 32,26 42,36 30,48 16,42" fill="#1cb0f6" />
      <polygon points="18,32 32,26 28,35 18,32" fill="#80d8ff" />
      <polygon points="32,26 42,36 36,44 28,35" fill="#e0f7fa" fillOpacity="0.9" />
      <circle cx="26" cy="30" r="1.8" fill="#ffffff" />

      {/* Right overflowing gem */}
      <polygon points="50,29 66,24 78,35 66,48 46,42" fill="#0288d1" />
      <polygon points="50,29 66,24 60,35 50,29" fill="#29b6f6" />
      <polygon points="66,24 78,35 70,44 60,35" fill="#80d8ff" />
      <circle cx="58" cy="30" r="1.8" fill="#ffffff" />

      {/* Center prominent front gem */}
      <polygon points="32,32 50,28 60,38 48,52 30,44" fill="#00b0ff" />
      <polygon points="32,32 50,28 44,38 32,32" fill="#b3e5fc" />
      <polygon points="50,28 60,38 52,48 44,38" fill="#ffffff" fillOpacity="0.9" />
      {/* Gleam star / dot */}
      <circle cx="42" cy="33" r="2" fill="#ffffff" />

      {/* Lower tumbled gem */}
      <polygon points="40,42 54,38 62,46 50,54 38,48" fill="#1cb0f6" />
      <polygon points="40,42 54,38 48,46 40,42" fill="#e1f5fe" />

      {/* Chest Base Body */}
      {/* Wooden Chest Box */}
      <rect x="14" y="42" width="72" height="40" rx="4" fill="#8d4313" stroke="#ffc800" strokeWidth="3" />
      {/* Horizontal wood plank divide line */}
      <line x1="16" y1="60" x2="84" y2="60" stroke="#4e2007" strokeWidth="2.5" />

      {/* Left Golden Corner Brackets */}
      <path
        d="M13 41 H22 V49 H17 V55 H22 V63 H17 V69 H22 V83 H13 Z"
        fill="#ffc800"
      />
      {/* Right Golden Corner Brackets */}
      <path
        d="M87 41 H78 V49 H83 V55 H78 V63 H83 V69 H78 V83 H87 Z"
        fill="#ffc800"
      />

      {/* Bottom Golden Bar */}
      <rect x="13" y="76" width="74" height="7" rx="2" fill="#ffc800" />
      <line x1="15" y1="78" x2="85" y2="78" stroke="#ffe082" strokeWidth="1" />

      {/* Golden Center Lock Plaque */}
      <rect x="41" y="40" width="18" height="23" rx="3.5" fill="#ffc800" stroke="#e5a800" strokeWidth="1.5" />
      {/* Keyhole */}
      <circle cx="50" cy="48" r="2.8" fill="#4e2007" />
      <polygon points="48,48 52,48 53.5,56 46.5,56" fill="#4e2007" />
    </svg>
  </div>
);

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshUser, isSuper, activateSuper, updateUserGems, updateUserHearts } = useGame();
  const { soundEnabled, toggleSound } = useSound();
  const { theme, toggleTheme } = useTheme();

  type PopoverKey = 'flag' | 'streak' | 'gems' | 'hearts' | null;

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [activePopover, setActivePopover] = useState<PopoverKey>(null);
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [refilling, setRefilling] = useState(false);
  const [refillMsg, setRefillMsg] = useState<string | null>(null);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openPopover = (key: PopoverKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActivePopover(key);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 120);
  };

  const togglePopover = (key: PopoverKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActivePopover((prev) => (prev === key ? null : key));
  };

  // Fetch available courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const list = await api.getCourses();
        setCourses(list);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);


  // Determine active course
  const activeCourse =
    courses.find((c) => c.id === user?.current_course_id) ||
    courses.find((c) => c.language_code === 'ja') ||
    courses[0] || {
      id: 6,
      title: 'Japanese',
      flag_emoji: '🇯🇵',
      language_code: 'ja',
      learner_count: '18.1M learners',
    };

  const handleSelectCourse = async (courseId: number) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('duo_active_course_id', courseId.toString());
      }
      await api.selectCourse(courseId);
      setActivePopover(null);
      await refreshUser();
      if (pathname === '/') {
        window.location.reload();
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Failed to select course:', err);
    }
  };

  const handleRefillGems = async () => {
    const currentGems = user?.gems ?? 505;
    const currentHearts = user?.hearts ?? 3;
    if (currentHearts >= 5) {
      setRefillMsg('Your hearts are already full! (5/5 ❤️)');
      return;
    }
    if (currentGems < 350) {
      setRefillMsg(`Need 350 gems to refill hearts! (Balance: ${currentGems} 💎)`);
      return;
    }
    setRefilling(true);
    setRefillMsg(null);
    try {
      updateUserGems(-350);
      updateUserHearts(5);
      setRefillMsg('Full hearts restored! ❤️❤️❤️❤️❤️ (-350 💎)');
      try {
        await api.refillHearts('gems');
        await refreshUser();
      } catch {
        // persistent local state handles offline/deployed gracefully
      }
    } catch (err: any) {
      setRefillMsg(err.message || 'Failed to refill with gems');
    } finally {
      setRefilling(false);
    }
  };

  // Days of the week for streak widget: S M T W T F S
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  return (
    <>
      <header className="duo-topbar">
        <div className="duo-topbar-inner">
          {/* Stats Group matching Image 4: [ 🇯🇵 ]  🔥 1  💎 505  ❤️ 3 */}
          <div
            ref={navContainerRef}
            onMouseLeave={scheduleClose}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 sm:gap-8 font-black text-sm select-none"
          >
            {/* Flag Badge Button with Hover Popover matching user screenshot */}
            <div
              className="relative"
              onMouseEnter={() => openPopover('flag')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => togglePopover('flag')}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl cursor-pointer transition-all select-none relative ${
                  activePopover === 'flag' ? 'bg-[#202f36]' : 'hover:bg-[#202f36]/60'
                }`}
                title="Switch Language Course"
              >
                <div className="w-[36px] h-[26px] rounded-lg overflow-hidden border-2 border-white shadow-xs flex items-center justify-center shrink-0">
                  <FlagIcon code={activeCourse.language_code} width={36} height={26} />
                </div>
                <span className="text-[var(--text-primary)] font-black text-base leading-none">
                  1
                </span>
              </button>

              {/* Course Hover / Click Popover Menu */}
              {activePopover === 'flag' && (
                <>
                  {/* Upward Caret pointing directly to the center of the flag button */}
                  <div className="absolute top-[calc(100%+3px)] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[var(--bg-surface)] border-t-2 border-l-2 border-[var(--border-color)] z-50 pointer-events-none" />

                  {/* Popover Card */}
                  <div
                    className="absolute top-[calc(100%+8px)] left-0 sm:left-[-30px] w-[260px] max-w-[calc(100vw-24px)] rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl z-40 overflow-hidden select-none duo-popover-animate"
                    onMouseEnter={() => openPopover('flag')}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="px-4.5 pt-3.5 pb-2 text-[12px] font-black uppercase text-[var(--text-muted)] tracking-wider">
                      MY COURSES
                    </div>

                    {/* Divider Line */}
                    <div className="border-t border-[var(--border-color)]" />

                    {/* Active / Enrolled Course */}
                    <button
                      type="button"
                      onClick={() => setActivePopover(null)}
                      className="w-full flex items-center gap-3.5 px-4.5 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-left transition-colors cursor-pointer"
                    >
                      <div className="w-[36px] h-[26px] rounded-lg overflow-hidden border-2 border-white shadow-xs flex items-center justify-center shrink-0">
                        <FlagIcon code={activeCourse.language_code} width={36} height={26} />
                      </div>
                      <span className="font-black text-[15px] text-[#1cb0f6] leading-none">
                        {activeCourse.title}
                      </span>
                    </button>

                    {/* Divider Line */}
                    <div className="border-t border-[var(--border-color)]" />

                    {/* + Add a new course Button */}
                    <Link
                      href="/courses"
                      onClick={() => setActivePopover(null)}
                      className="w-full flex items-center gap-3.5 px-4.5 py-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] no-underline transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg border-2 border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--text-secondary)] transition-colors shrink-0">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <span className="font-black text-[14px] text-[var(--text-primary)] leading-none">
                        Add a new course
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Streak: 🔥 1 with Hover / Click Popover */}
            <div
              className="relative"
              onMouseEnter={() => openPopover('streak')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => togglePopover('streak')}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl cursor-pointer transition-all select-none relative ${
                  activePopover === 'streak' ? 'bg-[#202f36]' : 'hover:bg-[#202f36]/60'
                }`}
                title="Current streak"
              >
                <FlameIcon />
                <span className="text-[#ff9600] font-black text-base leading-none">
                  {user?.streak ?? 1}
                </span>
              </button>

              {/* Streak Hover / Click Popover Modal */}
              {activePopover === 'streak' && (
                <>
                  {/* Upward Caret pointing directly to the center of the streak button */}
                  <div className="absolute top-[calc(100%+3px)] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#b86200] border-t-2 border-l-2 border-[#37464f] z-50 pointer-events-none" />

                  <div
                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 w-[350px] sm:w-[370px] max-w-[calc(100vw-24px)] rounded-3xl border-2 border-[#37464f] bg-[#131f24] shadow-2xl z-40 overflow-hidden duo-popover-animate select-none"
                    onMouseEnter={() => openPopover('streak')}
                    onMouseLeave={scheduleClose}
                  >
                    {/* Top Golden / Amber Card */}
                    <div className="bg-[#b86200] p-5 pb-4 text-white relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-black text-2xl text-white tracking-tight leading-none">
                            {user?.streak ?? 1} day streak
                          </h3>
                          <p className="text-[13.5px] font-bold text-white/90 mt-2 leading-snug">
                            You’ve earned your longest streak ever!
                          </p>
                        </div>

                        {/* Large Flame Badge */}
                        <div className="w-14 h-16 shrink-0 flex items-center justify-center">
                          <svg width="54" height="60" viewBox="0 0 28 30" fill="none">
                            <path
                              d="M14 2C14 2 6 9.5 6 16.5C6 21.5 10 26 15 26.5C12.2 23.8 12.2 20.5 14 18C16 15.5 18.5 14.5 19 11.5C21.5 14.5 22.5 17.5 21.5 20C23.5 17.5 23.5 14.5 22.5 12.5C21.5 10 23 7 23 7C23 7 19 8.5 17 11.5C17 8 14 2 14 2Z"
                              fill="#ff9600"
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                            <path
                              d="M14.5 14C13 16 12.5 18 13.5 20.5C14 19 15 18 16 17.5C17 17 17.5 15 17.5 15C16.5 16.5 15 17.5 14.5 18.5C14.2 17 14.5 15.5 14.5 14Z"
                              fill="#ffc800"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Weekly Days Tracker Row */}
                      <div className="bg-[#131f24]/85 backdrop-blur-xs rounded-2xl p-3 mt-4 flex items-center justify-between">
                        {daysOfWeek.map((day, idx) => {
                          const isDayActive = idx === (todayDayIndex === 0 ? 0 : 1); // Mark active day
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5">
                              <span
                                className={`text-[11px] font-black uppercase ${
                                  isDayActive ? 'text-[#ff9600]' : 'text-[#6f8490]'
                                }`}
                              >
                                {day}
                              </span>
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                  isDayActive
                                    ? 'bg-[#ff9600] text-[#131f24] shadow-xs'
                                    : 'bg-[#24333b] text-transparent'
                                }`}
                              >
                                {isDayActive ? '✓' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Middle Cards Section */}
                    <div className="p-4 flex flex-col gap-3 bg-[var(--bg-surface)]">
                      {/* Friend Streaks Card */}
                      <div className="rounded-2xl p-4 bg-gradient-to-r from-[#ff5e00] to-[#ff7a00] text-white flex items-center justify-between gap-3 relative overflow-hidden shadow-xs">
                        <div className="flex-1">
                          <h4 className="font-black text-base text-white leading-tight">
                            Friend Streaks
                          </h4>
                          <p className="text-xs font-bold text-white/90 mt-1">
                            0 active Friend Streaks
                          </p>
                          <button
                            type="button"
                            className="w-full py-2 px-4 rounded-xl bg-white hover:bg-white/90 text-[#ff5e00] font-black text-xs uppercase tracking-wider mt-3 transition-colors cursor-pointer shadow-xs text-center block"
                          >
                            VIEW LIST
                          </button>
                        </div>

                        <FriendStreakIllustration />
                      </div>

                      {/* Streak Society Card */}
                      <div className="rounded-2xl p-4 bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[var(--border-color)] flex items-center justify-center text-xl text-[var(--text-muted)] shrink-0 select-none">
                          🔒
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[15px] text-[var(--text-primary)] leading-tight">
                            Streak Society
                          </h4>
                          <p className="text-xs font-medium text-[var(--text-secondary)] mt-1 leading-relaxed">
                            Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Button: VIEW MORE */}
                      <button
                        type="button"
                        className="w-full h-11 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1479ab] active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md mt-1"
                      >
                        VIEW MORE
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Gems: 💎 505 with Hover / Click Popover matching user reference screenshot */}
            <div
              className="relative"
              onMouseEnter={() => openPopover('gems')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => togglePopover('gems')}
                className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl cursor-pointer transition-all select-none relative ${
                  activePopover === 'gems' ? 'bg-[#202f36]' : 'hover:bg-[#202f36]/60'
                }`}
                title="Gems"
              >
                <GemIcon />
                <span className="text-[#1cb0f6] font-black text-base leading-none">
                  {user?.gems ?? 505}
                </span>
              </button>

              {/* Gems Hover / Click Popover Modal matching Screenshot */}
              {activePopover === 'gems' && (
                <>
                  {/* Upward Caret pointing directly to the center of the gems button */}
                  <div className="absolute top-[calc(100%+3px)] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[var(--bg-surface)] border-t-2 border-l-2 border-[var(--border-color)] z-50 pointer-events-none" />

                  {/* Popover Card */}
                  <div
                    className="absolute top-[calc(100%+8px)] right-[-50px] sm:right-[-40px] w-[340px] sm:w-[350px] max-w-[calc(100vw-24px)] rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl z-40 p-5 select-none duo-popover-animate"
                    onMouseEnter={() => openPopover('gems')}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="flex items-center gap-5">
                      {/* Left: Golden Treasure Chest with Cyan Gems */}
                      <GemChestIllustration />

                      {/* Right: Text and Link */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[22px] text-[var(--text-primary)] tracking-tight leading-none mb-2">
                          Gems
                        </h3>
                        <p className="text-[15px] font-bold text-[var(--text-secondary)] leading-snug mb-3.5">
                          You have {user?.gems ?? 505} gems
                        </p>
                        <Link
                          href="/shop"
                          onClick={() => setActivePopover(null)}
                          className="text-[#1cb0f6] hover:text-[#38c3ff] font-black text-[13px] uppercase tracking-wider no-underline transition-colors block cursor-pointer"
                        >
                          GO TO SHOP
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Hearts: ❤️ 3 with Hover / Click Popover matching user reference screenshot */}
            <div
              className="relative"
              onMouseEnter={() => openPopover('hearts')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => togglePopover('hearts')}
                className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl cursor-pointer transition-all select-none relative ${
                  activePopover === 'hearts' ? 'bg-[#202f36]' : 'hover:bg-[#202f36]/60'
                }`}
                title={isSuper ? 'Unlimited Hearts (Super Duolingo)' : 'Hearts'}
              >
                {isSuper ? (
                  <svg width="26" height="25" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                    <defs>
                      <linearGradient id="topbarSuperPillGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00cd9c" />
                        <stop offset="45%" stopColor="#1cb0f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                      fill="url(#topbarSuperPillGrad)"
                      stroke="#ffffff"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                    <text
                      x="15"
                      y="15"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="900"
                      dominantBaseline="central"
                    >
                      ∞
                    </text>
                  </svg>
                ) : (
                  <span className={user && user.hearts <= 1 ? 'animate-pulse' : ''}>
                    <HeartIcon />
                  </span>
                )}
                <span className="text-[#ff4b4b] font-black text-base leading-none">
                  {isSuper ? '∞' : (user?.hearts ?? 3)}
                </span>
              </button>

              {/* Hearts Hover / Click Popover Modal */}
              {activePopover === 'hearts' && (
                <>
                  {/* Upward Caret pointing directly to the center of the hearts button */}
                  <div className="absolute top-[calc(100%+3px)] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[var(--bg-surface)] border-t-2 border-l-2 border-[var(--border-color)] z-50 pointer-events-none" />

                  {/* Popover Card */}
                  <div
                    className="absolute top-[calc(100%+8px)] right-0 w-[340px] sm:w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl z-40 p-5 select-none duo-popover-animate"
                    onMouseEnter={() => openPopover('hearts')}
                    onMouseLeave={scheduleClose}
                  >
                    {isSuper ? (
                      <div className="text-center py-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
                          <span>✨</span> SUPER DUOLINGO
                        </div>
                        <h3 className="font-black text-[22px] text-[var(--text-primary)] tracking-tight leading-none mb-2">
                          Unlimited Hearts Active
                        </h3>
                        <p className="font-bold text-[14px] text-[var(--text-secondary)] leading-snug mb-5">
                          You never run out of hearts while learning with Super Duolingo! Keep practicing without interruptions.
                        </p>
                        <Link
                          href="/shop"
                          onClick={() => setActivePopover(null)}
                          className="w-full py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1479ab] active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md block no-underline text-center"
                        >
                          GO TO SHOP
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Header Title: Hearts */}
                        <h3 className="text-center font-black text-[22px] text-[var(--text-primary)] tracking-tight leading-none mb-4">
                          Hearts
                        </h3>

                    {/* 5 Hearts Row */}
                    <div className="flex items-center justify-center gap-3.5 mb-4">
                      {[0, 1, 2, 3, 4].map((index) => {
                        const currentHearts = user?.hearts ?? 3;
                        if (index < currentHearts) {
                          // Solid Red Heart
                          return (
                            <svg key={index} width="28" height="26" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                              <path
                                d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                                fill="#ff4b4b"
                              />
                            </svg>
                          );
                        } else if (index === currentHearts) {
                          // Recharging Heart (soft glowing pink with crisp white outline matching screenshot)
                          return (
                            <svg key={index} width="28" height="26" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                              <path
                                d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                                fill="#ffebee"
                                fillOpacity="0.85"
                                stroke="#ffffff"
                                strokeWidth="2.4"
                                strokeLinejoin="round"
                              />
                            </svg>
                          );
                        } else {
                          // Empty / Depleted Heart (soft gray matching screenshot)
                          return (
                            <svg key={index} width="28" height="26" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                              <path
                                d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                                fill="#d1d5db"
                                fillOpacity="0.85"
                              />
                            </svg>
                          );
                        }
                      })}
                    </div>

                    {/* Next heart in 4 hours */}
                    <p className="text-center font-bold text-[15px] text-[var(--text-primary)] leading-none mb-2">
                      Next heart in <span className="text-[#ff4b4b]">4 hours</span>
                    </p>

                    {/* Subtitle */}
                    <p className="text-center font-bold text-[14px] text-[var(--text-secondary)] leading-snug mb-5">
                      You still have hearts left! Keep on learning
                    </p>

                    {refillMsg && (
                      <div className="mb-3 p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold text-center text-[#1cb0f6]">
                        {refillMsg}
                      </div>
                    )}

                    {/* 3 Action Buttons matching user reference screenshot */}
                    <div className="flex flex-col gap-2.5">
                      {/* 1. UNLIMITED HEARTS */}
                      <button
                        type="button"
                        onClick={() => {
                          setActivePopover(null);
                          router.push('/shop');
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Teal-Purple Gradient Heart with Infinity symbol */}
                          <svg width="28" height="26" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                            <defs>
                              <linearGradient id="unlimitedHeartGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00cd9c" />
                                <stop offset="45%" stopColor="#1cb0f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                              fill="url(#unlimitedHeartGrad)"
                            />
                            <text
                              x="15"
                              y="15.5"
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="13"
                              fontWeight="900"
                              fontFamily="sans-serif"
                              dominantBaseline="central"
                            >
                              ∞
                            </text>
                          </svg>
                          <span className="font-black text-[13px] uppercase tracking-wider text-[var(--text-primary)]">
                            UNLIMITED HEARTS
                          </span>
                        </div>
                        <span className="font-black text-[12px] uppercase tracking-wider text-[#d946ef] shrink-0">
                          FREE TRIAL
                        </span>
                      </button>

                      {/* 2. REFILL HEARTS */}
                      <button
                        type="button"
                        disabled={refilling || (user?.hearts ?? 5) >= 5}
                        onClick={handleRefillGems}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] disabled:opacity-60 transition-colors cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="26" height="24" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                            <path
                              d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                              fill="#ff4b4b"
                              stroke="#ffffff"
                              strokeWidth="2.2"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="font-black text-[13px] uppercase tracking-wider text-[var(--text-primary)]">
                            REFILL HEARTS
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#1cb0f6] font-black text-sm shrink-0">
                          <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                            <path
                              d="M9 5H21L27 12.5L15 26.5L3 12.5L9 5Z"
                              fill="#1cb0f6"
                            />
                            <path
                              d="M9 5H21L18 11.5H12L9 5Z"
                              fill="#64d1f8"
                              fillOpacity="0.6"
                            />
                            <ellipse cx="13" cy="7.5" rx="2" ry="1" fill="#ffffff" />
                          </svg>
                          <span>350</span>
                        </div>
                      </button>

                      {/* 3. PRACTICE TO EARN HEARTS */}
                      <Link
                        href="/practice"
                        onClick={() => setActivePopover(null)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer text-left no-underline group"
                      >
                        <svg width="22" height="20" viewBox="0 0 30 28" fill="none" className="shrink-0 select-none">
                          <path
                            d="M15 25.5L13.3 23.9C7.2 18.4 3 14.6 3 9.9C3 6.1 6 3 9.8 3C12 3 14.1 4 15 5.7C15.9 4 18 3 20.2 3C24 3 27 6.1 27 9.9C27 14.6 22.8 18.4 16.7 23.9L15 25.5Z"
                            fill="#ff4b4b"
                          />
                        </svg>
                        <span className="font-black text-[13px] uppercase tracking-wider text-[var(--text-primary)]">
                          PRACTICE TO EARN HEARTS
                        </span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
          </div>
        </div>
      </header>

      {/* Heart Refill Modal */}
      <Modal isOpen={isHeartModalOpen} onClose={() => setIsHeartModalOpen(false)} title="Hearts Refill">
        <div className="text-center py-2">
          <div className="flex justify-center mb-3">
            <HeartIcon />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-6 font-semibold">
            You currently have <span className="font-extrabold text-[var(--duo-red)]">{user?.hearts ?? 3} / 5</span> hearts.
            Hearts are needed to practice lessons. Refill with gems or practice for free!
          </p>

          {refillMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--duo-blue-light)] text-[var(--duo-blue-dark)] text-sm font-bold">
              {refillMsg}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              variant="blue"
              fullWidth
              disabled={refilling || (user?.gems ?? 0) < 350 || (user?.hearts ?? 5) >= 5}
              onClick={handleRefillGems}
            >
              Refill All Hearts (350 💎)
            </Button>

            <Link href="/practice" className="no-underline" onClick={() => setIsHeartModalOpen(false)}>
              <Button variant="primary" fullWidth>
                Free Practice (+1 ❤️)
              </Button>
            </Link>

            <Button variant="secondary" fullWidth onClick={() => setIsHeartModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
