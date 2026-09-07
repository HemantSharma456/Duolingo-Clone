'use client';

import React from 'react';

export const WhiteStarIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export const MutedStarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#384953">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export const FastForwardIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
    <path d="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" />
  </svg>
);

export const DuolingoChestIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 76,
  className = '',
}) => (
  <div
    className={`relative flex items-center justify-center select-none pointer-events-none transition-transform ${className}`}
    style={{ width: `${size}px`, height: `${Math.round(size * 0.83)}px` }}
  >
    <img
      src="/images/chest-hd.png"
      alt="Milestone Chest"
      width={size}
      height={Math.round(size * 0.83)}
      className="w-full h-full object-contain drop-shadow-md"
      draggable={false}
    />
  </div>
);

export const HeadphonesIcon: React.FC<{ color?: string }> = ({ color = '#485b68' }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill={color === 'white' ? 'white' : '#384953'} />
  </svg>
);

export const TrophyIcon: React.FC<{ color?: string }> = ({ color = '#384953' }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Cup */}
    <path d="M6 9H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V9Z" fill={color === 'white' ? 'white' : color === '#ffc800' ? '#ffc800' : '#384953'} />
    {/* Handles */}
    <path d="M6 10H4C2.89543 10 2 10.8954 2 12C2 13.6569 3.34315 15 5 15H6" />
    <path d="M18 10H20C21.1046 10 22 10.8954 22 12C22 13.6569 20.6569 15 19 15H18" />
    {/* Stem & Base */}
    <path d="M12 18V21" strokeWidth="2.5" />
    <path d="M8 21H16" strokeWidth="2.5" />
  </svg>
);

export const CompletedCheckIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Floating START pill capsule
 */
export const StartPill = () => (
  <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl bg-[#131f24] border-2 border-[#2b3a42] text-[#58cc02] font-black text-xs uppercase tracking-wider shadow-sm z-30 pointer-events-none flex items-center justify-center animate-bounce">
    START
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#2b3a42]" />
  </div>
);

/**
 * Floating OPEN pill capsule for claimable chests
 */
export const OpenPill = () => (
  <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl bg-[#131f24] border-2 border-[#ffc800] text-[#ffc800] font-black text-xs uppercase tracking-wider shadow-sm z-30 pointer-events-none flex items-center justify-center animate-bounce">
    OPEN
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#ffc800]" />
  </div>
);

/**
 * Floating JUMP HERE? pill capsule matching Screenshot 2 & 3
 */
export const JumpPill = () => (
  <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl bg-[#131f24] border-2 border-[#2b3a42] text-[#e5e5e5] font-black text-xs uppercase tracking-wider shadow-sm z-30 pointer-events-none flex items-center justify-center whitespace-nowrap">
    JUMP HERE?
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#2b3a42]" />
  </div>
);
