'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CoursePathResponse } from '../types';
import { api } from '../services/api';
import { useGame } from '../context/GameContext';
import { progressManager, CourseProgress } from '../services/progressManager';
import { UnitBanner } from '../components/path/UnitBanner';
import { SkillPopover } from '../components/path/SkillPopover';
import { ChestRewardModal } from '../components/path/ChestRewardModal';
import { DuoOwl } from '../components/mascot/DuoOwl';
import {
  WhiteStarIcon,
  MutedStarIcon,
  FastForwardIcon,
  DuolingoChestIcon,
  HeadphonesIcon,
  TrophyIcon,
  StartPill,
  JumpPill,
  OpenPill,
  CompletedCheckIcon,
} from '../components/path/PathElements';
import {
  DuoStandingMascot,
  LilyMascot,
  OscarMascot,
} from '../components/path/PathMascots';
import { JumpModal } from '../components/path/JumpModal';
import { PathRightRail } from '../components/layout/PathRightRail';

import { COURSE_ID_TO_LANG, LANG_TO_COURSE_ID } from '../services/curriculumFallback';

interface PathNodeConfig {
  level: number;
  type: 'star' | 'chest' | 'headphones' | 'trophy' | 'jump';
  offsetX: number; // horizontal displacement in px
  title: string;
  totalLessons: number;
}

interface UnitConfig {
  unitNumber: number;
  title: string;
  description: string;
  colorTheme: string;
  dividerText?: string;
  mascot?: 'duo' | 'lily' | 'oscar';
  nodes: PathNodeConfig[];
}

const UNITS_CONFIG: UnitConfig[] = [
  {
    unitNumber: 1,
    title: 'Order at a café',
    description: 'Form basic sentences, greet people, order food',
    colorTheme: '#58cc02',
    dividerText: 'Greet people and say goodbye',
    mascot: 'duo',
    nodes: [
      { level: 1, type: 'star', offsetX: 0, title: 'Basic Words & Greetings', totalLessons: 4 },
      { level: 2, type: 'star', offsetX: -38, title: 'Phrases & Sentence Construction', totalLessons: 4 },
      { level: 3, type: 'star', offsetX: -60, title: 'Grammar & Verb Conjugations', totalLessons: 4 },
      { level: 4, type: 'chest', offsetX: -35, title: 'Unit 1 Milestone Chest', totalLessons: 1 },
      { level: 5, type: 'headphones', offsetX: 25, title: 'Listening Comprehension Challenge', totalLessons: 3 },
      { level: 6, type: 'trophy', offsetX: 0, title: 'Unit 1 Mastery Challenge', totalLessons: 4 },
    ],
  },
  {
    unitNumber: 2,
    title: 'Greet people and say goodbye',
    description: 'Introduce yourself and have conversations',
    colorTheme: '#ce82ff',
    dividerText: 'Say where you are from',
    mascot: 'lily',
    nodes: [
      { level: 7, type: 'jump', offsetX: 0, title: 'Fast-Forward to Unit 2', totalLessons: 4 },
      { level: 8, type: 'star', offsetX: 38, title: 'Conversational Greetings & Questions', totalLessons: 4 },
      { level: 9, type: 'chest', offsetX: 10, title: 'Unit 2 Milestone Chest', totalLessons: 1 },
      { level: 10, type: 'headphones', offsetX: -25, title: 'Advanced Audio Listening & Dictation', totalLessons: 3 },
      { level: 11, type: 'star', offsetX: -50, title: 'Complex Sentences & Pronouns', totalLessons: 4 },
      { level: 12, type: 'trophy', offsetX: -20, title: 'Unit 2 Mastery Challenge', totalLessons: 4 },
    ],
  },
  {
    unitNumber: 3,
    title: 'Say where you are from',
    description: 'Talk about countries, origins, and languages',
    colorTheme: '#00cd9c',
    dividerText: 'Talk about your daily routine',
    mascot: 'oscar',
    nodes: [
      { level: 13, type: 'jump', offsetX: 0, title: 'Say Where You Are From', totalLessons: 4 },
      { level: 14, type: 'star', offsetX: -35, title: 'Countries & Nationalities', totalLessons: 4 },
      { level: 15, type: 'headphones', offsetX: -60, title: 'Airport & Travel Listening', totalLessons: 3 },
      { level: 16, type: 'chest', offsetX: -40, title: 'Unit 3 Milestone Chest', totalLessons: 1 },
      { level: 17, type: 'headphones', offsetX: 0, title: 'Directions & City Navigation', totalLessons: 3 },
      { level: 18, type: 'trophy', offsetX: 25, title: 'Unit 3 Mastery Challenge', totalLessons: 4 },
    ],
  },
  {
    unitNumber: 4,
    title: 'Talk about your daily routine',
    description: 'Describe habits, schedules, and tell time',
    colorTheme: '#ff9600',
    dividerText: 'Course Champion Final',
    nodes: [
      { level: 19, type: 'jump', offsetX: 0, title: 'Daily Routines & Schedules', totalLessons: 4 },
      { level: 20, type: 'star', offsetX: 35, title: 'Habits & Time Expressions', totalLessons: 4 },
      { level: 21, type: 'chest', offsetX: 60, title: 'Unit 4 Milestone Chest', totalLessons: 1 },
      { level: 22, type: 'headphones', offsetX: 40, title: 'Story Listening Practice', totalLessons: 3 },
      { level: 23, type: 'star', offsetX: 0, title: 'Story Recall & Free Typing', totalLessons: 4 },
      { level: 24, type: 'trophy', offsetX: -25, title: 'Course Champion Trophy', totalLessons: 4 },
    ],
  },
];

