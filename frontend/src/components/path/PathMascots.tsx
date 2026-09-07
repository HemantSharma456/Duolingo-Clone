'use client';

import React from 'react';

/**
 * Unit 1 Mascot: Duo standing on circular pedestal on the right of the path
 */
export const DuoStandingMascot = () => (
  <div className="w-[125px] h-[138px] select-none pointer-events-none drop-shadow-md flex items-center justify-center">
    <img
      src="/images/path-duo-transparent@2x.png"
      alt="Duo Owl on Path"
      width={130}
      height={144}
      className="w-full h-full object-contain"
      draggable={false}
    />
  </div>
);

/**
 * Unit 2 Mascot: Lily in dark monochrome/purple-tinted silhouette on the left
 */
export const LilyMascot = () => (
  <div className="flex flex-col items-center select-none pointer-events-none drop-shadow-md">
    <svg width="105" height="135" viewBox="0 0 100 130" fill="none">
      {/* Lily Body & Pose */}
      {/* Legs & boots */}
      <rect x="36" y="92" width="10" height="26" rx="4" fill="#201a29" />
      <rect x="52" y="92" width="10" height="26" rx="4" fill="#201a29" />
      <ellipse cx="41" cy="120" rx="9" ry="4" fill="#15111c" />
      <ellipse cx="57" cy="120" rx="9" ry="4" fill="#15111c" />

      {/* Skirt */}
      <path d="M30 76 L68 76 L74 94 L24 94 Z" fill="#2d2538" />

      {/* Dark Purple Sleeveless Top */}
      <path d="M34 46 L64 46 L68 78 L30 78 Z" fill="#3a3049" />
      {/* High Neck Collar */}
      <rect x="42" y="38" width="14" height="10" rx="3" fill="#2d2538" />

      {/* Arms folded / cool stance */}
      <path d="M26 50 C26 62 34 72 48 72 C58 72 72 62 72 50" stroke="#3a3049" strokeWidth="8" strokeLinecap="round" />

      {/* Head */}
      <circle cx="49" cy="30" r="16" fill="#4d415f" />

      {/* Lily's Iconic Purple Emo Bangs covering left eye */}
      <path
        d="M32 26 C32 12 44 8 58 10 C68 12 72 20 72 28 C68 28 62 26 58 32 C54 38 46 44 32 46 C30 40 32 30 32 26 Z"
        fill="#32293f"
      />
      <path
        d="M36 28 C36 42 46 54 48 56 C44 54 36 46 32 36 Z"
        fill="#261f30"
      />

      {/* Unimpressed Eye (right eye visible) */}
      <ellipse cx="56" cy="30" rx="5" ry="6" fill="#ce82ff" opacity="0.8" />
      <ellipse cx="57" cy="30" rx="3" ry="4" fill="#15111c" />
      {/* Eyelid droop */}
      <path d="M50 27 Q56 25 62 27" stroke="#32293f" strokeWidth="2.5" strokeLinecap="round" />

      {/* Neutral mouth */}
      <line x1="48" y1="40" x2="55" y2="40" stroke="#261f30" strokeWidth="2" strokeLinecap="round" />
    </svg>

    {/* Subtle pedestal shadow */}
    <div className="w-[70px] h-[12px] rounded-full bg-[#1b232a] opacity-50 -mt-2" />
  </div>
);

/**
 * Unit 3 Mascot: Oscar resting/reclining on the right with music notes
 */
export const OscarMascot = () => (
  <div className="relative flex flex-col items-center select-none pointer-events-none drop-shadow-md">
    {/* Floating Musical Notes matching screenshot */}
    <div className="absolute -top-4 left-6 flex items-center gap-2 opacity-60 text-[#607482]">
      <span className="text-sm font-black animate-bounce delay-100">♪</span>
      <span className="text-xs font-black animate-bounce">b</span>
      <span className="text-base font-black animate-bounce delay-200">♬</span>
    </div>

    <svg width="125" height="100" viewBox="0 0 120 95" fill="none">
      {/* Oscar propped up / relaxing */}
      {/* Body / Torso reclining */}
      <path
        d="M20 70 C24 50 44 42 70 46 C90 49 104 62 108 76 C95 82 35 84 20 70 Z"
        fill="#2f3d47"
      />
      {/* Scarf / Collar */}
      <path
        d="M36 50 C44 46 54 48 58 54 C52 58 40 58 36 50 Z"
        fill="#41525f"
      />

      {/* Head */}
      <circle cx="48" cy="34" r="18" fill="#3a4a55" />

      {/* Big Curled Mustache */}
      <path
        d="M34 42 C38 38 46 38 48 42 C50 38 58 38 62 42 C64 45 60 48 54 47 C48 46 44 47 38 47 C32 48 30 44 34 42 Z"
        fill="#1e272d"
      />

      {/* Eyes closed / contented */}
      <path d="M40 30 Q44 27 46 30" stroke="#1e272d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M52 30 Q54 27 58 30" stroke="#1e272d" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Hair & Sideburns */}
      <path
        d="M32 30 C30 20 40 16 52 16 C64 16 68 22 68 30 C64 26 56 24 48 24 C38 24 34 27 32 30 Z"
        fill="#243038"
      />

      {/* Propped arm / elbow on ground */}
      <path
        d="M22 64 L16 78 L34 78"
        stroke="#2f3d47"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small coffee mug next to hand */}
      <rect x="76" y="66" width="12" height="14" rx="2" fill="#4d5f6e" />
      <path d="M88 70 Q93 73 88 77" stroke="#4d5f6e" strokeWidth="2" fill="none" />
    </svg>

    {/* Subtle resting ground shadow */}
    <div className="w-[100px] h-[14px] rounded-full bg-[#172127] opacity-60 -mt-2" />
  </div>
);
