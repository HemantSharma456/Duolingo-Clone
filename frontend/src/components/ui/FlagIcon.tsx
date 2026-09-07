'use client';

import React from 'react';

interface FlagIconProps {
  code: string; // 'es', 'fr', 'de', 'it', 'pt', 'ja', 'hi', 'en', 'ko', 'zh', 'ru', 'chess', 'math'
  size?: number; // width in px, default 32
  width?: number;
  height?: number;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  code,
  size = 32,
  width: customWidth,
  height: customHeight,
  className = '',
}) => {
  const w = customWidth || size;
  const h = customHeight || Math.round(w * 0.72);
  const normalized = (code || 'es').toLowerCase();
  const clipId = `flag-clip-${normalized}-${Math.random().toString(36).substring(2, 7)}`;

  // Common clip wrapper with rounded corners
  const renderFlag = (content: React.ReactNode) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 72"
      className={`shrink-0 overflow-hidden select-none ${className}`}
      style={{ borderRadius: `${Math.max(4, Math.round(w * 0.14))}px` }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="100" height="72" rx="14" ry="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {content}
        {/* Subtle inner highlight border */}
        <rect
          width="100"
          height="72"
          rx="14"
          ry="14"
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );

  switch (normalized) {
    case 'es': // Spain: Red / Gold / Red horizontal with authentic royal crest
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#c60b1e" />
          <rect y="18" width="100" height="36" fill="#ffc400" />
          {/* Spanish Royal Crest on left */}
          <g transform="translate(24, 25) scale(0.65)">
            {/* Crown */}
            <path d="M4 3L8 7L13 2L18 7L22 3L21 9H5L4 3Z" fill="#c60b1e" stroke="#8b0000" strokeWidth="1" />
            <circle cx="13" cy="2" r="1.5" fill="#ffc400" />
            {/* Shield */}
            <path d="M5 10H21V23C21 28 13 32 13 32C13 32 5 28 5 23V10Z" fill="#c60b1e" stroke="#8b0000" strokeWidth="1" />
            <rect x="7" y="12" width="6" height="7" fill="#c60b1e" />
            <rect x="13" y="12" width="6" height="7" fill="#ffc400" />
            <rect x="7" y="19" width="6" height="7" fill="#ffc400" />
            <rect x="13" y="19" width="6" height="7" fill="#c60b1e" />
            {/* Left Pillar */}
            <rect x="0" y="8" width="3" height="23" rx="1" fill="#e0e0e0" stroke="#9e9e9e" strokeWidth="0.5" />
            {/* Right Pillar */}
            <rect x="23" y="8" width="3" height="23" rx="1" fill="#e0e0e0" stroke="#9e9e9e" strokeWidth="0.5" />
          </g>
        </>
      );

    case 'fr': // France: Blue / White / Red vertical
      return renderFlag(
        <>
          <rect width="33.33" height="72" x="0" fill="#002395" />
          <rect width="33.34" height="72" x="33.33" fill="#ffffff" />
          <rect width="33.33" height="72" x="66.67" fill="#ed2939" />
        </>
      );

    case 'chess': // Chess: Emerald green with crisp white chess rook
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#059669" />
          <g transform="translate(30, 14) scale(1.15)">
            {/* Rook top battlements */}
            <path
              d="M5 6H11V11H15V6H21V11H25V6H31V15C31 16.5 29 18 28 19L27 30H9L8 19C7 18 5 16.5 5 15V6Z"
              fill="#ffffff"
            />
            {/* Castle door / window slit */}
            <path d="M16 21H20V26C20 27.5 16 27.5 16 26V21Z" fill="#059669" />
            {/* Base */}
            <rect x="5" y="30" width="26" height="5" rx="1.5" fill="#ffffff" />
          </g>
        </>
      );

    case 'ja': // Japan: White with centered crimson sun
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#ffffff" />
          <circle cx="50" cy="36" r="21" fill="#bc002d" />
        </>
      );

    case 'de': // Germany: Black / Red / Gold horizontal
      return renderFlag(
        <>
          <rect width="100" height="24" y="0" fill="#000000" />
          <rect width="100" height="24" y="24" fill="#dd0000" />
          <rect width="100" height="24" y="48" fill="#ffce00" />
        </>
      );

    case 'math': // Math: Cyan/Blue with + - = × symbols
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#0284c7" />
          {/* Plus top-left */}
          <g transform="translate(28, 22)">
            <rect x="-8" y="-2.5" width="16" height="5" rx="2.5" fill="#ffffff" />
            <rect x="-2.5" y="-8" width="5" height="16" rx="2.5" fill="#ffffff" />
          </g>
          {/* Minus top-right */}
          <g transform="translate(72, 22)">
            <rect x="-8" y="-2.5" width="16" height="5" rx="2.5" fill="#ffffff" />
          </g>
          {/* Equals bottom-left */}
          <g transform="translate(28, 50)">
            <rect x="-8" y="-6" width="16" height="4.5" rx="2.25" fill="#ffffff" />
            <rect x="-8" y="1.5" width="16" height="4.5" rx="2.25" fill="#ffffff" />
          </g>
          {/* Multiply bottom-right */}
          <g transform="translate(72, 50) rotate(45)">
            <rect x="-8" y="-2.5" width="16" height="5" rx="2.5" fill="#ffffff" />
            <rect x="-2.5" y="-8" width="5" height="16" rx="2.5" fill="#ffffff" />
          </g>
        </>
      );

    case 'hi': // India: Saffron / White / Green horizontal with Navy Ashoka Chakra
      return renderFlag(
        <>
          <rect width="100" height="24" y="0" fill="#ff9933" />
          <rect width="100" height="24" y="24" fill="#ffffff" />
          <rect width="100" height="24" y="48" fill="#138808" />
          {/* Ashoka Chakra */}
          <circle cx="50" cy="36" r="9.5" fill="none" stroke="#000080" strokeWidth="1.8" />
          <circle cx="50" cy="36" r="2.2" fill="#000080" />
          {/* 12 spokes simplified representation for crisp render */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="36"
              x2={50 + 9 * Math.cos((deg * Math.PI) / 180)}
              y2={36 + 9 * Math.sin((deg * Math.PI) / 180)}
              stroke="#000080"
              strokeWidth="0.9"
            />
          ))}
        </>
      );

    case 'ko': // South Korea: White with Taegeuk & 4 Trigrams
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#ffffff" />
          {/* Taegeuk Red top half */}
          <g transform="rotate(-34 50 36)">
            <path
              d="M50,21 A15,15 0 0,1 50,51 A7.5,7.5 0 0,1 50,36 A7.5,7.5 0 0,0 50,21 Z"
              fill="#cd2e3a"
            />
            {/* Taegeuk Blue bottom half */}
            <path
              d="M50,21 A7.5,7.5 0 0,1 50,36 A7.5,7.5 0 0,0 50,51 A15,15 0 0,1 50,21 Z"
              fill="#0047a0"
            />
          </g>
          {/* 4 Trigrams */}
          {/* Top-left (Geon: 3 unbroken) */}
          <g transform="translate(22, 19) rotate(35)">
            <rect x="-8" y="-5" width="16" height="2" fill="#000000" />
            <rect x="-8" y="-1" width="16" height="2" fill="#000000" />
            <rect x="-8" y="3" width="16" height="2" fill="#000000" />
          </g>
          {/* Bottom-right (Gon: 3 broken) */}
          <g transform="translate(78, 53) rotate(35)">
            <rect x="-8" y="-5" width="7" height="2" fill="#000000" />
            <rect x="1" y="-5" width="7" height="2" fill="#000000" />
            <rect x="-8" y="-1" width="7" height="2" fill="#000000" />
            <rect x="1" y="-1" width="7" height="2" fill="#000000" />
            <rect x="-8" y="3" width="7" height="2" fill="#000000" />
            <rect x="1" y="3" width="7" height="2" fill="#000000" />
          </g>
          {/* Top-right (Gam: broken, unbroken, broken) */}
          <g transform="translate(78, 19) rotate(-35)">
            <rect x="-8" y="-5" width="7" height="2" fill="#000000" />
            <rect x="1" y="-5" width="7" height="2" fill="#000000" />
            <rect x="-8" y="-1" width="16" height="2" fill="#000000" />
            <rect x="-8" y="3" width="7" height="2" fill="#000000" />
            <rect x="1" y="3" width="7" height="2" fill="#000000" />
          </g>
          {/* Bottom-left (Ri: unbroken, broken, unbroken) */}
          <g transform="translate(22, 53) rotate(-35)">
            <rect x="-8" y="-5" width="16" height="2" fill="#000000" />
            <rect x="-8" y="-1" width="7" height="2" fill="#000000" />
            <rect x="1" y="-1" width="7" height="2" fill="#000000" />
            <rect x="-8" y="3" width="16" height="2" fill="#000000" />
          </g>
        </>
      );

    case 'it': // Italy: Green / White / Red vertical
      return renderFlag(
        <>
          <rect width="33.33" height="72" x="0" fill="#009246" />
          <rect width="33.34" height="72" x="33.33" fill="#ffffff" />
          <rect width="33.33" height="72" x="66.67" fill="#ce2b37" />
        </>
      );

    case 'zh': // China: Red with gold stars
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#de2910" />
          {/* Big Star */}
          <polygon
            points="22,12 25,21 34,21 27,26 30,35 22,30 14,35 17,26 10,21 19,21"
            fill="#ffde00"
          />
          {/* 4 Small Stars */}
          <polygon points="38,9 39,12 42,12 40,14 41,17 38,15 35,17 36,14 34,12 37,12" fill="#ffde00" />
          <polygon points="44,16 45,19 48,19 46,21 47,24 44,22 41,24 42,21 40,19 43,19" fill="#ffde00" />
          <polygon points="44,26 45,29 48,29 46,31 47,34 44,32 41,34 42,31 40,29 43,29" fill="#ffde00" />
          <polygon points="38,33 39,36 42,36 40,38 41,41 38,39 35,41 36,38 34,36 37,36" fill="#ffde00" />
        </>
      );

    case 'ru': // Russia: White / Blue / Red horizontal
      return renderFlag(
        <>
          <rect width="100" height="24" y="0" fill="#ffffff" />
          <rect width="100" height="24" y="24" fill="#0039a6" />
          <rect width="100" height="24" y="48" fill="#d52b1e" />
        </>
      );

    case 'pt': // Portugal / Brazil: Green & Gold
      return renderFlag(
        <>
          <rect width="100" height="72" fill="#009c3b" />
          <polygon points="50,8 92,36 50,64 8,36" fill="#fedf00" />
          <circle cx="50" cy="36" r="16" fill="#002776" />
          <path d="M35 37 C42 33 58 35 65 39" stroke="#ffffff" strokeWidth="2.5" fill="none" />
        </>
      );

    case 'en': // United States / English
    default:
      return renderFlag(
        <>
          {/* 13 Stripes */}
          <rect width="100" height="72" fill="#b22234" />
          {[1, 3, 5, 7, 9, 11].map((i) => (
            <rect key={i} y={(i * 72) / 13} width="100" height={72 / 13} fill="#ffffff" />
          ))}
          {/* Blue Canton */}
          <rect width="44" height={(7 * 72) / 13} fill="#3c3b6e" />
          {/* Simplified 9 Stars grid */}
          {[
            [11, 7], [22, 7], [33, 7],
            [16.5, 17], [27.5, 17],
            [11, 27], [22, 27], [33, 27]
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="1.8" fill="#ffffff" />
          ))}
        </>
      );
  }
};
