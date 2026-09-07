'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';

interface ChestRewardModalProps {
  isOpen: boolean;
  chestLevel: number;
  unitNumber: number;
  isAlreadyClaimed: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export const ChestRewardModal: React.FC<ChestRewardModalProps> = ({
  isOpen,
  chestLevel,
  unitNumber,
  isAlreadyClaimed,
  onClaim,
  onClose,
}) => {
  const { updateUserGems } = useGame();
  const { playCompleteFanfare } = useSound();

  useEffect(() => {
    if (isOpen && !isAlreadyClaimed) {
      playCompleteFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffc800', '#ff9600', '#58cc02', '#1cb0f6', '#ce82ff'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen, isAlreadyClaimed, playCompleteFanfare]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[32px] bg-[#131f24] border-2 border-[#2b3a42] p-7 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chest Illustration */}
        <div className="w-24 h-20 flex items-center justify-center mb-5 drop-shadow-xl animate-bounce">
          <img
            src="/images/chest-hd.png"
            alt="Milestone Chest"
            width={96}
            height={80}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        <h3 className="text-2xl font-black text-white leading-tight mb-2">
          {isAlreadyClaimed ? 'Chest Opened!' : 'Milestone Reward!'}
        </h3>
        <p className="text-sm font-semibold text-[#8e9ca5] mb-6 max-w-[280px]">
          {isAlreadyClaimed
            ? `You already claimed the Unit ${unitNumber} Milestone Chest.`
            : `Congratulations! You unlocked the Unit ${unitNumber} Milestone Chest!`}
        </p>

        {/* Rewards Box */}
        {!isAlreadyClaimed && (
          <div className="flex items-center justify-center gap-4 w-full bg-[#1c2a32] border border-[#2e3f49] rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="font-black text-lg text-[#1cb0f6]">+20 Gems</span>
            </div>
            <div className="w-[1px] h-6 bg-[#2e3f49]" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-black text-lg text-[#ffc800]">+10 XP</span>
            </div>
          </div>
        )}

        {/* Button */}
        {isAlreadyClaimed ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-[#1f2e35] hover:bg-[#283b44] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClaim();
              updateUserGems(20);
            }}
            className="w-full h-12 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] active:translate-y-0.5 border-b-4 border-[#46a302] active:border-b-0 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            CLAIM REWARD (+20 💎)
          </button>
        )}
      </div>
    </div>
  );
};
