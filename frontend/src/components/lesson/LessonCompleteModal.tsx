'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DuoOwl } from '../mascot/DuoOwl';
import { useSound } from '../../context/SoundContext';
import { LessonCompleteResponse } from '../../types';

interface LessonCompleteModalProps {
  isOpen: boolean;
  result: LessonCompleteResponse | null;
  accuracy: number;
  currentLessonId?: number;
  courseId?: number;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  isOpen,
  result,
  accuracy,
  currentLessonId = 1,
  courseId,
}) => {
  const router = useRouter();
  const { playCompleteFanfare } = useSound();

  const isFinalCourseLevel = currentLessonId >= 24;
  const nextLessonId = currentLessonId + 1;
  const isNextChest = [4, 9, 16, 21].includes(nextLessonId);

  useEffect(() => {
    if (isOpen) {
      playCompleteFanfare();
      // Celebratory burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#58cc02', '#1cb0f6', '#ffc800', '#ff9600', '#ce82ff'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen, playCompleteFanfare]);

  if (!isOpen || !result) return null;

  const handleStartNextLevel = () => {
    if (isFinalCourseLevel || isNextChest) {
      router.push('/');
    } else {
      const query = courseId ? `?course_id=${courseId}` : '';
      router.push(`/lesson/${nextLessonId}${query}`);
    }
  };

  const handleBackToPath = () => {
    router.push('/');
  };

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-lg">
      <div className="text-center py-4 select-none">
        {/* Mascot */}
        <div className="flex justify-center mb-4 animate-float">
          <DuoOwl emotion="celebrating" size={140} />
        </div>

        <h2 className="text-3xl font-black text-[var(--duo-yellow-dark)] tracking-tight mb-1">
          Lesson Complete!
        </h2>
        <p className="text-sm font-bold text-[var(--text-secondary)] mb-6">
          You are making incredible progress!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* XP Card */}
          <div className="p-3 rounded-2xl border-2 border-[var(--duo-yellow-dark)] bg-[var(--duo-yellow-light)] text-center">
            <div className="text-xs font-black uppercase text-[var(--duo-yellow-dark)]">XP EARNED</div>
            <div className="text-2xl font-black text-[var(--duo-yellow-dark)] mt-1">
              +{result.xp_earned}
            </div>
          </div>

          {/* Accuracy Card */}
          <div className="p-3 rounded-2xl border-2 border-[var(--duo-green-dark)] bg-[var(--duo-green-light)] text-center">
            <div className="text-xs font-black uppercase text-[var(--duo-green-dark)]">ACCURACY</div>
            <div className="text-2xl font-black text-[var(--duo-green-dark)] mt-1">{accuracy}%</div>
          </div>

          {/* Streak Card */}
          <div className="p-3 rounded-2xl border-2 border-[var(--duo-orange-dark)] bg-[var(--duo-orange-light)] text-center">
            <div className="text-xs font-black uppercase text-[var(--duo-orange-dark)]">STREAK</div>
            <div className="text-2xl font-black text-[var(--duo-orange-dark)] mt-1 flex items-center justify-center gap-1">
              <span>🔥</span>
              <span>{result.streak}</span>
            </div>
          </div>

          {/* Gems Card */}
          <div className="p-3 rounded-2xl border-2 border-[var(--duo-blue-dark)] bg-[var(--duo-blue-light)] text-center">
            <div className="text-xs font-black uppercase text-[var(--duo-blue-dark)]">GEMS</div>
            <div className="text-2xl font-black text-[var(--duo-blue-dark)] mt-1 flex items-center justify-center gap-1">
              <span>💎</span>
              <span>+{result.gems_earned}</span>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements Banner */}
        {result.unlocked_achievements && result.unlocked_achievements.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl border-2 border-[var(--duo-purple)] bg-[var(--duo-purple-light)] dark:bg-[#2c1a38] text-center animate-pop-in">
            <div className="text-xs font-black uppercase text-[var(--duo-purple)] tracking-wider mb-1">
              🎉 Achievement Unlocked!
            </div>
            <div className="text-base font-extrabold text-[var(--text-primary)]">
              {result.unlocked_achievements.join(', ')}
            </div>
          </div>
        )}

        {/* Action Buttons: Seamless Next Level Launch & Path Return */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartNextLevel}
          >
            {isFinalCourseLevel
              ? 'VIEW COURSE TROPHY 🏆'
              : isNextChest
              ? 'CLAIM CHEST ON PATH 🎁'
              : `START LEVEL ${nextLessonId} ➔`}
          </Button>

          <button
            type="button"
            onClick={handleBackToPath}
            className="w-full h-12 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Learning Path
          </button>
        </div>
      </div>
    </Modal>
  );
};
