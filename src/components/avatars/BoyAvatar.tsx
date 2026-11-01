import React from 'react';

interface AvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

/**
 * Animated Iron Man Character Avatar
 * Features moving arc reactor core pulse and illuminated HUD eyes.
 */
export const BoyAvatar: React.FC<AvatarProps> = ({ 
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
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-rose-700 p-0.5 shadow-md ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full rounded-full bg-slate-950 overflow-hidden ${animated ? 'animate-ironman' : ''}`}
      >
        <defs>
          <linearGradient id="ironCrimson" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
          <linearGradient id="ironGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>
          <filter id="ironReactorGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.9"/>
          </filter>
        </defs>

        {/* Outer armored tech ring */}
        <circle cx="50" cy="50" r="48" fill="#180407" stroke="#DC2626" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />

        {/* Armored shoulders with gold accents */}
        <path d="M15 96 C 22 72, 78 72, 85 96 Z" fill="url(#ironCrimson)" />
        <path d="M28 85 L40 76 L44 96 Z" fill="url(#ironGold)" opacity="0.9" />
        <path d="M72 85 L60 76 L56 96 Z" fill="url(#ironGold)" opacity="0.9" />

        {/* Glowing Arc Reactor in chest */}
        <g filter="url(#ironReactorGlow)" className={animated ? "animate-reactor" : ""}>
          <circle cx="50" cy="88" r="6.5" fill="url(#arcGlow)" />
          <circle cx="50" cy="88" r="8" stroke="#38BDF8" strokeWidth="1.2" fill="none" opacity="0.8" />
          <line x1="50" y1="81" x2="50" y2="95" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
          <line x1="43" y1="88" x2="57" y2="88" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
        </g>

        {/* Neck connector */}
        <rect x="44" y="60" width="12" height="10" rx="2" fill="#7F1D1D" />

        {/* Helmet Outer Shell - Crimson */}
        <path
          d="M26 40 C 26 21, 74 21, 74 40 C 74 58, 64 68, 50 68 C 36 68, 26 58, 26 40 Z"
          fill="url(#ironCrimson)"
        />

        {/* Helmet Faceplate - Gold Titanium */}
        <path
          d="M33 34 L67 34 L66 50 L58 64 L42 64 L34 50 Z"
          fill="url(#ironGold)"
          stroke="#B45309"
          strokeWidth="1"
        />

        {/* Brow Crest Line */}
        <polygon points="41,34 50,39 59,34 50,32" fill="#991B1B" />

        {/* Helmet Cheek Cavities */}
        <polygon points="34,44 40,46 38,55 33,52" fill="#991B1B" opacity="0.85" />
        <polygon points="66,44 60,46 62,55 67,52" fill="#991B1B" opacity="0.85" />

        {/* Mouth Plate line */}
        <rect x="44" y="58" width="12" height="2" rx="0.5" fill="#78350F" />

        {/* Cyan Glowing Eyes / HUD Optics */}
        <g className={animated ? "animate-hud-eyes" : ""}>
          {/* Left Eye */}
          <polygon points="37,42 46,43 45,46 38,45" fill="#FFFFFF" filter="url(#ironReactorGlow)" />
          {/* Right Eye */}
          <polygon points="63,42 54,43 55,46 62,45" fill="#FFFFFF" filter="url(#ironReactorGlow)" />
        </g>
      </svg>
      {/* Online indicator dot */}
      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-white" />
    </div>
  );
};
