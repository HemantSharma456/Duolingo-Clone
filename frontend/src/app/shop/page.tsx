'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';

export default function ShopPage() {
  const {
    user,
    isSuper,
    activateSuper,
    cancelSuper,
    updateUserHearts,
    updateUserGems,
    refreshUser,
  } = useGame();

  const { playCorrectSound, playCompleteFanfare } = useSound();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSuperModalOpen, setIsSuperModalOpen] = useState<boolean>(false);

  // Streak Freeze inventory tracking (up to 2 freezes)
  const [freezeCount, setFreezeCount] = useState<number>(0);

  // Double XP timer tracking
  const [doubleXpRemaining, setDoubleXpRemaining] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFreezes = localStorage.getItem('duo_streak_freeze_count');
      if (storedFreezes) {
        setFreezeCount(parseInt(storedFreezes, 10) || 0);
      }

      const storedXpUntil = localStorage.getItem('duo_double_xp_until');
      if (storedXpUntil) {
        const remainingMs = parseInt(storedXpUntil, 10) - Date.now();
        if (remainingMs > 0) {
          setDoubleXpRemaining(Math.ceil(remainingMs / 1000));
        } else {
          localStorage.removeItem('duo_double_xp_until');
        }
      }
    }
  }, []);

  // Double XP countdown ticker
  useEffect(() => {
    if (doubleXpRemaining <= 0) return;
    const timer = setInterval(() => {
      setDoubleXpRemaining((prev) => {
        if (prev <= 1) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('duo_double_xp_until');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [doubleXpRemaining]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b'],
      });
    } catch {
      // ignore
    }
  };

  // 1. Buy Full Heart Refill (350 Gems)
  const handleRefillHearts = async () => {
    const currentGems = user?.gems ?? 505;
    const currentHearts = user?.hearts ?? 3;

    if (currentHearts >= 5) {
      showToast('Your hearts are already full!');
      return;
    }

    if (currentGems < 350) {
      showToast('Not enough gems for Heart Refill (Need 350 💎)');
      return;
    }

    setLoadingAction('hearts');
    try {
      // Immediate optimistic update
      updateUserGems(-350);
      updateUserHearts(5);
      playCompleteFanfare();
      triggerConfetti();
      showToast('Full Hearts Restored! ❤️❤️❤️❤️❤️ (-350 💎)');

      // Sync with backend if available
      try {
        await api.refillHearts('gems');
        await refreshUser();
      } catch {
        // local state remains updated
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Buy Streak Freeze (200 Gems)
  const handleBuyStreakFreeze = async () => {
    const currentGems = user?.gems ?? 505;

    if (freezeCount >= 2) {
      showToast('You already have the maximum 2 Streak Freezes equipped!');
      return;
    }

    if (currentGems < 200) {
      showToast('Not enough gems for Streak Freeze (Need 200 💎)');
      return;
    }

    setLoadingAction('freeze');
    try {
      const newCount = freezeCount + 1;
      setFreezeCount(newCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('duo_streak_freeze_count', newCount.toString());
      }

      updateUserGems(-200);
      playCorrectSound();
      triggerConfetti();
      showToast(`Streak Freeze equipped! (${newCount}/2 Active) (-200 💎)`);

      try {
        await api.purchaseShopItem('streak_freeze');
        await refreshUser();
      } catch {
        // local state remains updated
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Buy Double XP Boost (200 Gems)
  const handleBuyDoubleXp = () => {
    const currentGems = user?.gems ?? 505;

    if (doubleXpRemaining > 0) {
      showToast(`Double XP is already active! (${formatSeconds(doubleXpRemaining)} remaining)`);
      return;
    }

    if (currentGems < 200) {
      showToast('Not enough gems for Double XP Boost (Need 200 💎)');
      return;
    }

    setLoadingAction('xp');
    try {
      const durationSeconds = 15 * 60; // 15 minutes
      const expiryMs = Date.now() + durationSeconds * 1000;
      setDoubleXpRemaining(durationSeconds);

      if (typeof window !== 'undefined') {
        localStorage.setItem('duo_double_xp_until', expiryMs.toString());
      }

      updateUserGems(-200);
      playCorrectSound();
      triggerConfetti();
      showToast('2x XP Boost activated for 15 minutes! (-200 💎)');
    } finally {
      setLoadingAction(null);
    }
  };

  // 4. Activate Super Duolingo
  const handleActivateSuper = () => {
    activateSuper();
    setIsSuperModalOpen(false);
    playCompleteFanfare();
    triggerConfetti();
    showToast('✨ Super Duolingo activated! Enjoy Unlimited Hearts & zero ads!');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const gems = user?.gems ?? 505;
  const hearts = isSuper ? 5 : (user?.hearts ?? 3);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-4 pb-24 select-none px-2 sm:px-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1cb0f6] border-2 border-[#1899d6] text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gem Balance Banner */}
      <div className="duo-shop-banner bg-[var(--bg-surface)] border-2 border-[var(--border-color)]">
        <div>
          <div className="text-xs font-black uppercase text-[#1cb0f6] tracking-wider">
            Your Balance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] flex items-center gap-2.5 mt-1">
            <span>💎</span>
            <span>{gems}</span>
          </h1>
        </div>
        <p className="text-xs font-bold text-[var(--text-secondary)] max-w-[200px] text-right leading-relaxed">
          Earn gems by completing lessons and maintaining your daily streak!
        </p>
      </div>

      {/* Super Duolingo Hero Banner */}
      <div className="duo-super-banner relative overflow-hidden">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="duo-tag-purple">SUPER</span>
            {isSuper && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#58cc02] text-white text-[11px] font-black uppercase tracking-wider">
                ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#9333ea] dark:text-[#c084fc] mt-1.5 leading-tight">
            {isSuper ? 'Super Duolingo Active ✨' : 'Super Duolingo'}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] mt-1 max-w-md leading-relaxed">
            {isSuper
              ? 'You have Unlimited Hearts, personalized practice sessions, and zero ads!'
              : 'Unlimited hearts, personalized practice, and no ads!'}
          </p>
        </div>

        {isSuper ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              cancelSuper();
              showToast('Super subscription paused.');
            }}
            className="shrink-0"
          >
            Pause Plan
          </Button>
        ) : (
          <Button
            variant="purple"
            size="sm"
            onClick={() => setIsSuperModalOpen(true)}
            className="shrink-0 animate-pulse"
          >
            Try For Free
          </Button>
        )}
      </div>

      {/* Power-Ups Section Heading */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">Power-Ups</h2>
        <span className="text-xs font-bold text-[var(--text-secondary)]">Available in Shop</span>
      </div>

      {/* Power-Up Item List */}
      <div className="flex flex-col gap-3.5">
        {/* Item 1: Full Heart Refill */}
        <div className="duo-shop-row bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:border-[#4b5e68]">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-4xl select-none shrink-0">❤️</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--text-primary)] truncate">
                  Full Heart Refill
                </h3>
                {hearts >= 5 && (
                  <span className="text-[11px] font-black text-[#58cc02] bg-[#58cc02]/15 px-2 py-0.5 rounded-full uppercase">
                    Full
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {isSuper
                  ? 'Unlimited hearts active through Super Duolingo.'
                  : `Restore all 5 hearts to continue learning right away (Current: ${hearts}/5 ❤️).`}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isSuper ? (
              <span className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-black text-[var(--text-secondary)]">
                UNLIMITED ∞
              </span>
            ) : hearts >= 5 ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)] font-black text-xs uppercase cursor-default"
              >
                FULL ✓
              </button>
            ) : (
              <Button
                variant="blue"
                size="sm"
                disabled={loadingAction === 'hearts' || gems < 350}
                onClick={handleRefillHearts}
              >
                {loadingAction === 'hearts' ? 'REFILLING...' : '350 💎'}
              </Button>
            )}
          </div>
        </div>

        {/* Item 2: Streak Freeze */}
        <div className="duo-shop-row bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:border-[#4b5e68]">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-4xl select-none shrink-0">🧊</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--text-primary)] truncate">
                  Streak Freeze
                </h3>
                {freezeCount > 0 && (
                  <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/15 px-2 py-0.5 rounded-full uppercase">
                    {freezeCount}/2 Equipped
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Protect your streak if you miss a day of practice. You can hold up to 2.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {freezeCount >= 2 ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)] font-black text-xs uppercase cursor-default"
              >
                MAX (2/2) ✓
              </button>
            ) : (
              <Button
                variant="blue"
                size="sm"
                disabled={loadingAction === 'freeze' || gems < 200}
                onClick={handleBuyStreakFreeze}
              >
                {loadingAction === 'freeze' ? 'EQUIPPING...' : '200 💎'}
              </Button>
            )}
          </div>
        </div>

        {/* Item 3: Double XP Boost */}
        <div className="duo-shop-row bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:border-[#4b5e68]">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-4xl select-none shrink-0">🧪</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--text-primary)] truncate">
                  Double XP Boost
                </h3>
                {doubleXpRemaining > 0 && (
                  <span className="text-[11px] font-black text-[#ffc800] bg-[#ffc800]/15 px-2 py-0.5 rounded-full uppercase animate-pulse">
                    ⚡ {formatSeconds(doubleXpRemaining)} Active
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Earn 2x XP for 15 minutes during practice sessions and lessons.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {doubleXpRemaining > 0 ? (
              <span className="px-4 py-2 rounded-xl bg-[#ffc800]/15 border border-[#ffc800] text-xs font-black text-[#ffc800]">
                {formatSeconds(doubleXpRemaining)} ⚡
              </span>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                disabled={loadingAction === 'xp' || gems < 200}
                onClick={handleBuyDoubleXp}
              >
                {loadingAction === 'xp' ? 'ACTIVATING...' : '200 💎'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Super Duolingo Modal */}
      {isSuperModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsSuperModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[var(--bg-surface)] border-2 border-[#a855f7] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Super Glow Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-3xl shadow-lg mb-4">
              ✨
            </div>

            <h3 className="text-2xl font-black text-[var(--text-primary)]">
              Try Super Duolingo Free
            </h3>
            <p className="text-sm font-bold text-[var(--text-secondary)] mt-1.5 max-w-xs">
              Fast-track your language skills with the ultimate Duolingo experience.
            </p>

            {/* Features Checklist */}
            <div className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-2xl p-4 my-5 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-xl text-[#a855f7]">❤️</span>
                <div>
                  <div className="font-black text-sm text-[var(--text-primary)]">Unlimited Hearts</div>
                  <div className="text-xs text-[var(--text-secondary)]">Learn at your own pace without pauses</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-[#58cc02]">🎯</span>
                <div>
                  <div className="font-black text-sm text-[var(--text-primary)]">Personalized Practice</div>
                  <div className="text-xs text-[var(--text-secondary)]">Target your mistakes with custom exercises</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-[#ffc800]">🛡️</span>
                <div>
                  <div className="font-black text-sm text-[var(--text-primary)]">Zero Ads</div>
                  <div className="text-xs text-[var(--text-secondary)]">Enjoy seamless learning with no interruptions</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={handleActivateSuper}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:brightness-110 active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              START 2 WEEKS FREE
            </button>

            <button
              type="button"
              onClick={() => setIsSuperModalOpen(false)}
              className="text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider mt-3.5 cursor-pointer py-1"
            >
              NO THANKS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
