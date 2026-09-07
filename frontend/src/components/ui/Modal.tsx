'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full ${maxWidth} bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-3xl p-6 shadow-2xl animate-pop-in relative`}
      >
        {title && (
          <h2 className="text-2xl font-extrabold text-center mb-4 text-[var(--text-primary)]">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};
