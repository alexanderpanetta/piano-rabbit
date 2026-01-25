import { useState, useCallback, useEffect } from 'react';
import { PIANO_KEYS, WHITE_KEYS, KEYBOARD_MAP } from '../utils/lessonData';

const Piano = ({
  onNotePlay,
  highlightedNotes = [],
  correctNotes = [],
  incorrectNotes = [],
  disabled = false,
  showLabels = true
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const handleKeyPress = useCallback((note) => {
    if (disabled) return;
    setPressedKeys(prev => new Set(prev).add(note));
    onNotePlay?.(note);

    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    }, 150);
  }, [disabled, onNotePlay]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !e.repeat) handleKeyPress(note);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleKeyPress]);

  const getWhiteKeyStyle = (note) => {
    const isPressed = pressedKeys.has(note);
    const isHighlighted = highlightedNotes.includes(note);
    const isCorrect = correctNotes.includes(note);
    const isIncorrect = incorrectNotes.includes(note);

    let background = 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)';
    let boxShadow = '0 4px 6px rgba(0,0,0,0.1), inset 0 -4px 6px rgba(0,0,0,0.05)';

    if (isHighlighted) {
      background = 'linear-gradient(to bottom, #fff3cd 0%, #ffc107 100%)';
      boxShadow = '0 0 20px rgba(255,193,7,0.8), 0 4px 6px rgba(0,0,0,0.1)';
    }
    if (isCorrect) {
      background = 'linear-gradient(to bottom, #d4edda 0%, #28a745 100%)';
      boxShadow = '0 0 20px rgba(40,167,69,0.8)';
    }
    if (isIncorrect) {
      background = 'linear-gradient(to bottom, #f8d7da 0%, #dc3545 100%)';
    }
    if (isPressed) {
      boxShadow = 'inset 0 4px 6px rgba(0,0,0,0.2)';
    }

    return {
      flex: 1,
      height: '100%',
      background,
      boxShadow,
      border: '1px solid #ccc',
      borderRadius: '0 0 8px 8px',
      margin: '0 1px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '8px',
      transition: 'all 0.1s ease',
      transform: isPressed ? 'translateY(2px)' : 'none',
    };
  };

  const getBlackKeyStyle = (note) => {
    const isPressed = pressedKeys.has(note);
    const isHighlighted = highlightedNotes.includes(note);
    const isCorrect = correctNotes.includes(note);
    const isIncorrect = incorrectNotes.includes(note);

    let background = 'linear-gradient(to bottom, #333 0%, #000 100%)';
    let boxShadow = '2px 4px 6px rgba(0,0,0,0.5)';

    if (isHighlighted) {
      background = 'linear-gradient(to bottom, #d4a500 0%, #b8860b 100%)';
      boxShadow = '0 0 15px rgba(255,193,7,0.8), 2px 4px 6px rgba(0,0,0,0.5)';
    }
    if (isCorrect) {
      background = 'linear-gradient(to bottom, #1e7e34 0%, #155724 100%)';
      boxShadow = '0 0 15px rgba(40,167,69,0.8)';
    }
    if (isIncorrect) {
      background = 'linear-gradient(to bottom, #c82333 0%, #721c24 100%)';
    }
    if (isPressed) {
      boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
    }

    return {
      position: 'absolute',
      width: '8%',
      height: '60%',
      background,
      boxShadow,
      borderRadius: '0 0 4px 4px',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.1s ease',
      transform: isPressed ? 'translateY(2px)' : 'none',
    };
  };

  // Black key positions (percentage from left, after which white key index)
  const blackKeyPositions = {
    'C#4': 7.5,
    'D#4': 17,
    'F#4': 36,
    'G#4': 45.5,
    'A#4': 55,
    'C#5': 74,
    'D#5': 83.5,
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 8px' }}>
      {/* Piano frame */}
      <div style={{
        background: 'linear-gradient(to bottom, #2d2d2d 0%, #1a1a1a 100%)',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        {/* Keys container */}
        <div style={{ position: 'relative', height: '180px', display: 'flex' }}>
          {/* White keys */}
          {WHITE_KEYS.map((key) => (
            <button
              key={key.note}
              style={getWhiteKeyStyle(key.note)}
              onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.note); }}
              onMouseDown={() => handleKeyPress(key.note)}
              disabled={disabled}
            >
              {showLabels && (
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: highlightedNotes.includes(key.note) ? '#856404' : '#666',
                  userSelect: 'none',
                }}>
                  {key.label}
                </span>
              )}
            </button>
          ))}

          {/* Black keys */}
          {PIANO_KEYS.filter(k => k.isBlack).map((key) => (
            <button
              key={key.note}
              style={{
                ...getBlackKeyStyle(key.note),
                left: `${blackKeyPositions[key.note]}%`,
              }}
              onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.note); }}
              onMouseDown={() => handleKeyPress(key.note)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
