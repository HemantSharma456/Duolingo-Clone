'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Exercise } from '../../types';
import { useSound } from '../../context/SoundContext';

interface TypeAnswerProps {
  exercise: Exercise;
  selectedAnswer: string;
  onSelect: (text: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const TypeAnswer: React.FC<TypeAnswerProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  onSubmit,
  disabled,
}) => {
  const { speak } = useSound();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [exercise, disabled]);

  // Determine language-specific helper characters
  const characterHelpers = useMemo<string[]>(() => {
    const fullText = `${exercise.prompt || ''} ${exercise.prompt_translation || ''} ${exercise.audio_text || ''}`;

    // 1. Hindi: Extract unique Devanagari characters from the prompt/translation/audio
    const isHindi = /[\u0900-\u097F]/.test(fullText) || /hindi/i.test(exercise.prompt || '');
    if (isHindi) {
      const devanagariMatches = fullText.match(/[\u0900-\u097F]/g);
      if (devanagariMatches && devanagariMatches.length > 0) {
        return Array.from(new Set(devanagariMatches));
      }
      return ['ध', 'न', '्', 'य', 'व', 'ा', 'द'];
    }

    // 2. Japanese: Extract Hiragana / Katakana characters if present
    const isJapanese = /[\u3040-\u30FF\u4E00-\u9FAF]/.test(fullText) || /japanese/i.test(exercise.prompt || '');
    if (isJapanese) {
      const jpMatches = fullText.match(/[\u3040-\u30FF]/g);
      if (jpMatches && jpMatches.length > 0) {
        return Array.from(new Set(jpMatches));
      }
      return ['こ', 'ん', 'に', 'ち', 'は'];
    }

    // 3. French
    if (/french/i.test(exercise.prompt || '') || /[éèêëàâîïôùûçœ]/i.test(fullText)) {
      return ['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'ù', 'û', 'ç'];
    }

    // 4. German
    if (/german/i.test(exercise.prompt || '') || /[äöüß]/i.test(fullText)) {
      return ['ä', 'ö', 'ü', 'ß'];
    }

    // 5. Italian
    if (/italian/i.test(exercise.prompt || '') || /[àèéìòù]/i.test(fullText)) {
      return ['à', 'è', 'é', 'ì', 'ò', 'ù'];
    }

    // 6. Portuguese
    if (/portuguese/i.test(exercise.prompt || '') || /[áâãàçéêíóôõú]/i.test(fullText)) {
      return ['á', 'â', 'ã', 'à', 'ç', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú'];
    }

    // 7. Spanish
    if (/spanish/i.test(exercise.prompt || '') || /[áéíóúñ¿¡]/i.test(fullText)) {
      return ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];
    }

    // 8. English or Math: no accents needed
    if (/english/i.test(exercise.prompt || '') || /math/i.test(exercise.prompt || '')) {
      return [];
    }

    return [];
  }, [exercise]);

  const insertCharacter = (char: string) => {
    if (disabled) return;
    const nextVal = (selectedAnswer || '') + char;
    onSelect(nextVal);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedAnswer.trim().length > 0 && !disabled) {
        onSubmit();
      }
    }
  };

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

      {/* Textarea Input */}
      <div className="w-full">
        <textarea
          ref={inputRef}
          value={selectedAnswer || ''}
          onChange={(e) => onSelect(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your answer..."
          rows={3}
          className="w-full p-4 text-xl font-bold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--duo-blue)] focus:outline-none shadow-inner resize-none transition-colors"
        />
      </div>

      {/* Language-Specific Character Helpers */}
      {characterHelpers.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {characterHelpers.map((char) => (
            <button
              key={char}
              type="button"
              disabled={disabled}
              onClick={() => insertCharacter(char)}
              className="min-w-[42px] h-10 px-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] active:scale-95 text-lg font-black text-[var(--text-primary)] transition-all cursor-pointer shadow-xs flex items-center justify-center"
            >
              {char}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
