'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DuoOwl } from '../../components/mascot/DuoOwl';

interface Quest {
  id: string;
  title: string;
  target: number;
  current: number;
  xpReward: number;
  gemReward: number;
  icon: string;
  chestTier: 'bronze' | 'silver' | 'gold';
  completed: boolean;
  claimed: boolean;
}

export default function QuestsPage() {
  const { user, updateUserGems, refreshUser } = useGame();
  const { playCorrectSound, playCompleteFanfare } = useSound();

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'quest_1',
      title: 'Earn 10 XP',
      target: 10,
      current: Math.min(10, Math.max(0, (user?.total_xp || 0) % 50)),
      xpReward: 5,
      gemReward: 10,
      icon: '⚡',
      chestTier: 'bronze',
      completed: ((user?.total_xp || 0) % 50) >= 10,
      claimed: false,
    },
    {
      id: 'quest_2',
      title: 'Complete 2 lessons',
      target: 2,
      current: 1,
      xpReward: 10,
      gemReward: 15,
      icon: '🎯',
      chestTier: 'silver',
      completed: false,
      claimed: false,
    },
    {
      id: 'quest_3',
      title: 'Score 90% or higher in 1 lesson',
      target: 1,
      current: 1,
      xpReward: 15,
      gemReward: 20,
      icon: '⭐',
      chestTier: 'gold',
      completed: true,
      claimed: false,
    },
  ]);

  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  // Sync quest state with user progress
  useEffect(() => {
    if (user) {
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id === 'quest_1') {
            const current = Math.min(10, (user.total_xp || 0) % 50);
            return {
              ...q,
              current,
              completed: current >= 10 || q.claimed,
            };
          }
          return q;
        })
      );
    }
  }, [user]);

  const handleClaim = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.claimed) return;

    playCorrectSound();
    updateUserGems(quest.gemReward);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
    setClaimedNotice(`Claimed ${quest.gemReward} gems from ${quest.title}!`);
    setTimeout(() => setClaimedNotice(null), 4000);
    refreshUser();
  };

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 select-none py-2 pb-24">
      {/* Toast Reward Notice */}
      {claimedNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1cb0f6] border-2 border-[#1899d6] text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 animate-bounce">
          <span>💎</span>
          <span>{claimedNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="w-full rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 flex items-center justify-between gap-6 relative overflow-hidden shadow-xs">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-black text-[#58cc02] uppercase tracking-wider mb-2">
            DAILY CHALLENGES
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
            Quests & Rewards
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-md">
            Complete daily and monthly milestones to earn bonus gems, maintain your streak, and unlock special badges.
          </p>
        </div>

        <div className="shrink-0 hidden sm:flex items-center justify-center">
          <DuoOwl emotion="celebrating" size={100} className="animate-float" />
        </div>
      </div>

      {/* Monthly Badge Quest Challenge */}
      <div className="w-full rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-[#ce82ff] uppercase tracking-wider">
              MONTHLY BADGE QUEST
            </span>
            <h2 className="text-xl font-black text-[var(--text-primary)] mt-0.5">
              September Challenge
            </h2>
          </div>
          <span className="text-xs font-extrabold text-[var(--text-secondary)] uppercase">
            22 DAYS LEFT
          </span>
        </div>

        <div className="flex items-center gap-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-2xl p-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ce82ff] to-[#7928ca] flex items-center justify-center text-3xl shadow-md shrink-0">
            🌌
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-black text-[var(--text-primary)] mb-2">
              <span>Complete 30 Quests</span>
              <span className="text-[#ce82ff]">{12 + completedCount} / 30</span>
            </div>
            <ProgressBar
              progress={Math.round(((12 + completedCount) / 30) * 100)}
              color="#ce82ff"
              height={14}
            />
          </div>
        </div>
      </div>

      {/* Daily Quests List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-[var(--text-primary)]">Daily Quests</h3>
          <span className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">
            REFRESHES IN 18H
          </span>
        </div>

        {quests.map((quest) => {
          const progressPercent = Math.min(
            100,
            Math.round((quest.current / quest.target) * 100)
          );

          return (
            <div
              key={quest.id}
              className="w-full rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-all hover:border-[#384b55]"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-2xl shrink-0 select-none">
                  {quest.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-black text-base text-[var(--text-primary)] truncate">
                      {quest.title}
                    </h4>
                    <span className="text-xs font-black text-[#ffc800] ml-2 shrink-0">
                      +{quest.gemReward} 💎
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar
                        progress={progressPercent}
                        color="#ffc800"
                        height={10}
                      />
                    </div>
                    <span className="text-xs font-black text-[var(--text-secondary)] shrink-0">
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto shrink-0 flex justify-end">
                {quest.claimed ? (
                  <button
                    disabled
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-black text-xs uppercase tracking-wider border border-[var(--border-color)] cursor-default"
                  >
                    CLAIMED ✓
                  </button>
                ) : quest.completed ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest.id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#58cc02] hover:bg-[#61e002] active:translate-y-0.5 border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer animate-pulse"
                  >
                    CLAIM REWARD
                  </button>
                ) : (
                  <Link href="/practice" className="w-full sm:w-auto no-underline">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-3 border-[#1479ab] active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                    >
                      PRACTICE
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice & Heart Refill Card */}
      <div className="w-full rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs mt-2">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center text-3xl shrink-0 select-none">
            ❤️
          </div>
          <div>
            <h3 className="text-lg font-black text-[var(--text-primary)]">
              Need to Refill Hearts?
            </h3>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-1 max-w-sm">
              Practice personalized exercises calibrated to your course to recover hearts and earn extra XP.
            </p>
          </div>
        </div>

        <Link href="/practice" className="w-full sm:w-auto no-underline">
          <button
            type="button"
            className="w-full sm:w-auto px-6 h-12 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            START PRACTICE
          </button>
        </Link>
      </div>
    </div>
  );
}
