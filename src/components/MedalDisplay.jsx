import { useEffect, useState } from 'react';

const MedalDisplay = ({
  medal = 'none',
  score = 0,
  totalTasks = 10,
  onPlayAgain,
  onNextLevel,
  onHome,
  hasNextLevel = true
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const getMedalEmoji = () => {
    switch (medal) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '😢';
    }
  };

  const getMessage = () => {
    switch (medal) {
      case 'gold': return "Amazing! You're a piano star!";
      case 'silver': return "Great job! Keep practicing!";
      case 'bronze': return "Good effort! You can do it!";
      default: return "Let's try again!";
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.modal,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
      }}>
        {/* Score */}
        <p style={styles.scoreLabel}>You scored</p>
        <p style={styles.scoreValue}>{score}/{totalTasks}</p>

        {/* Medal */}
        <div style={styles.medalContainer}>
          <span style={styles.medal}>{getMedalEmoji()}</span>
        </div>

        {/* Message */}
        <p style={styles.message}>{getMessage()}</p>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button onClick={onPlayAgain} style={styles.secondaryButton}>
            Play Again
          </button>

          {medal !== 'none' && hasNextLevel && (
            <button onClick={onNextLevel} style={styles.primaryButton}>
              Next Level
            </button>
          )}

          <button onClick={onHome} style={styles.textButton}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
  },
  scoreLabel: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 4px 0',
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#f59e0b',
    margin: '0 0 16px 0',
  },
  medalContainer: {
    marginBottom: '16px',
  },
  medal: {
    fontSize: '80px',
  },
  message: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 24px 0',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryButton: {
    background: 'linear-gradient(to bottom, #ffd700 0%, #ffa500 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 28px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255,165,0,0.4)',
  },
  secondaryButton: {
    background: 'linear-gradient(to bottom, #6bb3f0 0%, #4a90d9 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 28px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(74,144,217,0.4)',
  },
  textButton: {
    background: 'none',
    border: 'none',
    padding: '12px',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default MedalDisplay;
