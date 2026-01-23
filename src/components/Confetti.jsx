import { useEffect, useState } from 'react';

/**
 * Confetti Component
 *
 * Creates a confetti animation for celebrations
 */
const Confetti = ({ active = false, duration = 3000 }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // Generate confetti pieces
    const colors = [
      '#FFD700', // Gold
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8'  // Mint
    ];

    const shapes = ['square', 'circle', 'triangle'];

    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360
    }));

    setPieces(newPieces);

    // Clear after duration
    const timer = setTimeout(() => {
      setPieces([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!active || pieces.length === 0) return null;

  const renderShape = (piece) => {
    const baseStyle = {
      width: piece.size,
      height: piece.size,
      backgroundColor: piece.color,
      transform: `rotate(${piece.rotation}deg)`
    };

    switch (piece.shape) {
      case 'circle':
        return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
              transform: `rotate(${piece.rotation}deg)`
            }}
          />
        );
      case 'square':
      default:
        return <div style={{ ...baseStyle, borderRadius: '2px' }} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        >
          {renderShape(piece)}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
