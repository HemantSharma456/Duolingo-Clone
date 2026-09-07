'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

const DEFAULT_USER: User = {
  id: 1,
  username: 'learner',
  email: 'learner@duolingo.com',
  current_course_id: 2, // French default
  streak: 1,
  hearts: 3,
  max_hearts: 5,
  gems: 505,
  total_xp: 309,
  daily_xp: 25,
  daily_goal: 10,
  created_at: '2026-09-01T00:00:00Z',
};

const USER_STORAGE_KEY = 'duo_local_user';
const SUPER_STORAGE_KEY = 'duo_is_super';

interface GameContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isSuper: boolean;
  activateSuper: () => void;
  cancelSuper: () => void;
  refreshUser: () => Promise<void>;
  updateUserHearts: (hearts: number) => void;
  updateUserGems: (gemsOrDelta: number) => void;
  updateUserXp: (xpDelta: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse stored user:', e);
      }
    }
    return DEFAULT_USER;
  });

  const [isSuper, setIsSuper] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SUPER_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const saveLocalUser = (updated: User) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save user to localStorage:', e);
      }
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.getCurrentUser();
      if (data && data.id) {
        setUser(data);
        saveLocalUser(data);
        setError(null);
        return;
      }
    } catch (err: any) {
      console.warn('Backend user endpoint unreachable, keeping persistent user state:', err);
      // Keep persistent local user so UI is never left with null user
      setUser((prev) => {
        const current = prev || DEFAULT_USER;
        saveLocalUser(current);
        return current;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const updateUserHearts = (hearts: number) => {
    setUser((prev) => {
      const base = prev || DEFAULT_USER;
      const updated = { ...base, hearts: Math.max(0, Math.min(5, hearts)) };
      saveLocalUser(updated);
      return updated;
    });
  };

  const updateUserGems = (gemsOrDelta: number) => {
    setUser((prev) => {
      const base = prev || DEFAULT_USER;
      let newGems: number;
      if (gemsOrDelta < 0) {
        // Negative delta (deduction, e.g. -350, -200)
        newGems = Math.max(0, base.gems + gemsOrDelta);
      } else if (gemsOrDelta <= 100) {
        // Positive delta reward (e.g. +10, +20)
        newGems = base.gems + gemsOrDelta;
      } else {
        // Absolute assignment
        newGems = gemsOrDelta;
      }
      const updated = { ...base, gems: newGems };
      saveLocalUser(updated);
      return updated;
    });
  };

  const updateUserXp = (xpDelta: number) => {
    setUser((prev) => {
      const base = prev || DEFAULT_USER;
      const updated = { ...base, total_xp: base.total_xp + xpDelta };
      saveLocalUser(updated);
      return updated;
    });
  };

  const activateSuper = () => {
    setIsSuper(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUPER_STORAGE_KEY, 'true');
    }
    // Grant full hearts when activating Super
    updateUserHearts(5);
  };

  const cancelSuper = () => {
    setIsSuper(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUPER_STORAGE_KEY);
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        loading,
        error,
        isSuper,
        activateSuper,
        cancelSuper,
        refreshUser,
        updateUserHearts,
        updateUserGems,
        updateUserXp,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
