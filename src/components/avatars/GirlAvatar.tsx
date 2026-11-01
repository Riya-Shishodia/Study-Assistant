import React from 'react';

interface AvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

/**
 * Animated Black Widow Character Avatar
 * Features tactical crimson stealth suit, auburn hair flow, and glowing red hourglass emblem.
 */
export const GirlAvatar: React.FC<AvatarProps> = ({ 
  className = '', 
  size = 'md',
  animated = true 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-rose-900 via-neutral-900 to-red-600 p-0.5 shadow-md ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full rounded-full bg-slate-950 overflow-hidden ${animated ? 'animate-widow' : ''}`}
      >
        <defs>
          <linearGradient id="widowHair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="50%" stopColor="#9A3412" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="stealthSuit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="widowSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          <filter id="hourglassGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#EF4444" floodOpacity="0.9"/>
          </filter>
        </defs>

        {/* Ambient tactical ring */}
        <circle cx="50" cy="50" r="48" fill="#09090B" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" stroke="#DC2626" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />

        {/* Auburn flowing hair background */}
        <path d="M19 40 C 16 66, 20 88, 29 96 C 34 88, 35 70, 35 55 Z" fill="url(#widowHair)" />
        <path d="M81 40 C 84 66, 80 88, 71 96 C 66 88, 65 70, 65 55 Z" fill="url(#widowHair)" />

        {/* Tactical Kevlar / Leather Suit */}
        <path d="M18 96 C 24 72, 76 72, 82 96 Z" fill="url(#stealthSuit)" />
        <path d="M42 78 L50 96 L58 78 Z" fill="#334155" />
        <path d="M48 83 L50 96 L52 83 Z" fill="#EF4444" />

        {/* Glowing Red Black Widow Hourglass Belt / Collar Emblem */}
        <g filter="url(#hourglassGlow)" className={animated ? "animate-widow-hourglass" : ""}>
          {/* Top triangle */}
          <polygon points="46,88 54,88 50,92" fill="#EF4444" />
          {/* Bottom triangle */}
          <polygon points="46,96 54,96 50,92" fill="#EF4444" />
        </g>

        {/* Neck */}
        <rect x="44" y="60" width="12" height="15" rx="2" fill="#FDBA74" />
        {/* Tactical high collar */}
        <path d="M38 72 L44 65 L56 65 L62 72 Z" fill="#0F172A" stroke="#475569" strokeWidth="0.8" />

        {/* Face */}
        <path d="M34 39 C 34 23, 66 23, 66 39 C 66 57, 57 65, 50 65 C 43 65, 34 57, 34 39 Z" fill="url(#widowSkin)" />

        {/* Front layered Auburn hair with soft waves */}
        <path
          d="M32 38 C 30 24, 40 14, 52 14 C 65 14, 70 23, 68 36 C 64 27, 56 22, 47 24 C 39 26, 34 31, 32 38 Z"
          fill="url(#widowHair)"
        />
        <path d="M33 34 C 38 29, 50 28, 56 36 C 50 32, 41 33, 33 34 Z" fill="#7C2D12" />

        {/* Determined sharp eyebrows */}
        <path d="M37 36 Q42 33 46 36" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M54 36 Q58 33 63 36" stroke="#451A03" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Emerald green eyes with focused gaze */}
        <g className={animated ? "animate-eyes" : ""}>
          <ellipse cx="42" cy="42" rx="3.3" ry="3.7" fill="#1C1917" />
          <ellipse cx="58" cy="42" rx="3.3" ry="3.7" fill="#1C1917" />
          <circle cx="43" cy="41" r="1.1" fill="#FFFFFF" />
          <circle cx="59" cy="41" r="1.1" fill="#FFFFFF" />
          <circle cx="41.5" cy="43.5" r="0.8" fill="#10B981" />
          <circle cx="57.5" cy="43.5" r="0.8" fill="#10B981" />
        </g>

        {/* Subtle confident smirk */}
        <path d="M45 54 Q50 57 55 53" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Tactical Widow's Bite wrist Gauntlets on shoulders */}
        <circle cx="28" cy="79" r="3" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
        <circle cx="72" cy="79" r="3" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
      </svg>
      {/* Online indicator dot */}
      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
    </div>
  );
};
