'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardResponse } from '../../types';
import { api } from '../../services/api';
import { DuoOwl } from '../../components/mascot/DuoOwl';

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await api.getLeaderboard();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <DuoOwl emotion="thinking" size={100} className="animate-float" />
        <div className="text-xl font-extrabold text-[var(--text-secondary)] animate-pulse">
          Calculating leaderboard rankings...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-black text-[var(--duo-red)]">Leaderboard Error</h2>
        <p className="text-sm font-bold text-[var(--text-secondary)] mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="duo-leaderboard-container select-none">
      {/* League Header Banner */}
      <div className="duo-leaderboard-banner">
        <div className="text-4xl mb-2">🏆</div>
        <h1 className="text-2xl font-black text-[var(--duo-yellow-dark)] tracking-tight">
          {data.league_name}
        </h1>
        <p className="text-xs font-extrabold text-[var(--text-secondary)] mt-1">
          Top 7 advance to the next league! Ends in {data.days_remaining} days.
        </p>
      </div>

      {/* Leaderboard Table List */}
      <div className="duo-leaderboard-table">
        {data.entries.map((entry) => {
          const isTop3 = entry.rank <= 3;
          const medal =
            entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;

          return (
            <div
              key={entry.user_id}
              className={`duo-leaderboard-row ${entry.is_current_user ? 'active font-black' : ''}`}
            >
              {/* Left: Rank & Avatar & Username */}
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-black text-base text-[var(--text-secondary)]">
                  {medal || entry.rank}
                </div>

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${
                    entry.is_current_user
                      ? 'bg-[var(--duo-blue)] text-white shadow-xs'
                      : isTop3
                      ? 'bg-[var(--duo-yellow)] text-white'
                      : 'bg-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  {entry.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="text-base font-extrabold flex items-center gap-2">
                    <span>{entry.username}</span>
                    {entry.is_current_user && (
                      <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-[var(--duo-blue)] text-white tracking-wider">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: XP Score */}
              <div className="font-black text-sm text-[var(--text-secondary)]">
                {entry.total_xp} <span className="text-xs font-bold">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