export default function LearnPage() {
  const { user, updateUserGems, refreshUser } = useGame();
  const currentCourseId = (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('duo_active_course_id');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const storedLang = localStorage.getItem('duo_active_lang');
      if (storedLang && LANG_TO_COURSE_ID[storedLang.toLowerCase().trim()]) {
        return LANG_TO_COURSE_ID[storedLang.toLowerCase().trim()];
      }
    }
    return user?.current_course_id || 7;
  })();

  const currentLangCode = (() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('duo_active_lang');
      if (storedLang && storedLang.trim()) return storedLang.toLowerCase().trim();
    }
    return COURSE_ID_TO_LANG[currentCourseId] || 'hi';
  })();

  const [pathData, setPathData] = useState<CoursePathResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Course Progress State synced with localStorage
  const [progress, setProgress] = useState<CourseProgress>(() =>
    progressManager.getCourseProgress(currentCourseId)
  );

  // Active Skill Popover (defaults to null; opens cleanly only when user clicks a node)
  const [activePopoverLevel, setActivePopoverLevel] = useState<number | null>(null);

  // Milestone Chest Reward Modal State
  const [chestModal, setChestModal] = useState<{
    isOpen: boolean;
    chestLevel: number;
    unitNumber: number;
    isAlreadyClaimed: boolean;
  }>({
    isOpen: false,
    chestLevel: 4,
    unitNumber: 1,
    isAlreadyClaimed: false,
  });

  // Jump Modal State
  const [jumpModal, setJumpModal] = useState<{
    isOpen: boolean;
    unitNumber: number;
    title: string;
    colorTheme: string;
  }>({
    isOpen: false,
    unitNumber: 2,
    title: 'Greet people and say goodbye',
    colorTheme: '#ce82ff',
  });

  // Locked node hint state
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Synchronize progress whenever course changes or progress event is dispatched
  useEffect(() => {
    const p = progressManager.getCourseProgress(currentCourseId);
    setProgress(p);

    const handleProgressUpdate = () => {
      const latest = progressManager.getCourseProgress(currentCourseId);
      setProgress(latest);
    };

    window.addEventListener('duo_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('duo_progress_updated', handleProgressUpdate);
  }, [currentCourseId]);

  useEffect(() => {
    async function loadPath() {
      try {
        const data = await api.getCurrentPath();
        setPathData(data);
      } catch (err: any) {
        console.warn('API error loading path, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPath();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentCourseId]);

  const handleLockedClick = (name: string) => {
    setLockedTooltip(`Complete previous lessons to unlock ${name}!`);
    setTimeout(() => {
      setLockedTooltip(null);
    }, 2500);
  };

  const handleChestClick = (levelNum: number, unitNumber: number) => {
    const isClaimed = progress.claimedChests.includes(levelNum);
    const isActive = progress.currentLevel === levelNum;
    const isLocked = !isClaimed && progress.currentLevel < levelNum;

    if (isLocked) {
      handleLockedClick(`Unit ${unitNumber} Milestone Chest`);
      return;
    }

    setChestModal({
      isOpen: true,
      chestLevel: levelNum,
      unitNumber,
      isAlreadyClaimed: isClaimed,
    });
  };

  const handleClaimChest = () => {
    progressManager.claimChest(currentCourseId, chestModal.chestLevel);
    updateUserGems(20);
    setChestModal((prev) => ({ ...prev, isOpen: false }));
    refreshUser();
  };

  const handleJump = (targetLevel: number) => {
    progressManager.jumpToUnit(currentCourseId, targetLevel);
    setJumpModal((prev) => ({ ...prev, isOpen: false }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <DuoOwl emotion="thinking" size={100} className="animate-float" />
        <div className="text-xl font-black text-[var(--text-secondary)] animate-pulse">
          Loading your course path...
        </div>
      </div>
    );
  }

  return (
    <div className="duo-path-layout">
      {/* Toast message when clicking locked node */}
      {lockedTooltip && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-primary)] px-5 py-3 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 animate-bounce">
          <span>🔒</span>
          <span>{lockedTooltip}</span>
        </div>
      )}

      {/* Jump Modal */}
      <JumpModal
        isOpen={jumpModal.isOpen}
        unitNumber={jumpModal.unitNumber}
        title={jumpModal.title}
        colorTheme={jumpModal.colorTheme}
        courseId={currentCourseId}
        langCode={currentLangCode}
        onClose={() => setJumpModal((prev) => ({ ...prev, isOpen: false }))}
        onJump={() => handleJump((jumpModal.unitNumber - 1) * 6 + 1)}
      />

      {/* Chest Reward Modal */}
      <ChestRewardModal
        isOpen={chestModal.isOpen}
        chestLevel={chestModal.chestLevel}
        unitNumber={chestModal.unitNumber}
        isAlreadyClaimed={chestModal.isAlreadyClaimed}
        onClaim={handleClaimChest}
        onClose={() => setChestModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Center Learning Path Column */}
      <div className="duo-path-main">
        {UNITS_CONFIG.map((unit) => (
          <section key={unit.unitNumber} className="w-full max-w-[580px] flex flex-col items-center">
            {/* Unit Header Banner */}
            <UnitBanner
              unitNumber={unit.unitNumber}
              title={unit.title}
              description={unit.description}
              colorTheme={unit.colorTheme}
            />

            {/* Path Nodes Container */}
            <div className="relative w-full flex flex-col items-center pt-3 pb-10 select-none">
              {/* Unit Mascots */}
              {unit.mascot === 'duo' && (
                <div
                  className="absolute pointer-events-none z-10 hidden sm:block"
                  style={{ top: '120px', right: '40px', transform: 'translateX(60px)' }}
                >
                  <DuoStandingMascot />
                </div>
              )}
              {unit.mascot === 'lily' && (
                <div
                  className="absolute pointer-events-none z-10 hidden sm:block"
                  style={{ top: '90px', left: '20px', transform: 'translateX(-40px)' }}
                >
                  <LilyMascot />
                </div>
              )}
              {unit.mascot === 'oscar' && (
                <div
                  className="absolute pointer-events-none z-10 hidden sm:block"
                  style={{ top: '190px', right: '20px', transform: 'translateX(60px)' }}
                >
                  <OscarMascot />
                </div>
              )}

              {/* Render Nodes for this Unit */}
              {unit.nodes.map((node) => {
                const isCompleted = progress.completedLevels.includes(node.level) || progress.currentLevel > node.level;
                const isActive = !isCompleted && progress.currentLevel === node.level;
                const isLocked = !isCompleted && !isActive;
                const isClaimed = progress.claimedChests.includes(node.level);
                const isPopoverOpen = activePopoverLevel === node.level;

                // 1. CHEST NODE
                if (node.type === 'chest') {
                  return (
                    <div
                      key={node.level}
                      className={`duo-skill-node relative flex flex-col items-center mb-12 cursor-pointer group ${isPopoverOpen ? 'z-50' : 'z-20'}`}
                      style={{ '--node-offset': `${node.offsetX}px` } as React.CSSProperties}
                      onClick={() => handleChestClick(node.level, unit.unitNumber)}
                    >
                      {isActive && activePopoverLevel === null && <OpenPill />}

                      <div className="w-[84px] h-[70px] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform relative">
                        <DuolingoChestIcon
                          size={80}
                          className={isClaimed ? 'opacity-70 grayscale-[20%]' : isActive ? 'animate-pulse' : ''}
                        />
                        {isClaimed && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#58cc02] border-2 border-[var(--bg-main)] flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // 2. JUMP NODE (First node of Unit 2, 3, 4 when locked)
                if (node.type === 'jump' && isLocked) {
                  return (
                    <div
                      key={node.level}
                      className={`duo-skill-node relative flex flex-col items-center mb-12 cursor-pointer group ${isPopoverOpen ? 'z-50' : 'z-30'}`}
                      style={{ '--node-offset': `${node.offsetX}px` } as React.CSSProperties}
                      onClick={() =>
                        setJumpModal({
                          isOpen: true,
                          unitNumber: unit.unitNumber,
                          title: unit.title,
                          colorTheme: unit.colorTheme,
                        })
                      }
                    >
                      {activePopoverLevel === null && <JumpPill />}
                      <div
                        className="w-[74px] h-[74px] rounded-full border-b-[6px] hover:brightness-105 active:translate-y-0.5 flex items-center justify-center shadow-lg transition-transform"
                        style={{
                          backgroundColor: unit.colorTheme,
                          borderColor: 'rgba(0,0,0,0.25)',
                        }}
                      >
                        <FastForwardIcon />
                      </div>
                    </div>
                  );
                }

                // 3. ACTIVE NODE (Show START pill + Halo + Popover)
                if (isActive) {
                  return (
                    <div
                      key={node.level}
                      className={`duo-skill-node relative flex flex-col items-center mb-12 ${isPopoverOpen ? 'z-50' : 'z-30'}`}
                      style={{ '--node-offset': `${node.offsetX}px` } as React.CSSProperties}
                    >
                      {isPopoverOpen && (
                        <SkillPopover
                          title={node.title}
                          lessonNumber={((node.level - 1) % 6) + 1}
                          totalLessons={node.totalLessons}
                          isCompleted={false}
                          lessonId={node.level}
                          courseId={currentCourseId}
                          langCode={currentLangCode}
                          colorTheme={unit.colorTheme}
                          onClose={() => setActivePopoverLevel(null)}
                        />
                      )}

                      {!isPopoverOpen && activePopoverLevel === null && <StartPill />}

                      <div
                        className="relative cursor-pointer group"
                        onClick={() =>
                          setActivePopoverLevel((prev) => (prev === node.level ? null : node.level))
                        }
                      >
                        <div className="w-[94px] h-[94px] rounded-full bg-[#1b272e] border-2 border-[#24333b] flex items-center justify-center animate-pulse">
                          <button
                            type="button"
                            className="w-[74px] h-[74px] rounded-full border-b-[6px] hover:brightness-105 active:translate-y-0.5 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
                            style={{
                              backgroundColor: unit.colorTheme,
                              borderColor: 'rgba(0,0,0,0.3)',
                            }}
                            aria-label={node.title}
                          >
                            {node.type === 'headphones' ? (
                              <HeadphonesIcon color="white" />
                            ) : node.type === 'trophy' ? (
                              <TrophyIcon color="white" />
                            ) : (
                              <WhiteStarIcon />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 4. COMPLETED NODE (Gold / Unit Color with Checkmark + Practice Popover)
                if (isCompleted) {
                  return (
                    <div
                      key={node.level}
                      className={`duo-skill-node relative flex flex-col items-center mb-12 cursor-pointer group ${isPopoverOpen ? 'z-50' : 'z-20'}`}
                      style={{ '--node-offset': `${node.offsetX}px` } as React.CSSProperties}
                      onClick={() =>
                        setActivePopoverLevel((prev) => (prev === node.level ? null : node.level))
                      }
                    >
                      {isPopoverOpen && (
                        <SkillPopover
                          title={node.title}
                          lessonNumber={((node.level - 1) % 6) + 1}
                          totalLessons={node.totalLessons}
                          isCompleted={true}
                          lessonId={node.level}
                          courseId={currentCourseId}
                          langCode={currentLangCode}
                          colorTheme={unit.colorTheme}
                          onClose={() => setActivePopoverLevel(null)}
                        />
                      )}

                      <div
                        className="w-[74px] h-[74px] rounded-full bg-[#58cc02] border-b-[6px] border-[#46a302] hover:brightness-105 active:translate-y-0.5 flex items-center justify-center shadow-md transition-transform"
                      >
                        {node.type === 'trophy' ? (
                          <TrophyIcon color="#ffc800" />
                        ) : (
                          <CompletedCheckIcon />
                        )}
                      </div>
                    </div>
                  );
                }

                // 5. LOCKED NODE (Dark muted style with click toast)
                return (
                  <div
                    key={node.level}
                    className={`duo-skill-node relative flex flex-col items-center mb-12 cursor-pointer ${isPopoverOpen ? 'z-50' : 'z-10'}`}
                    style={{ '--node-offset': `${node.offsetX}px` } as React.CSSProperties}
                    onClick={() => handleLockedClick(node.title)}
                  >
                    <div className="w-[74px] h-[74px] rounded-full bg-[#23333b] border-b-8 border-[#19252c] flex items-center justify-center hover:brightness-110 transition-transform">
                      {node.type === 'headphones' ? (
                        <HeadphonesIcon color="#485b68" />
                      ) : node.type === 'trophy' ? (
                        <TrophyIcon color="#384953" />
                      ) : (
                        <MutedStarIcon />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Divider */}
            {unit.dividerText && (
              <div className="w-full flex items-center gap-4 my-8 px-4 select-none">
                <div className="h-[2px] flex-1 bg-[#23333d]" />
                <span className="text-xs sm:text-sm font-black text-[#5e7382] tracking-wide text-center">
                  {unit.dividerText}
                </span>
                <div className="h-[2px] flex-1 bg-[#23333d]" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Right Desktop Rail */}
      <PathRightRail />

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 right-6 z-40 w-12 h-12 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center shadow-xl transition-all hover:scale-110 cursor-pointer animate-bounce"
          aria-label="Scroll to top"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
