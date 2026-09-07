'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserStats, AchievementsResponse } from '../../types';
import { api } from '../../services/api';
import { FlagIcon } from '../../components/ui/FlagIcon';
import { useGame } from '../../context/GameContext';

// =============================================================================
// AUTHENTIC VECTOR ASSETS MATCHING REFERENCE SCREENSHOTS
// =============================================================================

/** Duolingo Avatar Silhouette with Curly Hair & Centered Cyan Plus (+) */
const AvatarSilhouette = () => (
  <svg
    viewBox="0 0 200 200"
    className="w-48 h-48 sm:w-56 sm:h-56 select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body / Shoulders & Neck & Curly Hair Silhouette */}
    <g>
      {/* Shoulders and Chest */}
      <path
        d="M28 198 C28 168 56 142 82 136 L82 120 C80 120 78 119 76 116 C73 112 72 104 74 98 C70 94 67 86 68 78 C68 72 71 67 75 64 C73 58 73 50 76 44 C81 35 90 30 100 28 C107 26 115 27 122 30 C129 27 137 28 143 32 C150 37 154 44 154 52 C159 56 163 62 163 69 C164 76 161 83 157 87 C159 93 158 100 155 105 C152 111 146 115 140 117 C139 120 137 122 135 123 L135 136 C161 142 189 168 189 198 Z"
        fill="#214358"
      />

      {/* Dashed Cyan Outline */}
      <path
        d="M28 198 C28 168 56 142 82 136 L82 120 C80 120 78 119 76 116 C73 112 72 104 74 98 C70 94 67 86 68 78 C68 72 71 67 75 64 C73 58 73 50 76 44 C81 35 90 30 100 28 C107 26 115 27 122 30 C129 27 137 28 143 32 C150 37 154 44 154 52 C159 56 163 62 163 69 C164 76 161 83 157 87 C159 93 158 100 155 105 C152 111 146 115 140 117 C139 120 137 122 135 123 L135 136 C161 142 189 168 189 198"
        stroke="#1cb0f6"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Plus Sign in the center of the silhouette's face */}
      <path
        d="M100 78 V98 M90 88 H110"
        stroke="#1cb0f6"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

/** Edit Pencil Icon */
const PencilEditIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-[var(--text-primary)]"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

/** Day Streak Flame Icon */
const FlameIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="shrink-0 select-none">
    <path
      d="M12 2C9.5 6 6 8.5 6 13a6 6 0 0 0 12 0c0-3-1.5-5.5-3-7.5-0.5 2-2 3.5-3 3.5-1 0-1.5-1-1.5-2 0-2.5 1.5-5 1.5-5z"
      fill="#ff9600"
    />
    <path
      d="M12 9c-0.5 1-1.5 2-2 3.5a3 3 0 0 0 5 1.5c0-1.5-0.8-2.8-1.5-3.8-0.3 0.8-0.9 1.3-1.5 1.3s-0.5-0.5-0.5-1c0-0.7 0.5-1.5 0.5-1.5z"
      fill="#ffc800"
    />
  </svg>
);

/** Lightning Bolt Icon */
const LightningIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffc800" className="shrink-0 select-none">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
  </svg>
);

/** Shield League Icon */
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="shrink-0 select-none">
    <path d="M12 2L4 5V11C4 16.5 7.4 21.6 12 23C16.6 21.6 20 16.5 20 11V5L12 2Z" fill="#32444f" />
    <path
      d="M12 3.8L5.5 6.2V11C5.5 15.6 8.2 19.8 12 21.2C15.8 19.8 18.5 15.6 18.5 11V6.2L12 3.8Z"
      fill="#465864"
    />
    <path d="M12 5.5L7 7.5V11C7 14.8 9.1 18.2 12 19.4V5.5Z" fill="#384955" />
  </svg>
);

/** Medal / Finishes Icon */
const MedalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="shrink-0 select-none">
    <circle cx="12" cy="9" r="6" fill="#32444f" stroke="#465864" strokeWidth="2" />
    <path d="M8.5 13.5L7 22L12 19L17 22L15.5 13.5" fill="#32444f" stroke="#465864" strokeWidth="1.5" />
    <circle cx="12" cy="9" r="3" fill="#465864" />
  </svg>
);

