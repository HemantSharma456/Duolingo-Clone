'use client';

import React, { useEffect, useMemo } from 'react';
import { Exercise } from '../../types';
import { useSound } from '../../context/SoundContext';

interface MultipleChoiceProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  disabled: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  const { speak } = useSound();

  // Shuffle options so the correct answer is randomized across positions
  const options = useMemo(() => {
    if (!Array.isArray(exercise.options)) return [];
    const copy = [...exercise.options];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    // If array has multiple items and happened to remain in exact order, swap first two
    if (
      copy.length > 1 &&
      copy.every((val, idx) => {
        const orig = exercise.options[idx];
        const valText = typeof val === 'object' ? val?.text : val;
        const origText = typeof orig === 'object' ? orig?.text : orig;
        return valText === origText;
      })
    ) {
      [copy[0], copy[1]] = [copy[1], copy[0]];
    }
    return copy;
  }, [exercise.id, exercise.options]);

  // Keyboard shortcut listener for 1, 2, 3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        const item = options[num - 1];
        const val = typeof item === 'object' ? item.text : item;
        onSelect(val);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, disabled, onSelect]);

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

      {/* Speaker Button for Audio */}
      {exercise.audio_text && (
        <button
          onClick={() => speak(exercise.audio_text!)}
          className="self-start flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-[var(--duo-blue)] bg-[var(--duo-blue-light)] text-[var(--duo-blue)] font-extrabold text-sm hover:brightness-105 cursor-pointer transition-colors shadow-xs"
          title="Listen to audio"
        >
          <span className="text-xl">🔊</span>
          <span>Listen</span>
        </button>
      )}

      {/* Options Grid */}
      <div className="flex flex-col gap-3 mt-4">
        {options.map((opt: any, index: number) => {
          const text = typeof opt === 'object' ? opt.text : opt;
          const translation = typeof opt === 'object' ? opt.translation : null;
          const isSelected = selectedAnswer === text;

          return (
            <div
              key={index}
              onClick={() => {
                if (!disabled) {
                  onSelect(text);
                  speak(text);
                }
              }}
              className={`option-tile ${isSelected ? 'selected' : ''} ${disabled ? 'disabled opacity-70' : ''}`}
            >
              <div className="key-badge">{index + 1}</div>
              <div className="flex-1">
                <span className="text-lg font-extrabold block">{text}</span>
                {translation && (
                  <span className="text-xs font-semibold text-[var(--text-secondary)] block mt-0.5">
                    {translation}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
