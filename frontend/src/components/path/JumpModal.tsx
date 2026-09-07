'use client';

import React from 'react';
import Link from 'next/link';

interface JumpModalProps {
  isOpen: boolean;
  unitNumber: number;
  title: string;
  colorTheme: string;
  onClose: () => void;
  onJump?: () => void;
}

export const JumpModal: React.FC<JumpModalProps> = ({
  isOpen,
  unitNumber,
  title,
  colorTheme,
  onClose,
  onJump,
}) => {
  if (!isOpen) return null;

  const targetLevel = (unitNumber - 1) * 6 + 1;

  const handleStartTest = () => {
    if (onJump) onJump();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#131f24] border-2 border-[#2b3a42] p-6 shadow-2xl relative text-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fast-forward Icon Badge */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg border-b-4"
          style={{ backgroundColor: colorTheme, borderColor: 'rgba(0,0,0,0.2)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" />
          </svg>
        </div>

        <h3 className="text-xl font-black text-white mb-2">
          Jump to Unit {unitNumber}?
        </h3>
        <p className="text-sm font-semibold text-[#8e9ca5] mb-6">
          Pass the test to jump ahead to <strong className="text-white font-extrabold">{title}</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <Link href={`/lesson/${targetLevel}`} className="no-underline block" onClick={handleStartTest}>
            <button
              type="button"
              className="w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:brightness-110 active:translate-y-0.5 border-b-4"
              style={{ backgroundColor: colorTheme, borderColor: 'rgba(0,0,0,0.25)' }}
            >
              START TEST (+50 XP)
            </button>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-2xl bg-[#1f2e35] hover:bg-[#283b44] text-[#8e9ca5] hover:text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            MAYBE LATER
          </button>
        </div>
      </div>
    </div>
  );
};
