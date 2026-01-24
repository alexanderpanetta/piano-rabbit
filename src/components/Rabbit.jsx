import { useEffect, useState } from 'react';

/**
 * Simple Rabbit Mascot - emoji-based for reliability
 * States: neutral, waving, pointing, sad, celebrating, teaching, waiting
 */
const Rabbit = ({
  state = 'neutral',
  message = '',
  size = 'medium',
  showBubble = true
}) => {
  const [currentState, setCurrentState] = useState(state);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  // Fixed pixel sizes that won't break layout
  const sizes = {
    small: 60,
    medium: 80,
    large: 100
  };

  const pixelSize = sizes[size] || sizes.medium;

  // Get emoji and animation based on state
  const getEmoji = () => {
    switch (currentState) {
      case 'celebrating': return '🐰';
      case 'sad': return '🐰';
      case 'waving': return '🐰';
      case 'pointing': return '🐰';
      case 'teaching': return '🐰';
      case 'waiting': return '🐰';
      default: return '🐰';
    }
  };

  const getAnimation = () => {
    switch (currentState) {
      case 'celebrating': return 'animate-bounce';
      case 'sad': return '';
      case 'waving': return 'animate-pulse';
      case 'waiting': return 'animate-pulse';
      default: return '';
    }
  };

  const getExpression = () => {
    switch (currentState) {
      case 'celebrating': return '🎉';
      case 'sad': return '😢';
      case 'pointing': return '👉';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Speech bubble */}
      {showBubble && message && (
        <div className="bg-white rounded-2xl px-4 py-2 shadow-lg max-w-sm text-center relative">
          <p className="text-base font-semibold text-gray-800">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
        </div>
      )}

      {/* Rabbit emoji with expression */}
      <div className={`flex items-center gap-1 ${getAnimation()}`}>
        {currentState === 'sad' && <span className="text-2xl">😢</span>}
        <span style={{ fontSize: `${pixelSize}px`, lineHeight: 1 }}>
          {getEmoji()}
        </span>
        {currentState === 'celebrating' && <span className="text-2xl">🎉</span>}
        {currentState === 'pointing' && <span className="text-2xl">👉</span>}
      </div>
    </div>
  );
};

export default Rabbit;
