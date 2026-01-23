import { useEffect, useState } from 'react';

/**
 * Medal SVG Components
 */
const GoldMedal = () => (
  <svg viewBox="0 0 120 160" className="w-full h-full">
    {/* Ribbon */}
    <path d="M 40 0 L 60 50 L 80 0" fill="#DC143C" stroke="#B22222" strokeWidth="2" />
    <path d="M 45 0 L 60 40 L 75 0" fill="#FFFFFF" opacity="0.3" />

    {/* Medal circle */}
    <circle cx="60" cy="95" r="45" fill="url(#goldGradient)" stroke="#DAA520" strokeWidth="3" />

    {/* Inner decorative ring */}
    <circle cx="60" cy="95" r="38" fill="none" stroke="#DAA520" strokeWidth="2" />

    {/* Laurel wreath left */}
    <path d="M 30 80 Q 35 90 40 85 Q 35 95 40 100 Q 35 105 40 115" stroke="#DAA520" strokeWidth="2" fill="none" />

    {/* Laurel wreath right */}
    <path d="M 90 80 Q 85 90 80 85 Q 85 95 80 100 Q 85 105 80 115" stroke="#DAA520" strokeWidth="2" fill="none" />

    {/* Star */}
    <polygon
      points="60,65 64,78 78,78 67,86 71,100 60,91 49,100 53,86 42,78 56,78"
      fill="#FFD700"
      stroke="#DAA520"
      strokeWidth="1"
    />

    {/* Star face */}
    <circle cx="55" cy="82" r="2" fill="#333" />
    <circle cx="65" cy="82" r="2" fill="#333" />
    <path d="M 55 88 Q 60 92 65 88" stroke="#333" strokeWidth="1.5" fill="none" />

    {/* Ribbon bow */}
    <ellipse cx="45" cy="55" rx="8" ry="5" fill="#DC143C" />
    <ellipse cx="75" cy="55" rx="8" ry="5" fill="#DC143C" />

    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
    </defs>
  </svg>
);

const SilverMedal = () => (
  <svg viewBox="0 0 120 160" className="w-full h-full">
    {/* Ribbon */}
    <path d="M 40 0 L 60 50 L 80 0" fill="#4169E1" stroke="#1E90FF" strokeWidth="2" />
    <path d="M 45 0 L 60 40 L 75 0" fill="#FFFFFF" opacity="0.3" />

    {/* Medal circle - scalloped edge */}
    <circle cx="60" cy="95" r="45" fill="url(#silverGradient)" stroke="#A9A9A9" strokeWidth="3" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x = 60 + 45 * Math.cos(angle);
      const y = 95 + 45 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="4" fill="#C0C0C0" />;
    })}

    {/* Trophy cup */}
    <path
      d="M 45 80 L 45 100 Q 45 115 60 115 Q 75 115 75 100 L 75 80 Z"
      fill="#E8E8E8"
      stroke="#A9A9A9"
      strokeWidth="2"
    />
    {/* Cup handles */}
    <path d="M 45 85 Q 35 85 35 95 Q 35 100 45 100" stroke="#A9A9A9" strokeWidth="2" fill="none" />
    <path d="M 75 85 Q 85 85 85 95 Q 85 100 75 100" stroke="#A9A9A9" strokeWidth="2" fill="none" />
    {/* Cup base */}
    <rect x="50" y="115" width="20" height="5" fill="#C0C0C0" />
    <rect x="45" y="120" width="30" height="5" rx="2" fill="#A9A9A9" />

    {/* Trophy face */}
    <circle cx="53" cy="92" r="2" fill="#333" />
    <circle cx="67" cy="92" r="2" fill="#333" />
    <path d="M 53 100 Q 60 105 67 100" stroke="#333" strokeWidth="1.5" fill="none" />

    {/* Musical notes */}
    <text x="38" y="75" fontSize="12" fill="#4169E1">♪</text>
    <text x="75" y="75" fontSize="12" fill="#4169E1">♫</text>

    {/* Ribbon bow */}
    <ellipse cx="45" cy="55" rx="8" ry="5" fill="#4169E1" />
    <ellipse cx="75" cy="55" rx="8" ry="5" fill="#4169E1" />

    <defs>
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#E8E8E8" />
      </linearGradient>
    </defs>
  </svg>
);

