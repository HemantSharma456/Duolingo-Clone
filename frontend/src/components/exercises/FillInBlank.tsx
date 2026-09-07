'use client';

import React, { useMemo } from 'react';
import { Exercise } from '../../types';
import { useSound } from '../../context/SoundContext';

interface FillInBlankProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelect: (word: string) => void;
  disabled: boolean;
}

export const FillInBlank: React.FC<FillInBlankProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  const { speak, playClickSound } = useSound();

  // Shuffle options so the correct answer is not always first
  const options: string[] = useMemo(() => {
    if (!Array.isArray(exercise.options)) return [];
    const copy = [...exercise.options];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    if (copy.length > 1 && copy.every((val, idx) => val === exercise.options[idx])) {
      [copy[0], copy[1]] = [copy[1], copy[0]];
    }
    return copy;
  }, [exercise.id, exercise.options]);
  const meta = exercise.metadata || {};
  const prefix = meta.sentence_prefix || '';
  const suffix = meta.sentence_suffix || '';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 select-none animate-pop-in">
      {/* Exercise Prompt */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">
          {exercise.prompt}
        </h2>
        {exercise.prompt_translation && (
          <p className="text-sm font-bold text-[var(--text-secondary)]">
            {exercise.prompt_translation}
          </p>
        )}
      </div>

      {/* Audio Button */}
      {exercise.audio_text && (
        <button
          onClick={() => speak(exercise.audio_text!)}
          className="self-start flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-[var(--duo-blue)] bg-[var(--duo-blue-light)] text-[var(--duo-blue)] font-extrabold text-sm hover:brightness-105 cursor-pointer shadow-xs"
        >
          <span className="text-xl">🔊</span>
          <span>Listen</span>
        </button>
      )}

      {/* Sentence with Blank Slot */}
      <div className="p-6 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-xl font-bold flex flex-wrap items-center gap-2 shadow-xs my-2">
        {prefix && <span>{prefix}</span>}
        <span
          className={`inline-block min-w-[100px] border-b-4 text-center px-3 py-1 font-black transition-all ${
            selectedAnswer
              ? 'border-[var(--duo-blue)] text-[var(--duo-blue)] bg-[var(--duo-blue-light)] rounded-xl'
              : 'border-[var(--duo-gray-400)] text-transparent'
          }`}
        >
          {selectedAnswer || '_____'}
        </span>
        {suffix && <span>{suffix}</span>}
      </div>

      {/* Selectable Options */}
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {options.map((word) => {
          const isSelected = selectedAnswer === word;
          return (
            <button
              key={word}
              disabled={disabled}
              onClick={() => {
                playClickSound();
                speak(word);
                onSelect(word);
              }}
              className={`word-chip text-lg font-black transition-all ${
                isSelected
                  ? 'border-[var(--duo-blue)] bg-[var(--duo-blue-light)] text-[var(--duo-blue)] shadow-xs scale-105'
                  : 'hover:scale-105'
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
