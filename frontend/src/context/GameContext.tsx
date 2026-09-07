'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface GameContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUserHearts: (hearts: number) => void;
  updateUserGems: (gems: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.getCurrentUser();
      setUser(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load user state:', err);
      setError(err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const updateUserHearts = (hearts: number) => {
    setUser((prev) => (prev ? { ...prev, hearts } : null));
  };

  const updateUserGems = (gems: number) => {
    setUser((prev) => (prev ? { ...prev, gems } : null));
  };

  return (
    <GameContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        updateUserHearts,
        updateUserGems,
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
