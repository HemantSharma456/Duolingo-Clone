'use client';

import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import { useSound } from '../../context/SoundContext';

interface MatchPairsProps {
  exercise: Exercise;
  selectedAnswer: Record<string, string> | null;
  onSelect: (matches: Record<string, string>) => void;
  disabled: boolean;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  exercise,
  onSelect,
  disabled,
}) => {
  const { speak, playClickSound, playWrongSound } = useSound();

  const rawOptions = exercise.options || {};
  const leftItems: string[] = Array.isArray(rawOptions.left) ? rawOptions.left : [];
  const rightItems: string[] = Array.isArray(rawOptions.right) ? rawOptions.right : [];

  // Track matched pairs: { leftWord: rightWord }
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedCard, setSelectedCard] = useState<{ side: 'left' | 'right'; text: string } | null>(null);
  const [wrongCard, setWrongCard] = useState<string | null>(null);

  // Shuffle right items on first mount for random pairing
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);
  useEffect(() => {
    setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
    setMatchedPairs({});
    setSelectedCard(null);
  }, [exercise]);

  const handleCardClick = (side: 'left' | 'right', text: string) => {
    if (disabled) return;
    // Check if already matched
    if (
      (side === 'left' && matchedPairs[text]) ||
      (side === 'right' && Object.values(matchedPairs).includes(text))
    ) {
      return;
    }

    playClickSound();
    speak(text);

    if (!selectedCard) {
      // First card selection
      setSelectedCard({ side, text });
      setWrongCard(null);
    } else if (selectedCard.side === side) {
      // Same side tapped again: switch selection
      setSelectedCard({ side, text });
      setWrongCard(null);
    } else {
      // Opposite side tapped! Make a pair attempt
      const leftWord = side === 'left' ? text : selectedCard.text;
      const rightWord = side === 'right' ? text : selectedCard.text;

      // Note: we can record user pair attempt and check matching
      const newMatches = { ...matchedPairs, [leftWord]: rightWord };
      setMatchedPairs(newMatches);
      setSelectedCard(null);

      // Check if all pairs have been matched
      if (Object.keys(newMatches).length === leftItems.length) {
        onSelect(newMatches);
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

      {/* Two columns for pairs */}
      <div className="grid grid-cols-2 gap-4 my-2">
        {/* Left Column (Spanish) */}
        <div className="flex flex-col gap-3">
          {leftItems.map((word) => {
            const isMatched = !!matchedPairs[word];
            const isSelected = selectedCard?.side === 'left' && selectedCard?.text === word;
            const isWrong = wrongCard === word;

            return (
              <div
                key={word}
                onClick={() => handleCardClick('left', word)}
                className={`pair-card ${
                  isMatched
                    ? 'matched'
                    : isSelected
                    ? 'selected'
                    : isWrong
                    ? 'wrong'
                    : ''
                }`}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* Right Column (English) */}
        <div className="flex flex-col gap-3">
          {(shuffledRight.length > 0 ? shuffledRight : rightItems).map((word) => {
            const isMatched = Object.values(matchedPairs).includes(word);
            const isSelected = selectedCard?.side === 'right' && selectedCard?.text === word;
            const isWrong = wrongCard === word;

            return (
              <div
                key={word}
                onClick={() => handleCardClick('right', word)}
                className={`pair-card ${
                  isMatched
                    ? 'matched'
                    : isSelected
                    ? 'selected'
                    : isWrong
                    ? 'wrong'
                    : ''
                }`}
              >
                {word}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
