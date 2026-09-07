'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playCorrectSound: () => void;
  playWrongSound: () => void;
  playClickSound: () => void;
  playCompleteFanfare: () => void;
  speak: (text: string, lang?: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('duo_sound_enabled');
    if (saved !== null) {
      setSoundEnabled(saved === 'true');
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('duo_sound_enabled', String(next));
      return next;
    });
  };

  // Web Audio synthesizer helper
  const getAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  }, []);

  const playCorrectSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [soundEnabled, getAudioContext]);

  const playWrongSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [soundEnabled, getAudioContext]);

  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [soundEnabled, getAudioContext]);

  const playCompleteFanfare = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chordNotes = [
        { f: 523.25, t: 0.0 }, // C5
        { f: 659.25, t: 0.12 }, // E5
        { f: 783.99, t: 0.24 }, // G5
        { f: 1046.5, t: 0.4 }, // C6
        { f: 1318.5, t: 0.55 }, // E6
      ];

      const now = ctx.currentTime;
      chordNotes.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.6);
      });
    } catch (e) {
      console.warn('Fanfare error:', e);
    }
  }, [soundEnabled, getAudioContext]);

  const speak = useCallback(
    (text: string, lang?: string) => {
      if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap: Record<string, string> = {
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
          it: 'it-IT',
          pt: 'pt-BR',
          ja: 'ja-JP',
          hi: 'hi-IN',
          en: 'en-US',
        };
        const resolved = (lang && langMap[lang]) || lang || 'en-US';
        utterance.lang = resolved;
        utterance.rate = 0.9; // Slightly slower for language learners
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('TTS error:', e);
      }
    },
    [soundEnabled]
  );

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playCorrectSound,
        playWrongSound,
        playClickSound,
        playCompleteFanfare,
        speak,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
