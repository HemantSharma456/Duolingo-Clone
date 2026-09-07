'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DuoOwl } from '../mascot/DuoOwl';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';

interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefilled: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({ isOpen, onRefilled }) => {
  const router = useRouter();
  const { user, refreshUser } = useGame();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRefillGems = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.refillHearts('gems');
      await refreshUser();
      onRefilled();
    } catch (err: any) {
      setErrorMsg(err.message || 'Not enough gems to refill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="You ran out of hearts!">
      <div className="text-center py-2">
        <div className="flex justify-center mb-4">
          <DuoOwl emotion="sad" size={130} />
        </div>

        <p className="text-sm font-bold text-[var(--text-secondary)] mb-4">
          Don&apos;t worry! You can refill your hearts with gems or practice skills to keep going.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[var(--duo-red-light)] text-[var(--duo-red-dark)] text-sm font-extrabold">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="blue"
            size="md"
            fullWidth
            disabled={loading || (user?.gems ?? 0) < 350}
            onClick={handleRefillGems}
          >
            Refill Full Hearts (350 💎)
          </Button>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              router.push('/practice');
            }}
          >
            Practice to Earn Hearts (+1 ❤️)
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              router.push('/');
            }}
          >
            Quit Lesson
          </Button>
        </div>
      </div>
    </Modal>
  );
};
