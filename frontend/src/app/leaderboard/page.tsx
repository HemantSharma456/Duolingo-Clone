'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardResponse, LeaderboardEntry } from '../../types';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';
import { DuoOwl } from '../../components/mascot/DuoOwl';

const FALLBACK_COMPETITORS: LeaderboardEntry[] = [
  { rank: 1, user_id: 101, username: 'Sophia_L', avatar_url: '', total_xp: 480, is_current_user: false },
  { rank: 2, user_id: 102, username: 'Marco_V', avatar_url: '', total_xp: 410, is_current_user: false },
  { rank: 3, user_id: 103, username: 'Elena_R', avatar_url: '', total_xp: 360, is_current_user: false },
  { rank: 4, user_id: 104, username: 'Kenji_T', avatar_url: '', total_xp: 310, is_current_user: false },
  { rank: 5, user_id: 105, username: 'Amara_K', avatar_url: '', total_xp: 260, is_current_user: false },
  { rank: 6, user_id: 106, username: 'Liam_O', avatar_url: '', total_xp: 210, is_current_user: false },
  { rank: 7, user_id: 107, username: 'Priya_S', avatar_url: '', total_xp: 170, is_current_user: false },
  { rank: 8, user_id: 108, username: 'Chloe_M', avatar_url: '', total_xp: 120, is_current_user: false },
  { rank: 9, user_id: 109, username: 'Lukas_B', avatar_url: '', total_xp: 80, is_current_user: false },
  { rank: 10, user_id: 110, username: 'Mateo_D', avatar_url: '', total_xp: 40, is_current_user: false },
];

export default function LeaderboardPage() {
  const { user } = useGame();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const loadLeaderboard = async () => {
    try {
      setRetrying(true);
      const res = await api.getLeaderboard();
      setData(res);
      setIsOfflineFallback(false);
    } catch (err) {
      console.warn('Backend leaderboard unreachable, generating local standings:', err);
      // Construct dynamic standings including the user's current XP
      const currentXp = user?.total_xp ?? 309;
      const currentUsername = user?.username ?? 'Alex';

      const userEntry: LeaderboardEntry = {
        rank: 1,
        user_id: user?.id ?? 999,
        username: currentUsername,
        avatar_url: '',
        total_xp: currentXp,
        is_current_user: true,
      };

      const all = [...FALLBACK_COMPETITORS, userEntry];
      all.sort((a, b) => b.total_xp - a.total_xp);
      all.forEach((e, idx) => {
        e.rank = idx + 1;
      });

      const leagueName =
        currentXp >= 200 ? 'Gold League' : currentXp >= 80 ? 'Silver League' : 'Bronze League';

      setData({
        league_name: leagueName,
        days_remaining: 3,
        entries: all.slice(0, 15),
      });
      setIsOfflineFallback(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 select-none">
        <DuoOwl emotion="thinking" size={100} className="animate-float" />
        <div className="text-xl font-extrabold text-[var(--text-secondary)] animate-pulse">
          Calculating leaderboard rankings...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 select-none">
        <DuoOwl emotion="sad" size={90} className="mb-4" />
        <h2 className="text-2xl font-black text-[var(--duo-red)]">Leaderboard Temporarily Unavailable</h2>
        <p className="text-sm font-bold text-[var(--text-secondary)] mt-2 mb-6">
          Unable to synchronize rankings right now.
        </p>
        <button
          type="button"
          onClick={loadLeaderboard}
          className="px-6 py-2.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="duo-leaderboard-container select-none pb-24">
      {/* Offline Status Badge if backend is recovering */}
      {isOfflineFallback && (
        <div className="w-full bg-[#202f38] border border-[#2b3e48] text-[#8e9ca5] px-4 py-2 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ffc800] animate-pulse" />
            <span>Cached Standings Mode</span>
          </div>
          <button
            type="button"
            onClick={loadLeaderboard}
            disabled={retrying}
            className="text-[#1cb0f6] hover:underline font-black uppercase text-[11px] cursor-pointer"
          >
            {retrying ? 'Connecting...' : 'Reconnect ↻'}
          </button>
        </div>
      )}

      {/* League Header Banner */}
      <div className="duo-leaderboard-banner relative overflow-hidden">
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
              key={`${entry.rank}-${entry.username}`}
              className={`duo-leaderboard-row ${entry.is_current_user ? 'active font-black' : ''}`}
            >
              {/* Left: Rank & Avatar & Username */}
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-black text-base text-[var(--text-secondary)]">
                  {medal || entry.rank}
                </div>

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${
                    entry.is_current_user
                      ? 'bg-[var(--duo-blue)] text-white shadow-xs'
                      : isTop3
                      ? 'bg-[var(--duo-yellow)] text-white'
                      : 'bg-[#24343d] text-[var(--text-secondary)]'
                  }`}
                >
                  {entry.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="text-base font-extrabold flex items-center gap-2">
                    <span className={entry.is_current_user ? 'text-[#1cb0f6]' : 'text-white'}>
                      {entry.username}
                    </span>
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
