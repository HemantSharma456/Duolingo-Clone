import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#58cc02',
  height = 16,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={`relative w-full rounded-full overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--border-color)',
        height: `${height}px`,
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out relative"
        style={{
          width: `${clamped}%`,
          backgroundColor: color,
        }}
      >
        {/* Sleek glossy highlight */}
        {clamped > 5 && (
          <div
            className="absolute top-1 left-2 right-2 rounded-full opacity-40 bg-white"
            style={{ height: `${Math.max(2, height * 0.25)}px` }}
          />
        )}
      </div>
    </div>
  );
};
