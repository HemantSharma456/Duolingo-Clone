'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface SkillPopoverProps {
  title: string;
  lessonNumber: number;
  totalLessons: number;
  isCompleted?: boolean;
  lessonId: number | null;
  courseId?: number;
  onClose: () => void;
}

/**
 * Peeking Duo Owl SVG matching the exact close-up screenshot:
 * Green body, head tufts, big white eye with pupil looking left at the button,
 * and dark circular pedestal underneath.
 */
const PeekingDuo = () => (
  <div className="absolute -right-8 -bottom-3 z-[-1] pointer-events-none select-none">
    <div className="relative flex flex-col items-center">
      <svg width="84" height="100" viewBox="0 0 84 100" fill="none">
        {/* Duo Green Body peeking out */}
        <path
          d="M16 94 C6 64 12 34 32 22 C40 18 44 10 48 4 C51 14 55 12 60 16 C72 24 80 50 78 94 Z"
          fill="#58cc02"
        />
        {/* Feather Tufts on Head */}
        <path d="M44 6 Q48 0 52 6 Z" fill="#58cc02" />
        <path d="M50 8 Q55 2 58 9 Z" fill="#58cc02" />
        <path d="M36 12 Q40 6 44 13 Z" fill="#58cc02" />

        {/* Big White Eye looking at the card */}
        <ellipse cx="44" cy="46" rx="15" ry="19" fill="#ffffff" />
        {/* Dark Pupil looking left towards button */}
        <ellipse cx="39" cy="48" rx="8" ry="11" fill="#3c3c3c" />
        {/* White Catchlight */}
        <circle cx="38" cy="44" r="2.8" fill="#ffffff" />

        {/* Little Orange Beak tip peeking */}
        <polygon points="22,64 34,68 25,76" fill="#ff9600" />
      </svg>

      {/* Dark Circular Pedestal under Duo */}
      <div className="w-22 h-5 bg-[#223038] border-b-2 border-[#182329] rounded-full -mt-2.5" />
    </div>
  </div>
);

export const SkillPopover: React.FC<SkillPopoverProps> = ({
  title,
  lessonNumber,
  totalLessons,
  isCompleted = false,
  lessonId,
  courseId,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute left-1/2 -translate-x-1/2 top-[84px] z-40 w-[295px] sm:w-[325px] select-none animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Upward-pointing triangle caret touching the bottom of the star node */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[11px] border-b-[#58cc02]" />

      {/* Main Vibrant Green Card Container matching screenshot */}
      <div className="w-full rounded-[24px] bg-[#58cc02] p-5 shadow-2xl relative text-left">
        {/* Lesson Title */}
        <h4 className="text-[20px] font-black text-white leading-tight tracking-tight">
          {title || 'Order at a café'}
        </h4>

        {/* Lesson Count Subtitle */}
        <p className="text-[14px] font-bold text-white mt-1.5 mb-5">
          Lesson {lessonNumber || 1} of {totalLessons || 4}
        </p>

        {/* Elongated Pill 3D White Button with Green Text */}
        <Link
          href={`/lesson/${lessonId || 1}${courseId ? `?course_id=${courseId}` : ''}`}
          className="no-underline block"
        >
          <button
            type="button"
            className="w-full h-[52px] rounded-2xl bg-white hover:bg-[#f7f7f7] border-b-[4px] border-[#e5e5e5] active:border-b-0 active:translate-y-1 text-[#58cc02] font-black text-[15px] uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center"
          >
            {isCompleted ? 'PRACTICE +5 XP' : 'START +10 XP'}
          </button>
        </Link>

        {/* Peeking Duo Owl on the right corner */}
        <PeekingDuo />
      </div>
    </div>
  );
};