/** Right Chevron Icon */
const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#778e9b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/** Find Friends Magnifying Glass */
const FindFriendsIcon = () => (
  <div className="w-10 h-10 rounded-full bg-[#1e2f38] flex items-center justify-center shrink-0">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#e5e5e5" strokeWidth="2.5" fill="#1cb0f6" fillOpacity="0.2" />
      <path d="M16 16L21 21" stroke="#e5e5e5" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 10C8.5 8.5 10 7.5 11.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

/** Invite Friends Envelope with Duo Owl Peeking */
const InviteFriendsIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-[#58cc02] flex items-center justify-center shrink-0 relative overflow-hidden shadow-xs">
    {/* Duo Face inside Envelope */}
    <div className="w-6 h-4 bg-white/90 rounded-sm flex items-center justify-center relative shadow-xs">
      <div className="w-1.5 h-1.5 bg-[#131f24] rounded-full mr-1" />
      <div className="w-1.5 h-1.5 bg-[#131f24] rounded-full" />
      <div className="absolute -bottom-1 w-1.5 h-1 bg-[#ff9600] rounded-xs" />
    </div>
  </div>
);

/** Group Cast Illustration matching the official Duolingo cast screenshot */
const DuolingoFriendsIllustration = () => (
  <div className="w-full max-w-[340px] mx-auto select-none pointer-events-none my-2 flex items-center justify-center">
    <img
      src="/images/duo-friends-transparent.png"
      alt="Duolingo Friends Cast"
      width={374}
      height={209}
      className="w-full h-auto object-contain drop-shadow-md"
      draggable={false}
    />
  </div>
);

// =============================================================================
// PROFILE PAGE MAIN COMPONENT
// =============================================================================

export default function ProfilePage() {
  const { user } = useGame();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievementsData, setAchievementsData] = useState<AchievementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showViewAllModal, setShowViewAllModal] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userStats, achs] = await Promise.all([
          api.getUserStats(),
          api.getAchievements(),
        ]);
        setStats(userStats);
        setAchievementsData(achs);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2400);
  };

  // Pre-configured values matching the user's reference screenshot with dynamic fallback
  const displayName = user?.username === 'learner' ? 'Hemant Sharma' : (user?.username || 'Hemant Sharma');
  const handleName = 'HemantShar466437';
  const joinedDate = 'Joined September 2026';
  const streakCount = stats?.streak ?? 1;
  const xpCount = stats?.total_xp ?? 14;

  return (
    <div className="w-full max-w-[1080px] mx-auto select-none pt-2 pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1cb0f6] text-white font-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">✨</span>
          <span className="text-sm">{showToast}</span>
        </div>
      )}

      {/* Two-Column Authentic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_368px] gap-8 xl:gap-12 items-start">
        {/* ===================================================================
            LEFT COLUMN: HERO CARD, USER IDENTITY, STATISTICS, ACHIEVEMENTS
            =================================================================== */}
        <div className="flex flex-col gap-8 w-full min-w-0">
          {/* 1. Hero Avatar Card */}
          <div className="relative w-full h-[250px] sm:h-[280px] rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center overflow-hidden">
            {/* Centered Avatar Silhouette with Curly Hair, Dashed Cyan Outline & Plus */}
            <div className="transform translate-y-3">
              <AvatarSilhouette />
            </div>

            {/* Circular Pencil Edit Button */}
            <button
              type="button"
              onClick={() => triggerToast('Avatar editor opening soon!')}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95"
              aria-label="Edit Profile Avatar"
            >
              <PencilEditIcon />
            </button>
          </div>

          {/* 2. User Details & Enrolled Language Flags */}
          <div className="flex items-start justify-between gap-4 -mt-2">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-black text-[var(--text-primary)] leading-tight">
                {displayName}
              </h1>
              <p className="text-sm font-bold text-[var(--text-secondary)] mt-0.5">
                {handleName}
              </p>
              <p className="text-sm font-bold text-[var(--text-secondary)] mt-1.5">
                {joinedDate}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('following')}
                  className="font-black text-sm text-[#1cb0f6] hover:underline cursor-pointer"
                >
                  0 Following
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('followers')}
                  className="font-black text-sm text-[#1cb0f6] hover:underline cursor-pointer"
                >
                  0 Followers
                </button>
              </div>
            </div>

            {/* Language Flag Badges (French and Spanish) */}
            <div className="flex items-center gap-2 pt-1">
              <div
                title="French Course"
                className="rounded-lg overflow-hidden border border-[var(--border-color)] shadow-xs cursor-pointer hover:scale-105 transition-transform"
              >
                <FlagIcon code="fr" width={32} height={23} />
              </div>
              <div
                title="Spanish Course"
                className="rounded-lg overflow-hidden border border-[var(--border-color)] shadow-xs cursor-pointer hover:scale-105 transition-transform"
              >
                <FlagIcon code="es" width={32} height={23} />
              </div>
            </div>
          </div>

          {/* 3. Statistics Section (2x2 Grid) */}
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-3">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Day Streak */}
              <div className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-4 hover:border-[#384b56] transition-colors">
                <FlameIcon />
                <div>
                  <div className="text-xl font-black text-[var(--text-primary)] leading-tight">
                    {streakCount}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-secondary)]">Day streak</div>
                </div>
              </div>

              {/* Total XP */}
              <div className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-4 hover:border-[#384b56] transition-colors">
                <LightningIcon />
                <div>
                  <div className="text-xl font-black text-[var(--text-primary)] leading-tight">
                    {xpCount}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-secondary)]">Total XP</div>
                </div>
              </div>

              {/* Current League */}
              <div className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-4 hover:border-[#384b56] transition-colors">
                <ShieldIcon />
                <div>
                  <div className="text-xl font-black text-[var(--text-primary)] leading-tight">None</div>
                  <div className="text-sm font-bold text-[var(--text-secondary)]">Current league</div>
                </div>
              </div>

              {/* Top 3 Finishes */}
              <div className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center gap-4 hover:border-[#384b56] transition-colors">
                <MedalIcon />
                <div>
                  <div className="text-xl font-black text-[var(--text-primary)] leading-tight">0</div>
                  <div className="text-sm font-bold text-[var(--text-secondary)]">Top 3 finishes</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Achievements Section (Stacked Cards matching Image 2) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-black text-[var(--text-primary)]">Achievements</h2>
              <button
                type="button"
                onClick={() => setShowViewAllModal(true)}
                className="text-xs sm:text-sm font-black text-[#1cb0f6] uppercase tracking-wider hover:underline cursor-pointer"
              >
                VIEW ALL
              </button>
            </div>

            <div className="rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] divide-y-2 divide-[var(--border-color)] overflow-hidden">
              {/* Row 1: Wildfire */}
              <div className="p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                {/* Badge Icon */}
                <div className="w-16 h-20 sm:w-18 sm:h-22 shrink-0 flex items-center justify-center select-none">
                  <img
                    src="/images/achievement-wildfire@2x.png"
                    alt="Wildfire Level 1"
                    width={89}
                    height={111}
                    className="w-full h-full object-contain drop-shadow-md"
                    draggable={false}
                  />
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-base text-[var(--text-primary)] truncate">Wildfire</h3>
                    <span className="text-xs sm:text-sm font-black text-[var(--text-secondary)] shrink-0">1/3</span>
                  </div>
                  <div className="w-full h-3.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#ffc800] rounded-full transition-all duration-500"
                      style={{ width: '33.3%' }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] mt-1.5 truncate">
                    Reach a 3 day streak
                  </p>
                </div>
              </div>

              {/* Row 2: Sage */}
              <div className="p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                {/* Badge Icon */}
                <div className="w-16 h-20 sm:w-18 sm:h-22 shrink-0 flex items-center justify-center select-none">
                  <img
                    src="/images/achievement-sage@2x.png"
                    alt="Sage Level 1"
                    width={89}
                    height={111}
                    className="w-full h-full object-contain drop-shadow-md"
                    draggable={false}
                  />
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-base text-[var(--text-primary)] truncate">Sage</h3>
                    <span className="text-xs sm:text-sm font-black text-[var(--text-secondary)] shrink-0">14/100</span>
                  </div>
                  <div className="w-full h-3.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#ffc800] rounded-full transition-all duration-500"
                      style={{ width: '14%' }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] mt-1.5 truncate">
                    Earn 100 XP
                  </p>
                </div>
              </div>

              {/* Row 3: Champion */}
              <div className="p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                {/* Badge Icon */}
                <div className="w-16 h-20 sm:w-18 sm:h-22 shrink-0 flex items-center justify-center select-none">
                  <img
                    src="/images/achievement-scholar@2x.png"
                    alt="Scholar Level 1"
                    width={89}
                    height={109}
                    className="w-full h-full object-contain drop-shadow-md"
                    draggable={false}
                  />
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-base text-[var(--text-primary)] truncate">Scholar</h3>
                    <span className="text-xs sm:text-sm font-black text-[var(--text-secondary)] shrink-0">0/1</span>
                  </div>
                  <div className="w-full h-3.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#ffc800] rounded-full transition-all duration-500"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] mt-1.5 truncate">
                    Unlock Leaderboards by completing 10 lessons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: FRIENDS CARD, ADD FRIENDS CARD, FOOTER LINKS
            =================================================================== */}
        <div className="flex flex-col gap-6 w-full sticky top-24">
          {/* 1. Friends / Followers Tabbed Card */}
          <div className="rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-3.5 text-center font-black text-xs sm:text-sm tracking-wider uppercase relative transition-colors cursor-pointer ${
                  activeTab === 'following'
                    ? 'text-[#1cb0f6]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                FOLLOWING
                {activeTab === 'following' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1cb0f6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('followers')}
                className={`flex-1 py-3.5 text-center font-black text-xs sm:text-sm tracking-wider uppercase relative transition-colors cursor-pointer ${
                  activeTab === 'followers'
                    ? 'text-[#1cb0f6]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                FOLLOWERS
                {activeTab === 'followers' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1cb0f6] rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[220px]">
              {/* Duolingo Friends Cast Illustration */}
              <DuolingoFriendsIllustration />

              <p className="text-sm font-bold text-[var(--text-secondary)] text-center max-w-[260px] mx-auto mt-4 leading-snug">
                Learning is more fun and effective when you connect with others.
              </p>
            </div>
          </div>

          {/* 2. Add Friends Card */}
          <div className="rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 flex flex-col gap-2">
            <h3 className="font-black text-base text-[var(--text-primary)] mb-1">Add friends</h3>

            {/* Find Friends Option */}
            <button
              type="button"
              onClick={() => triggerToast('Search for learners by username or email!')}
              className="flex items-center justify-between p-2.5 -mx-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FindFriendsIcon />
                <span className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#1cb0f6] transition-colors">
                  Find friends
                </span>
              </div>
              <ChevronRightIcon />
            </button>

            {/* Invite Friends Option */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && navigator?.clipboard) {
                  navigator.clipboard.writeText('https://duolingo.com/invite/HemantShar466437');
                }
                triggerToast('Invite link copied to clipboard!');
              }}
              className="flex items-center justify-between p-2.5 -mx-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <InviteFriendsIcon />
                <span className="font-black text-sm text-[var(--text-primary)] group-hover:text-[#58cc02] transition-colors">
                  Invite friends
                </span>
              </div>
              <ChevronRightIcon />
            </button>
          </div>

          {/* 3. Small Uppercase Footer Links */}
          <div className="flex flex-col items-center gap-2 select-none text-[11px] font-black text-[#526571] uppercase tracking-wider pt-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/about" className="hover:text-[#778e9b] transition-colors no-underline">
                ABOUT
              </Link>
              <Link href="/blog" className="hover:text-[#778e9b] transition-colors no-underline">
                BLOG
              </Link>
              <Link href="/store" className="hover:text-[#778e9b] transition-colors no-underline">
                STORE
              </Link>
              <Link href="/efficacy" className="hover:text-[#778e9b] transition-colors no-underline">
                EFFICACY
              </Link>
              <Link href="/careers" className="hover:text-[#778e9b] transition-colors no-underline">
                CAREERS
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/investors" className="hover:text-[#778e9b] transition-colors no-underline">
                INVESTORS
              </Link>
              <Link href="/terms" className="hover:text-[#778e9b] transition-colors no-underline">
                TERMS
              </Link>
              <Link href="/privacy" className="hover:text-[#778e9b] transition-colors no-underline">
                PRIVACY
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW ALL ACHIEVEMENTS MODAL */}
      {showViewAllModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowViewAllModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-black text-[var(--text-primary)]">All Achievements</h3>
              <button
                type="button"
                onClick={() => setShowViewAllModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {achievementsData?.achievements?.map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center gap-4"
                >
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center select-none">
                    <img
                      src={
                        ach.title.toLowerCase().includes('sage')
                          ? '/images/achievement-sage@2x.png'
                          : ach.title.toLowerCase().includes('wildfire') || ach.title.toLowerCase().includes('streak')
                          ? '/images/achievement-wildfire@2x.png'
                          : '/images/achievement-scholar@2x.png'
                      }
                      alt={ach.title}
                      className="w-full h-full object-contain drop-shadow-sm"
                      draggable={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-[var(--text-primary)] text-sm truncate">{ach.title}</h4>
                      <span className="text-xs font-bold text-[var(--text-secondary)]">
                        {ach.progress}/{ach.threshold}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{ach.description}</p>
                    <div className="w-full h-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-[#ffc800] rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((ach.progress / ach.threshold) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
