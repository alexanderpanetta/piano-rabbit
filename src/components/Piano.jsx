import { useState, useCallback, useEffect, useRef } from 'react';
import { PIANO_KEYS, WHITE_KEYS, KEYBOARD_MAP } from '../utils/lessonData';
import { getNoteInputHandler } from '../utils/noteInputHandler';

/**
 * Interactive Piano Keyboard Component
 * Realistic piano layout with proper black keys
 */
const Piano = ({
  onNotePlay,
  highlightedNotes = [],
  correctNotes = [],
  incorrectNotes = [],
  disabled = false,
  showLabels = true
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [feedbackKeys, setFeedbackKeys] = useState(new Map());
  const inputHandler = useRef(getNoteInputHandler());

  const handleKeyPress = useCallback((note) => {
    if (disabled) return;
    setPressedKeys(prev => new Set(prev).add(note));
    onNotePlay?.(note);
    inputHandler.current.registerTouch(note);

    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      inputHandler.current.releaseTouch(note);
    }, 150);
  }, [disabled, onNotePlay]);

  useEffect(() => {
    const newFeedback = new Map();
    correctNotes.forEach(note => newFeedback.set(note, 'correct'));
    incorrectNotes.forEach(note => newFeedback.set(note, 'incorrect'));
    setFeedbackKeys(newFeedback);

    if (correctNotes.length > 0 || incorrectNotes.length > 0) {
      const timer = setTimeout(() => setFeedbackKeys(new Map()), 500);
      return () => clearTimeout(timer);
    }
  }, [correctNotes, incorrectNotes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !e.repeat) handleKeyPress(note);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleKeyPress]);

  const getKeyState = (note) => {
    const isPressed = pressedKeys.has(note);
    const isHighlighted = highlightedNotes.includes(note);
    const feedback = feedbackKeys.get(note);
    return { isPressed, isHighlighted, isCorrect: feedback === 'correct', isIncorrect: feedback === 'incorrect' };
  };

  // Black key positions relative to white keys (which white key it's after)
  const blackKeyPositions = {
    'C#4': 0, 'D#4': 1, 'F#4': 3, 'G#4': 4, 'A#4': 5,
    'C#5': 7, 'D#5': 8
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      {/* Piano container */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg p-3 shadow-2xl">
        {/* White keys container */}
        <div className="relative flex" style={{ height: '140px' }}>
          {WHITE_KEYS.map((key, index) => {
            const state = getKeyState(key.note);
            return (
              <button
                key={key.note}
                className={`
                  relative flex-1 mx-[1px] rounded-b-md flex items-end justify-center pb-2
                  font-bold text-sm transition-all duration-75 touch-manipulation
                  ${state.isPressed ? 'translate-y-[2px]' : ''}
                  ${state.isHighlighted
                    ? 'bg-gradient-to-b from-yellow-200 to-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                    : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'}
                  ${state.isCorrect ? 'bg-gradient-to-b from-green-200 to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : ''}
                  ${state.isIncorrect ? 'bg-gradient-to-b from-red-200 to-red-400 animate-shake' : ''}
                  border-x border-b border-gray-300
                  shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),_0_2px_4px_rgba(0,0,0,0.2)]
                `}
                onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.note); }}
                onMouseDown={() => handleKeyPress(key.note)}
                disabled={disabled}
              >
                {showLabels && (
                  <span className={`text-xs font-bold ${state.isHighlighted ? 'text-yellow-800' : 'text-gray-500'}`}>
                    {key.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Black keys overlay */}
        <div className="absolute top-3 left-3 right-3 pointer-events-none" style={{ height: '85px' }}>
          {PIANO_KEYS.filter(k => k.isBlack).map((key) => {
            const state = getKeyState(key.note);
            const whiteKeyIndex = blackKeyPositions[key.note];
            const whiteKeyWidth = 100 / WHITE_KEYS.length;
            const leftPos = (whiteKeyIndex + 1) * whiteKeyWidth - (whiteKeyWidth * 0.35);

            return (
              <button
                key={key.note}
                className={`
                  absolute top-0 h-full pointer-events-auto touch-manipulation
                  rounded-b-md transition-all duration-75
                  ${state.isPressed ? 'translate-y-[2px] brightness-90' : ''}
                  ${state.isHighlighted
                    ? 'bg-gradient-to-b from-yellow-500 to-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                    : 'bg-gradient-to-b from-gray-800 via-gray-900 to-black'}
                  ${state.isCorrect ? 'bg-gradient-to-b from-green-600 to-green-800 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : ''}
                  ${state.isIncorrect ? 'bg-gradient-to-b from-red-600 to-red-800 animate-shake' : ''}
                  shadow-[2px_4px_6px_rgba(0,0,0,0.5),_inset_0_-2px_4px_rgba(255,255,255,0.1)]
                  border-x border-b border-gray-950
                `}
                style={{
                  left: `${leftPos}%`,
                  width: `${whiteKeyWidth * 0.7}%`,
                  minWidth: '28px',
                  zIndex: 20
                }}
                onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.note); }}
                onMouseDown={() => handleKeyPress(key.note)}
                disabled={disabled}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
