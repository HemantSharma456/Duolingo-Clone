'use client';

import React from 'react';
import { SkillPathItem } from '../../types';
import { SkillPopover } from './SkillPopover';

interface SkillNodeProps {
  skill: SkillPathItem;
  horizontalOffset: number; // in pixels (-60 to 60)
  colorTheme?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  horizontalOffset,
  colorTheme = '#58cc02',
  isOpen,
  onToggle,
  onClose,
}) => {
  const { is_unlocked, is_completed, lessons_completed, total_lessons } = skill;

  // Icon mapping
  const iconEmoji: Record<string, string> = {
    coffee: '☕',
    chat: '💬',
    apple: '🍎',
    airplane: '✈️',
    users: '👥',
    clock: '⏰',
    book: '📖',
  };

  const centerIcon = !is_unlocked
    ? '🔒'
    : is_completed
    ? '👑'
    : iconEmoji[skill.icon_name] || '⭐';

  // Progress percentage for ring
  const progressFraction = Math.min(1, lessons_completed / total_lessons);
  const strokeRadius = 46;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div
      className="relative flex flex-col items-center my-4 transition-transform select-none"
      style={{
        transform: `translateX(${horizontalOffset}px)`,
      }}
    >
      {/* Popover if open */}
      {isOpen && is_unlocked && (
        <SkillPopover
          title={skill.title}
          lessonNumber={Math.min(lessons_completed + 1, total_lessons)}
          totalLessons={total_lessons}
          isCompleted={is_completed}
          lessonId={skill.first_lesson_id ?? null}
          onClose={onClose}
        />
      )}

      {/* Outer Progress Ring & Skill Node */}
      <div className="relative cursor-pointer" onClick={is_unlocked ? onToggle : undefined}>
        {/* SVG Progress Ring */}
        {is_unlocked && !is_completed && progressFraction > 0 && (
          <svg
            className="absolute -top-3 -left-3 pointer-events-none -rotate-90"
            width="106"
            height="106"
          >
            <circle
              cx="53"
              cy="53"
              r={strokeRadius}
              stroke="var(--duo-yellow)"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
        )}

        {/* The 3D Circle Node */}
        <button
          disabled={!is_unlocked}
          className={`relative flex items-center justify-center rounded-full transition-transform active:translate-y-1 ${
            !is_unlocked
              ? 'bg-[var(--duo-gray-200)] dark:bg-[#24343d] border-b-6 border-[var(--duo-gray-300)] dark:border-[#1a272e] text-[var(--duo-gray-400)] cursor-not-allowed'
              : is_completed
              ? 'bg-[var(--duo-yellow)] border-b-6 border-[var(--duo-yellow-dark)] text-white hover:brightness-105 shadow-md'
              : 'border-b-6 hover:brightness-105 shadow-md'
          }`}
          style={{
            width: '82px',
            height: '82px',
            backgroundColor: is_unlocked && !is_completed ? colorTheme : undefined,
            borderBottomColor: is_unlocked && !is_completed ? 'rgba(0,0,0,0.25)' : undefined,
          }}
          aria-label={skill.title}
        >
          <span className="text-3xl">{centerIcon}</span>

          {/* Crown badge for completed skills */}
          {is_completed && (
            <div className="absolute -bottom-1 -right-1 bg-[var(--duo-yellow)] border-2 border-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-xs">
              ✓
            </div>
          )}
        </button>
      </div>

      {/* Skill Title Below */}
      <span
        className={`mt-2 font-extrabold text-sm text-center max-w-[120px] ${
          !is_unlocked
            ? 'text-[var(--text-muted)]'
            : is_completed
            ? 'text-[var(--duo-yellow-dark)]'
            : 'text-[var(--text-primary)]'
        }`}
      >
        {skill.title}
      </span>
    </div>
  );
};
