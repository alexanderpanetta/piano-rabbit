import { useState, useCallback, useEffect, useRef } from 'react';
import { PIANO_KEYS, WHITE_KEYS, KEYBOARD_MAP } from '../utils/lessonData';
import { getNoteInputHandler } from '../utils/noteInputHandler';

/**
 * Interactive Piano Keyboard Component
 *
 * Features:
 * - Touch/click input for tablet and desktop
 * - Keyboard input for desktop (ASDFGHJKL keys)
 * - Visual feedback for pressed, highlighted, correct, and incorrect states
 * - Optimized for touch with large tap targets
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
  const [feedbackKeys, setFeedbackKeys] = useState(new Map()); // note -> 'correct' | 'incorrect'
  const inputHandler = useRef(getNoteInputHandler());

  // Handle touch/click on a key
  const handleKeyPress = useCallback((note) => {
    if (disabled) return;

    // Visual feedback
    setPressedKeys(prev => new Set(prev).add(note));

    // Notify parent
    onNotePlay?.(note);

    // Register with input handler
    inputHandler.current.registerTouch(note);

    // Clear press state after a short delay
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      inputHandler.current.releaseTouch(note);
    }, 150);
  }, [disabled, onNotePlay]);

  // Update feedback state when correct/incorrect props change
  useEffect(() => {
    const newFeedback = new Map();
    correctNotes.forEach(note => newFeedback.set(note, 'correct'));
    incorrectNotes.forEach(note => newFeedback.set(note, 'incorrect'));
    setFeedbackKeys(newFeedback);

    // Clear feedback after animation
    if (correctNotes.length > 0 || incorrectNotes.length > 0) {
      const timer = setTimeout(() => {
        setFeedbackKeys(new Map());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [correctNotes, incorrectNotes]);

  // Handle keyboard input for desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;

      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !e.repeat) {
        handleKeyPress(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleKeyPress]);

  // Get key state classes
  const getKeyClasses = (note, isBlack) => {
    const baseClass = isBlack ? 'piano-key-black' : 'piano-key-white';
    const classes = [baseClass];

    if (pressedKeys.has(note)) {
      classes.push('pressed');
    }

    if (highlightedNotes.includes(note)) {
      classes.push('highlighted');
    }

    if (feedbackKeys.get(note) === 'correct') {
      classes.push('correct');
    }

    if (feedbackKeys.get(note) === 'incorrect') {
      classes.push('incorrect');
    }

    return classes.join(' ');
  };

  // Calculate white key positions
  const whiteKeyWidth = 100 / WHITE_KEYS.length;

  // Calculate black key positions
  const getBlackKeyPosition = (note) => {
    // Find the white key to the left of this black key
    const noteIndex = PIANO_KEYS.findIndex(k => k.note === note);
    const prevWhiteKey = PIANO_KEYS.slice(0, noteIndex).filter(k => !k.isBlack).length;
    return prevWhiteKey * whiteKeyWidth - (whiteKeyWidth * 0.3) / 2;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div
        className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg p-2 sm:p-3 shadow-2xl"
        style={{ aspectRatio: '3/1' }}
      >
        {/* White keys */}
        <div className="relative h-full flex">
          {WHITE_KEYS.map((key, index) => (
            <button
              key={key.note}
              className={`${getKeyClasses(key.note, false)} relative flex-1 mx-0.5 sm:mx-1 flex items-end justify-center pb-2 sm:pb-4 text-gray-600 font-bold text-base sm:text-xl touch-manipulation`}
              style={{ minWidth: '40px' }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleKeyPress(key.note);
              }}
              onMouseDown={() => handleKeyPress(key.note)}
              disabled={disabled}
              aria-label={`Piano key ${key.label}`}
            >
              {showLabels && (
                <span className="pointer-events-none select-none">
                  {key.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Black keys */}
        <div className="absolute inset-0 p-2 sm:p-3 pointer-events-none">
          <div className="relative h-full">
            {PIANO_KEYS.filter(k => k.isBlack).map((key) => {
              const leftPos = getBlackKeyPosition(key.note);
              return (
                <button
                  key={key.note}
                  className={`${getKeyClasses(key.note, true)} absolute top-0 h-3/5 pointer-events-auto touch-manipulation`}
                  style={{
                    left: `${leftPos}%`,
                    width: `${whiteKeyWidth * 0.6}%`,
                    minWidth: '24px',
                    zIndex: 10
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleKeyPress(key.note);
                  }}
                  onMouseDown={() => handleKeyPress(key.note)}
                  disabled={disabled}
                  aria-label={`Piano key ${key.note}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Piano base */}
      <div className="h-4 sm:h-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-b-lg shadow-lg" />
    </div>
  );
};

export default Piano;
