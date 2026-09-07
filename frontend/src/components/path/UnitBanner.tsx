'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface UnitBannerProps {
  unitNumber: number;
  title: string;
  description?: string;
  colorTheme: string;
}

const NotebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="13" height="16" rx="2" fill="white" fillOpacity="0.95" />
    <line x1="8" y1="6" x2="15" y2="6" stroke="#58cc02" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="9.5" x2="15" y2="9.5" stroke="#58cc02" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="13" y2="13" stroke="#58cc02" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="4" cy="5" r="1.2" fill="white" />
    <circle cx="4" cy="9" r="1.2" fill="white" />
    <circle cx="4" cy="13" r="1.2" fill="white" />
  </svg>
);

export const UnitBanner: React.FC<UnitBannerProps> = ({
  unitNumber,
  title,
  description,
  colorTheme,
}) => {
  const [guidebookOpen, setGuidebookOpen] = useState(false);
  const cleanTitle = title.replace(/^Unit\s+\d+[:\-]?\s*/i, '');

  return (
    <>
      <div
        className="w-full max-w-[580px] rounded-2xl text-white shadow-md select-none transition-transform"
        style={{
          backgroundColor: colorTheme || '#58cc02',
          padding: '20px 24px',
          marginBottom: '28px',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-black uppercase tracking-wider opacity-90 block mb-1 flex items-center gap-1.5">
              <span>←</span> SECTION 1, UNIT {unitNumber}
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
              {cleanTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setGuidebookOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider border-2 border-white/40 backdrop-blur-xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 whitespace-nowrap select-none shadow-xs"
          >
            <NotebookIcon />
            <span>GUIDEBOOK</span>
          </button>
        </div>
      </div>

      {/* Guidebook Modal */}
      <Modal
        isOpen={guidebookOpen}
        onClose={() => setGuidebookOpen(false)}
        title={`${cleanTitle} — Guidebook`}
      >
        <div className="py-2 text-[var(--text-primary)]">
          <h3 className="font-extrabold text-lg text-[var(--duo-green)] mb-2">Key Vocabulary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold mb-4 bg-[var(--bg-subtle)] p-3 rounded-xl">
            <div><strong>un café</strong> — a coffee</div>
            <div><strong>s&apos;il vous plaît</strong> — please</div>
            <div><strong>merci</strong> — thank you</div>
            <div><strong>bonjour</strong> — hello</div>
            <div><strong>un croissant</strong> — a croissant</div>
            <div><strong>l&apos;addition</strong> — the bill</div>
          </div>

          <h3 className="font-extrabold text-lg text-[var(--duo-blue)] mb-2">Grammar Tip</h3>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-6">
            In French, nouns have gender! Masculine nouns use <strong>un</strong> or <strong>le</strong>, and feminine nouns use <strong>une</strong> or <strong>la</strong>.
          </p>

          <Button variant="primary" fullWidth onClick={() => setGuidebookOpen(false)}>
            Got it!
          </Button>
        </div>
      </Modal>
    </>
  );
};
