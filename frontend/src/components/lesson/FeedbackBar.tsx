'use client';

import React from 'react';
import { Button } from '../ui/Button';

interface FeedbackBarProps {
  status: 'idle' | 'correct' | 'incorrect';
  correctAnswer?: any;
  explanation?: string | null;
  onCheck: () => void;
  onContinue: () => void;
  canCheck: boolean;
  isSubmitting?: boolean;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  status,
  correctAnswer,
  explanation,
  onCheck,
  onContinue,
  canCheck,
  isSubmitting = false,
}) => {
  const praises = ['Nicely done!', 'Great job!', 'Amazing!', 'Spot on!', 'You are on fire!'];
  // Stable pick based on length
  const praise = praises[0];

  // Helper to format correct answer display
  const formatAnswer = (ans: any): string => {
    if (!ans) return '';
    if (typeof ans === 'string') return ans;
    if (typeof ans === 'object') {
      return Object.entries(ans)
        .map(([k, v]) => `${k} → ${v}`)
        .join(', ');
    }
    return String(ans);
  };

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 py-5 px-6 transition-all duration-200 select-none ${
        status === 'correct'
          ? 'bg-[var(--duo-green-light)] border-[var(--duo-green-border)]'
          : status === 'incorrect'
          ? 'bg-[var(--duo-red-light)] border-[var(--duo-red-border)]'
          : 'bg-[var(--bg-surface)] border-[var(--border-color)]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Feedback Message */}
        {status === 'idle' ? (
          <div className="hidden sm:block text-sm font-bold text-[var(--text-muted)]">
            Select or enter an answer to continue
          </div>
        ) : status === 'correct' ? (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--duo-green)] text-2xl shadow-xs shrink-0 font-black">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--duo-green-dark)]">{praise}</h3>
              {explanation && (
                <p className="text-xs font-bold text-[var(--duo-green-dark)] mt-0.5">{explanation}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--duo-red)] text-2xl shadow-xs shrink-0 font-black">
              ✕
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--duo-red-dark)]">Correct solution:</h3>
              <p className="text-base font-extrabold text-[var(--duo-red-dark)] mt-0.5">
                {formatAnswer(correctAnswer)}
              </p>
            </div>
          </div>
        )}

        {/* Right Side: Action Button */}
        <div className="w-full sm:w-auto shrink-0">
          {status === 'idle' ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canCheck || isSubmitting}
              onClick={onCheck}
            >
              {isSubmitting ? 'Checking...' : 'Check'}
            </Button>
          ) : status === 'correct' ? (
            <Button variant="primary" size="lg" fullWidth onClick={onContinue}>
              Continue
            </Button>
          ) : (
            <Button variant="danger" size="lg" fullWidth onClick={onContinue}>
              Continue
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};
