import React from 'react';

type DuoEmotion = 'happy' | 'excited' | 'thinking' | 'sad' | 'celebrating' | 'celebrate' | 'talking';

interface DuoOwlProps {
  emotion?: DuoEmotion;
  size?: number;
  className?: string;
}

export const DuoOwl: React.FC<DuoOwlProps> = ({
  emotion = 'happy',
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Body */}
        <path
          d="M80 18C44.65 18 16 46.65 16 82C16 117.35 44.65 146 80 146C115.35 146 144 117.35 144 82C144 46.65 115.35 18 80 18Z"
          fill="#58CC02"
        />
        {/* Belly Patch */}
        <path
          d="M80 72C56 72 38 90 38 114C38 132 56 146 80 146C104 146 122 132 122 114C122 90 104 72 80 72Z"
          fill="#78D826"
        />

        {/* Belly feather marks */}
        <path
          d="M72 100C72 104 88 104 88 100"
          stroke="#46A302"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M66 116C66 120 78 120 78 116"
          stroke="#46A302"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M82 116C82 120 94 120 94 116"
          stroke="#46A302"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Feet */}
        <ellipse cx="60" cy="144" rx="14" ry="7" fill="#E58700" />
        <ellipse cx="60" cy="142" rx="14" ry="7" fill="#FF9600" />
        <ellipse cx="100" cy="144" rx="14" ry="7" fill="#E58700" />
        <ellipse cx="100" cy="142" rx="14" ry="7" fill="#FF9600" />

        {/* Wings */}
        {emotion === 'excited' || emotion === 'celebrating' ? (
          <>
            {/* Raised wings */}
            <path
              d="M20 75C10 55 5 40 18 35C30 30 38 48 30 75Z"
              fill="#46A302"
            />
            <path
              d="M140 75C150 55 155 40 142 35C130 30 122 48 130 75Z"
              fill="#46A302"
            />
          </>
        ) : emotion === 'thinking' ? (
          <>
            <path
              d="M16 88C12 100 18 116 28 114C36 112 36 94 28 84Z"
              fill="#46A302"
            />
            <path
              d="M144 88C132 80 116 78 108 86C104 90 108 98 116 98C128 98 140 104 144 88Z"
              fill="#46A302"
            />
          </>
        ) : (
          <>
            {/* Standard resting wings */}
            <path
              d="M16 88C12 102 18 120 28 118C38 116 38 96 30 84Z"
              fill="#46A302"
            />
            <path
              d="M144 88C148 102 142 120 132 118C122 116 122 96 130 84Z"
              fill="#46A302"
            />
          </>
        )}

        {/* Eye Base Rings */}
        <circle cx="56" cy="62" r="24" fill="#FFFFFF" stroke="#46A302" strokeWidth="4" />
        <circle cx="104" cy="62" r="24" fill="#FFFFFF" stroke="#46A302" strokeWidth="4" />

        {/* Pupils & Eyebrows by emotion */}
        {emotion === 'sad' ? (
          <>
            {/* Sad downturned eyebrows */}
            <path d="M40 44L68 50" stroke="#46A302" strokeWidth="4" strokeLinecap="round" />
            <path d="M120 44L92 50" stroke="#46A302" strokeWidth="4" strokeLinecap="round" />
            {/* Pupils with tears */}
            <circle cx="56" cy="66" r="10" fill="#3C3C3C" />
            <circle cx="104" cy="66" r="10" fill="#3C3C3C" />
            <circle cx="53" cy="63" r="3" fill="#FFFFFF" />
            <circle cx="101" cy="63" r="3" fill="#FFFFFF" />
            {/* Blue tears */}
            <ellipse cx="44" cy="84" rx="4" ry="7" fill="#1CB0F6" />
            <ellipse cx="116" cy="84" rx="4" ry="7" fill="#1CB0F6" />
            {/* Bandage on head */}
            <rect x="70" y="24" width="20" height="8" rx="4" fill="#FFE8CC" transform="rotate(-15 70 24)" />
          </>
        ) : emotion === 'thinking' ? (
          <>
            {/* One raised, one low eyebrow */}
            <path d="M42 42C50 38 64 42 68 46" stroke="#46A302" strokeWidth="4" strokeLinecap="round" />
            <path d="M92 46C98 42 112 40 118 44" stroke="#46A302" strokeWidth="4" strokeLinecap="round" />
            {/* Looking up */}
            <circle cx="56" cy="56" r="10" fill="#3C3C3C" />
            <circle cx="104" cy="56" r="10" fill="#3C3C3C" />
            <circle cx="54" cy="53" r="3" fill="#FFFFFF" />
            <circle cx="102" cy="53" r="3" fill="#FFFFFF" />
          </>
        ) : emotion === 'excited' || emotion === 'celebrating' ? (
          <>
            {/* Wide happy happy crescent eyes */}
            <path
              d="M44 64C44 50 68 50 68 64"
              stroke="#3C3C3C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M92 64C92 50 116 50 116 64"
              stroke="#3C3C3C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Blush cheeks */}
            <ellipse cx="42" cy="74" rx="8" ry="5" fill="#FFA5A5" opacity="0.6" />
            <ellipse cx="118" cy="74" rx="8" ry="5" fill="#FFA5A5" opacity="0.6" />
          </>
        ) : (
          <>
            {/* Normal Happy Pupils */}
            <circle cx="56" cy="62" r="11" fill="#3C3C3C" />
            <circle cx="104" cy="62" r="11" fill="#3C3C3C" />
            <circle cx="53" cy="58" r="4" fill="#FFFFFF" />
            <circle cx="101" cy="58" r="4" fill="#FFFFFF" />
            <circle cx="60" cy="65" r="2" fill="#FFFFFF" />
            <circle cx="108" cy="65" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Beak */}
        <polygon points="72,72 88,72 80,88" fill="#E58700" />
        <polygon points="72,70 88,70 80,84" fill="#FF9600" />

        {/* Celebrating Crown */}
        {emotion === 'celebrating' && (
          <path
            d="M62 26L70 12L80 22L90 12L98 26Z"
            fill="#FFC800"
            stroke="#E5B400"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
};
