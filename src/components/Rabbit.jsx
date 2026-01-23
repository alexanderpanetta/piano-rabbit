import { useEffect, useState } from 'react';

/**
 * Rabbit Mascot Component
 *
 * States:
 * - neutral: Default standing pose
 * - waving: Greeting/welcoming
 * - pointing: Teaching/directing attention
 * - sad: Low score/wrong answer (droopy ears)
 * - celebrating: Correct answer/good score
 * - teaching: Explaining with book/pointer
 * - waiting: Idle with subtle animation
 */

// SVG Rabbit illustrations for each state
const RabbitSVG = ({ state }) => {
  // Base colors
  const furColor = '#8B7355';
  const furLight = '#A68B6A';
  const innerEar = '#FFB6C1';
  const belly = '#F5DEB3';
  const nose = '#FFB6C1';
  const cheeks = '#FFCCCB';

  const renderRabbit = () => {
    switch (state) {
      case 'celebrating':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full animate-celebrate">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear (raised) */}
            <ellipse cx="70" cy="60" rx="15" ry="50" fill={furColor} transform="rotate(-15 70 60)" />
            <ellipse cx="70" cy="65" rx="8" ry="35" fill={innerEar} transform="rotate(-15 70 60)" />

            {/* Right Ear (raised) */}
            <ellipse cx="130" cy="60" rx="15" ry="50" fill={furColor} transform="rotate(15 130 60)" />
            <ellipse cx="130" cy="65" rx="8" ry="35" fill={innerEar} transform="rotate(15 130 60)" />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes (happy/closed) */}
            <path d="M 75 120 Q 82 110 89 120" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 111 120 Q 118 110 125 120" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Big smile */}
            <path d="M 80 150 Q 100 175 120 150" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Arms raised */}
            <ellipse cx="45" cy="170" rx="15" ry="25" fill={furColor} transform="rotate(-30 45 170)" />
            <ellipse cx="155" cy="170" rx="15" ry="25" fill={furColor} transform="rotate(30 155 170)" />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />

            {/* Sparkles */}
            <text x="40" y="90" fontSize="20" fill="#FFD700">✨</text>
            <text x="150" y="90" fontSize="20" fill="#FFD700">✨</text>
            <text x="30" y="200" fontSize="16" fill="#FFD700">⭐</text>
            <text x="160" y="200" fontSize="16" fill="#FFD700">⭐</text>
          </svg>
        );

      case 'sad':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear (droopy) */}
            <ellipse cx="60" cy="90" rx="15" ry="45" fill={furColor} transform="rotate(-40 60 90)" />
            <ellipse cx="55" cy="95" rx="8" ry="30" fill={innerEar} transform="rotate(-40 55 95)" />

            {/* Right Ear (droopy) */}
            <ellipse cx="140" cy="90" rx="15" ry="45" fill={furColor} transform="rotate(40 140 90)" />
            <ellipse cx="145" cy="95" rx="8" ry="30" fill={innerEar} transform="rotate(40 145 95)" />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes (sad) */}
            <circle cx="82" cy="120" r="8" fill="white" />
            <circle cx="82" cy="122" r="5" fill="#333" />
            <circle cx="118" cy="120" r="8" fill="white" />
            <circle cx="118" cy="122" r="5" fill="#333" />

            {/* Eyebrows (worried) */}
            <path d="M 72 105 L 90 112" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <path d="M 128 105 L 110 112" stroke="#333" strokeWidth="2" strokeLinecap="round" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.5" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.5" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Sad mouth */}
            <path d="M 85 158 Q 100 150 115 158" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Small tear */}
            <ellipse cx="130" cy="130" rx="3" ry="5" fill="#87CEEB" opacity="0.8" />

            {/* Arms down */}
            <ellipse cx="55" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(10 55 200)" />
            <ellipse cx="145" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(-10 145 200)" />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />
          </svg>
        );

      case 'pointing':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear */}
            <ellipse cx="70" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="70" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Right Ear */}
            <ellipse cx="130" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="130" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Head (tilted slightly) */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes (looking right) */}
            <circle cx="82" cy="120" r="8" fill="white" />
            <circle cx="85" cy="120" r="5" fill="#333" />
            <circle cx="118" cy="120" r="8" fill="white" />
            <circle cx="121" cy="120" r="5" fill="#333" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Smile */}
            <path d="M 85 155 Q 100 165 115 155" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Left arm down */}
            <ellipse cx="55" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(10 55 200)" />

            {/* Right arm pointing */}
            <ellipse cx="165" cy="160" rx="15" ry="25" fill={furColor} transform="rotate(70 165 160)" />
            {/* Pointing paw */}
            <circle cx="180" cy="145" r="8" fill={furLight} />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />
          </svg>
        );

      case 'waving':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear */}
            <ellipse cx="70" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="70" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Right Ear */}
            <ellipse cx="130" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="130" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes (happy) */}
            <circle cx="82" cy="120" r="8" fill="white" />
            <circle cx="82" cy="120" r="5" fill="#333" />
            <circle cx="118" cy="120" r="8" fill="white" />
            <circle cx="118" cy="120" r="5" fill="#333" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Happy smile (open mouth) */}
            <path d="M 85 150 Q 100 168 115 150" stroke="#333" strokeWidth="2" fill="white" strokeLinecap="round" />

            {/* Left arm down */}
            <ellipse cx="55" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(10 55 200)" />

            {/* Right arm waving */}
            <g className="origin-bottom-left" style={{ animation: 'wave 0.5s ease-in-out infinite' }}>
              <ellipse cx="160" cy="150" rx="15" ry="25" fill={furColor} transform="rotate(45 160 150)" />
              <circle cx="175" cy="135" r="10" fill={furLight} />
            </g>

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />

            <style>{`
              @keyframes wave {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(15deg); }
              }
            `}</style>
          </svg>
        );

      case 'teaching':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear */}
            <ellipse cx="70" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="70" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Right Ear */}
            <ellipse cx="130" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="130" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes (attentive) */}
            <circle cx="82" cy="120" r="8" fill="white" />
            <circle cx="82" cy="120" r="5" fill="#333" />
            <circle cx="118" cy="120" r="8" fill="white" />
            <circle cx="118" cy="120" r="5" fill="#333" />

            {/* Glasses */}
            <circle cx="82" cy="120" r="12" stroke="#8B4513" strokeWidth="2" fill="none" />
            <circle cx="118" cy="120" r="12" stroke="#8B4513" strokeWidth="2" fill="none" />
            <line x1="94" y1="120" x2="106" y2="120" stroke="#8B4513" strokeWidth="2" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Smile */}
            <path d="M 85 155 Q 100 165 115 155" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Left arm holding book */}
            <ellipse cx="45" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(-20 45 200)" />
            {/* Book */}
            <rect x="20" y="200" width="40" height="30" rx="2" fill="#8B4513" />
            <rect x="22" y="202" width="17" height="26" fill="#FFF8DC" />
            <rect x="41" y="202" width="17" height="26" fill="#FFFAF0" />

            {/* Right arm with pointer */}
            <ellipse cx="165" cy="170" rx="15" ry="25" fill={furColor} transform="rotate(60 165 170)" />
            {/* Pointer stick */}
            <line x1="175" y1="150" x2="195" y2="100" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />
          </svg>
        );

      case 'waiting':
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full animate-float">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear with twitch animation */}
            <g style={{ transformOrigin: '70px 105px', animation: 'earTwitch 4s ease-in-out infinite' }}>
              <ellipse cx="70" cy="55" rx="15" ry="50" fill={furColor} />
              <ellipse cx="70" cy="60" rx="8" ry="35" fill={innerEar} />
            </g>

            {/* Right Ear */}
            <ellipse cx="130" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="130" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes with blink animation */}
            <g style={{ animation: 'blink 3s ease-in-out infinite' }}>
              <circle cx="82" cy="120" r="8" fill="white" />
              <circle cx="82" cy="120" r="5" fill="#333" />
              <circle cx="118" cy="120" r="8" fill="white" />
              <circle cx="118" cy="120" r="5" fill="#333" />
            </g>

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Gentle smile */}
            <path d="M 88 155 Q 100 162 112 155" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Arms at sides */}
            <ellipse cx="55" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(10 55 200)" />
            <ellipse cx="145" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(-10 145 200)" />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />

            <style>{`
              @keyframes earTwitch {
                0%, 90%, 100% { transform: rotate(0deg); }
                93% { transform: rotate(-8deg); }
                96% { transform: rotate(5deg); }
              }
              @keyframes blink {
                0%, 45%, 55%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.1); }
              }
            `}</style>
          </svg>
        );

      case 'neutral':
      default:
        return (
          <svg viewBox="0 0 200 280" className="w-full h-full">
            {/* Body */}
            <ellipse cx="100" cy="200" rx="50" ry="60" fill={furColor} />
            <ellipse cx="100" cy="195" rx="35" ry="40" fill={belly} />

            {/* Left Ear */}
            <ellipse cx="70" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="70" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Right Ear */}
            <ellipse cx="130" cy="55" rx="15" ry="50" fill={furColor} />
            <ellipse cx="130" cy="60" rx="8" ry="35" fill={innerEar} />

            {/* Head */}
            <circle cx="100" cy="130" r="45" fill={furColor} />
            <ellipse cx="100" cy="145" rx="30" ry="25" fill={furLight} />

            {/* Eyes */}
            <circle cx="82" cy="120" r="8" fill="white" />
            <circle cx="82" cy="120" r="5" fill="#333" />
            <circle cx="118" cy="120" r="8" fill="white" />
            <circle cx="118" cy="120" r="5" fill="#333" />

            {/* Cheeks */}
            <circle cx="65" cy="135" r="8" fill={cheeks} opacity="0.7" />
            <circle cx="135" cy="135" r="8" fill={cheeks} opacity="0.7" />

            {/* Nose */}
            <ellipse cx="100" cy="140" rx="6" ry="5" fill={nose} />

            {/* Gentle smile */}
            <path d="M 88 155 Q 100 162 112 155" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Arms at sides */}
            <ellipse cx="55" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(10 55 200)" />
            <ellipse cx="145" cy="200" rx="15" ry="25" fill={furColor} transform="rotate(-10 145 200)" />

            {/* Feet */}
            <ellipse cx="70" cy="260" rx="20" ry="12" fill={furColor} />
            <ellipse cx="130" cy="260" rx="20" ry="12" fill={furColor} />
          </svg>
        );
    }
  };

  return renderRabbit();
};

const Rabbit = ({
  state = 'neutral',
  message = '',
  size = 'medium',
  showBubble = true
}) => {
  const [currentState, setCurrentState] = useState(state);

  // Update state when prop changes
  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  // Size classes
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-32 h-44 sm:w-40 sm:h-52',
    large: 'w-48 h-64'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Speech bubble */}
      {showBubble && message && (
        <div className="speech-bubble mb-2 text-center max-w-xs sm:max-w-sm animate-bounce-in">
          <p className="text-base sm:text-lg font-semibold text-gray-800">{message}</p>
        </div>
      )}

      {/* Rabbit */}
      <div className={`${sizeClasses[size]} relative`}>
        <RabbitSVG state={currentState} />
      </div>
    </div>
  );
};

export default Rabbit;
