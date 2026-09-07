'use client';

import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import { useSound } from '../../context/SoundContext';

interface WordBankProps {
  exercise: Exercise;
  selectedAnswer: string[];
  onSelect: (tokens: string[]) => void;
  disabled: boolean;
}

export const WordBank: React.FC<WordBankProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  const { speak, playClickSound } = useSound();
  const allTokens: string[] = Array.isArray(exercise.options) ? exercise.options : [];

  // Track which tokens from the bank are currently slotted by their unique bank index
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  // Keep internal state in sync with parent reset
  useEffect(() => {
    if (!selectedAnswer || selectedAnswer.length === 0) {
      setUsedIndices([]);
    }
  }, [selectedAnswer]);

  const handleAddToken = (word: string, index: number) => {
    if (disabled) return;
    playClickSound();
    speak(word, 'en-US');
    const newUsed = [...usedIndices, index];
    setUsedIndices(newUsed);
    onSelect(newUsed.map((i) => allTokens[i]));
  };

  const handleRemoveToken = (orderIndex: number) => {
    if (disabled) return;
    playClickSound();
    const removedBankIndex = usedIndices[orderIndex];
    const newUsed = usedIndices.filter((_, idx) => idx !== orderIndex);
    setUsedIndices(newUsed);
    onSelect(newUsed.map((i) => allTokens[i]));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 select-none animate-pop-in">
      {/* Exercise Prompt */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">
          {exercise.prompt}
        </h2>
      </div>

      {/* Target Sentence Display with Speaker */}
      <div className="flex items-center gap-4 my-2">
        {exercise.audio_text && (
          <button
            onClick={() => speak(exercise.audio_text!)}
            className="w-12 h-12 rounded-2xl bg-[var(--duo-blue)] text-white flex items-center justify-center text-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Listen to sentence"
          >
            🔊
          </button>
        )}
        <div className="p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-xl font-black text-[var(--text-primary)] shadow-xs">
          {exercise.prompt_translation || exercise.audio_text}
        </div>
      </div>

      {/* Assembly Zone (Slotted Words) */}
      <div className="min-h-[100px] border-b-2 border-dashed border-[var(--border-color)] pb-3 flex flex-wrap gap-2 items-center">
        {usedIndices.length === 0 ? (
          <span className="text-sm font-bold text-[var(--text-muted)] italic">
            Tap words below to build your translation
          </span>
        ) : (
          usedIndices.map((bankIndex, orderIdx) => (
            <button
              key={`${bankIndex}-${orderIdx}`}
              disabled={disabled}
              onClick={() => handleRemoveToken(orderIdx)}
              className="word-chip text-lg font-black border-2 border-[var(--duo-blue)] text-[var(--duo-blue)] bg-[var(--duo-blue-light)] shadow-xs animate-pop-in"
            >
              {allTokens[bankIndex]}
            </button>
          ))
        )}
      </div>

      {/* Word Bank Tile Selection Area */}
      <div className="flex flex-wrap gap-2.5 justify-center py-4">
        {allTokens.map((word, idx) => {
          const isUsed = usedIndices.includes(idx);
          return (
            <button
              key={idx}
              disabled={disabled || isUsed}
              onClick={() => handleAddToken(word, idx)}
              className={`word-chip text-base font-extrabold transition-all ${
                isUsed ? 'placeholder' : 'hover:scale-105'
              }`}
            >
              {isUsed ? 'hidden' : word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
