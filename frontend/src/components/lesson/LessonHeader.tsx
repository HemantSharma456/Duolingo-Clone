'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LessonHeaderProps {
  progress: number; // 0 to 100
  hearts: number;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({ progress, hearts }) => {
  const router = useRouter();
  const [quitModalOpen, setQuitModalOpen] = useState(false);

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4 select-none">
        {/* Close / Quit button */}
        <button
          onClick={() => setQuitModalOpen(true)}
          className="text-2xl font-black text-[var(--duo-gray-400)] hover:text-[var(--text-primary)] transition-colors p-2 cursor-pointer"
          aria-label="Quit lesson"
        >
          ✕
        </button>

        {/* Lesson Progress Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <ProgressBar progress={progress} height={16} />
        </div>

        {/* Hearts Remaining */}
        <div className="flex items-center gap-1.5 font-extrabold text-[var(--duo-red)] text-lg">
          <span className={`text-2xl ${hearts <= 1 ? 'animate-pulse' : ''}`}>❤️</span>
          <span>{hearts}</span>
        </div>
      </header>

      {/* Confirm End Session Modal matching exact screenshot */}
      {quitModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setQuitModalOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-[32px] bg-[#131f24] p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Crying Duo Mascot Illustration */}
            <div className="w-28 h-28 flex items-center justify-center mb-6 drop-shadow-md select-none pointer-events-none">
              <img
                src="/images/crying-duo-transparent@2x.png"
                alt="Wait, don't go!"
                width={112}
                height={125}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Prompt Heading */}
            <h3 className="text-[22px] sm:text-2xl font-black text-white leading-tight mb-8 max-w-[340px]">
              Wait, don&apos;t go! You&apos;ll lose your progress if you quit now
            </h3>

            {/* Actions */}
            <div className="w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => setQuitModalOpen(false)}
                className="w-full h-12 rounded-2xl bg-[#49c0f8] hover:bg-[#5dd0ff] active:translate-y-0.5 border-b-4 border-[#1899d6] active:border-b-0 text-[#131f24] font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md mb-3"
              >
                KEEP LEARNING
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuitModalOpen(false);
                  router.push('/');
                }}
                className="w-full py-2.5 text-[#ff4b4b] hover:text-[#ff6b6b] active:opacity-75 font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                END SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
