'use client';

import React, { useState } from 'react';

interface AudioButtonProps {
  text: string;
  langCode?: string; // 'es', 'fr', 'de', 'it', 'pt', 'ja', 'hi', 'en'
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LANG_MAP: Record<string, string> = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ja: 'ja-JP',
  hi: 'hi-IN',
  en: 'en-US',
};

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  langCode = 'es',
  size = 'md',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      // Cancel ongoing utterances
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_MAP[langCode] || langCode || 'en-US';
      utterance.rate = 0.9; // Slightly slower for language learners

      // Try to find a matching native voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(langCode));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Graceful fallback audio tone
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch {
        // Silent graceful fallback
      }
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-lg',
    lg: 'w-14 h-14 text-2xl',
  }[size];

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={`Listen to: "${text}"`}
      aria-label={`Listen to "${text}"`}
      className={`inline-flex items-center justify-center rounded-2xl border-2 border-[var(--duo-blue)] bg-[var(--duo-blue-light)] text-[var(--duo-blue-dark)] hover:bg-[var(--duo-blue)] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 ${sizeClasses} ${
        isPlaying ? 'scale-110 ring-4 ring-[var(--duo-blue)]/30' : ''
      } ${className}`}
    >
      <span className={isPlaying ? 'animate-bounce' : ''}>🔊</span>
    </button>
  );
};
