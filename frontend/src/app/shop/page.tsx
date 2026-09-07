'use client';

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';

export default function ShopPage() {
  const { user, refreshUser } = useGame();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefillHearts = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.refillHearts('gems');
      setMessage(`Success! ${res.message}`);
      await refreshUser();
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Not enough gems'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyStreakFreeze = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.purchaseShopItem('streak_freeze');
      setMessage(`Success! ${res.message}`);
      await refreshUser();
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Not enough gems for Streak Freeze'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-4 select-none">
      {/* Gem Balance Banner */}
      <div className="duo-shop-banner">
        <div>
          <div className="text-xs font-black uppercase text-[var(--duo-blue-dark)]">Your Balance</div>
          <h1 className="text-3xl font-black text-[var(--duo-blue-dark)] flex items-center gap-2 mt-1">
            <span>💎</span>
            <span>{user?.gems ?? 500}</span>
          </h1>
        </div>
        <p className="text-xs font-extrabold text-[var(--duo-blue-dark)] max-w-[200px] text-right">
          Earn gems by completing lessons and maintaining your daily streak!
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-extrabold text-center ${
            message.startsWith('Success')
              ? 'bg-[var(--duo-green-light)] text-[var(--duo-green-dark)]'
              : 'bg-[var(--duo-red-light)] text-[var(--duo-red-dark)]'
          }`}
        >
          {message}
        </div>
      )}

      {/* Super Duolingo Promo */}
      <div className="duo-super-banner">
        <div>
          <span className="duo-tag-purple">
            Super
          </span>
          <h3 className="text-xl font-black text-[var(--text-primary)] mt-1">Super Duolingo</h3>
          <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
            Unlimited hearts, personalized practice, and no ads!
          </p>
        </div>
        <Button variant="purple" size="sm" onClick={() => setMessage('Super Duolingo demo tier activated!')}>
          Try For Free
        </Button>
      </div>

      {/* Shop Items List */}
      <h2 className="text-xl font-black text-[var(--text-primary)] mt-2">Power-Ups</h2>
      <div className="flex flex-col gap-3">
        {/* Heart Refill */}
        <div className="duo-shop-row">
          <div className="flex items-center gap-4">
            <span className="text-4xl">❤️</span>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)]">Full Heart Refill</h3>
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                Restore all 5 hearts to continue learning right away.
              </p>
            </div>
          </div>
          <Button
            variant="blue"
            size="sm"
            disabled={loading || (user?.gems ?? 0) < 350 || (user?.hearts ?? 5) >= 5}
            onClick={handleRefillHearts}
          >
            350 💎
          </Button>
        </div>

        {/* Streak Freeze */}
        <div className="duo-shop-row">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🧊</span>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)]">Streak Freeze</h3>
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                Protect your streak if you miss a day of practice.
              </p>
            </div>
          </div>
          <Button
            variant="blue"
            size="sm"
            disabled={loading || (user?.gems ?? 0) < 200}
            onClick={handleBuyStreakFreeze}
          >
            200 💎
          </Button>
        </div>

        {/* Double XP Boost (Mocked) */}
        <div className="duo-shop-row">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🧪</span>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)]">Double XP Boost</h3>
              <p className="text-xs font-bold text-[var(--text-secondary)]">
                Earn 2x XP for 15 minutes during practice.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMessage('Double XP Boost activated! Next lessons give double reward.')}
          >
            200 💎
          </Button>
        </div>
      </div>
    </div>
  );
}