const BronzeMedal = () => (
  <svg viewBox="0 0 120 160" className="w-full h-full">
    {/* Ribbon - checkered */}
    <path d="M 40 0 L 60 50 L 80 0" fill="#9ACD32" stroke="#6B8E23" strokeWidth="2" />
    <rect x="40" y="0" width="10" height="10" fill="#FFD700" opacity="0.5" />
    <rect x="50" y="10" width="10" height="10" fill="#FFD700" opacity="0.5" />
    <rect x="60" y="0" width="10" height="10" fill="#FFD700" opacity="0.5" />
    <rect x="70" y="10" width="10" height="10" fill="#FFD700" opacity="0.5" />

    {/* Medal circle - scalloped edge */}
    <circle cx="60" cy="95" r="45" fill="url(#bronzeGradient)" stroke="#CD853F" strokeWidth="3" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x = 60 + 45 * Math.cos(angle);
      const y = 95 + 45 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="4" fill="#D2691E" />;
    })}

    {/* Thumbs up */}
    <ellipse cx="60" cy="90" rx="20" ry="25" fill="#DEB887" stroke="#CD853F" strokeWidth="2" />
    {/* Thumb */}
    <ellipse cx="50" cy="75" rx="8" ry="15" fill="#DEB887" stroke="#CD853F" strokeWidth="2" transform="rotate(-15 50 75)" />
    {/* Fingers */}
    <rect x="55" y="100" width="5" height="15" rx="2" fill="#DEB887" stroke="#CD853F" strokeWidth="1" />
    <rect x="62" y="100" width="5" height="15" rx="2" fill="#DEB887" stroke="#CD853F" strokeWidth="1" />
    <rect x="69" y="100" width="5" height="12" rx="2" fill="#DEB887" stroke="#CD853F" strokeWidth="1" />
    <rect x="76" y="100" width="5" height="10" rx="2" fill="#DEB887" stroke="#CD853F" strokeWidth="1" />

    {/* Hearts */}
    <text x="35" y="115" fontSize="10" fill="#FF6B6B">❤</text>
    <text x="80" y="75" fontSize="10" fill="#FF6B6B">❤</text>

    {/* Ribbon bow */}
    <ellipse cx="45" cy="55" rx="8" ry="5" fill="#9ACD32" />
    <ellipse cx="75" cy="55" rx="8" ry="5" fill="#9ACD32" />

    <defs>
      <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DEB887" />
        <stop offset="50%" stopColor="#CD853F" />
        <stop offset="100%" stopColor="#DEB887" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * MedalDisplay Component
 *
 * Shows the medal earned at the end of a level with animation
 */
const MedalDisplay = ({
  medal = 'none',
  score = 0,
  totalTasks = 10,
  onPlayAgain,
  onNextLevel,
  onHome,
  hasNextLevel = true
}) => {
  const [showMedal, setShowMedal] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Stagger animations
    const medalTimer = setTimeout(() => setShowMedal(true), 300);
    const buttonTimer = setTimeout(() => setShowButtons(true), 1200);

    return () => {
      clearTimeout(medalTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const getMedalComponent = () => {
    switch (medal) {
      case 'gold':
        return <GoldMedal />;
      case 'silver':
        return <SilverMedal />;
      case 'bronze':
        return <BronzeMedal />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (medal) {
      case 'gold':
        return "Amazing! You're a piano star!";
      case 'silver':
        return "Great job! Keep practicing!";
      case 'bronze':
        return "Good effort! You can do it!";
      default:
        return "Let's try again!";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
        {/* Score display */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">You scored</p>
          <p className="text-4xl sm:text-5xl font-bold text-yellow-500">
            {score}/{totalTasks}
          </p>
        </div>

        {/* Medal */}
        {medal !== 'none' ? (
          <div
            className={`w-32 h-44 sm:w-40 sm:h-56 mx-auto mb-4 ${
              showMedal ? 'animate-medal-drop' : 'opacity-0'
            }`}
          >
            {getMedalComponent()}
          </div>
        ) : (
          <div className={`text-6xl sm:text-8xl mb-4 ${showMedal ? 'animate-bounce-in' : 'opacity-0'}`}>
            😢
          </div>
        )}

        {/* Message */}
        <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          {getMessage()}
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center ${
            showButtons ? 'animate-slide-up' : 'opacity-0'
          }`}
        >
          <button
            onClick={onPlayAgain}
            className="game-button-secondary game-button"
          >
            Play Again
          </button>

          {medal !== 'none' && hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="game-button"
            >
              Next Level
            </button>
          )}

          <button
            onClick={onHome}
            className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-800 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedalDisplay;
