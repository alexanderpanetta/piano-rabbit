import { useState } from 'react';

const WelcomeScreen = ({ isFirstTime = true, onStart, onSkipTutorial }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    "Hi! I'm Rabbit! Let's learn piano together!",
    "I'll show you which keys to play - they'll glow yellow!",
    "Tap the glowing keys to play. Ready?"
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onStart();
    }
  };

  if (!isFirstTime) {
    return (
      <div style={styles.container}>
        <span style={styles.rabbit}>🐰</span>
        <div style={styles.bubble}>
          <p style={styles.message}>Welcome back! Ready to play?</p>
        </div>
        <button onClick={onStart} style={styles.button}>
          Let's Play!
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => { onSkipTutorial?.(); onStart(); }} style={styles.skipBtn}>
        Skip
      </button>

      <span style={styles.rabbit}>🐰</span>
      <div style={styles.bubble}>
        <p style={styles.message}>{tutorialSteps[step]}</p>
      </div>

      <div style={styles.dots}>
        {tutorialSteps.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i === step ? '#ffc107' : '#ccc',
          }} />
        ))}
      </div>

      <button onClick={handleNext} style={styles.button}>
        {step === tutorialSteps.length - 1 ? "Let's Start!" : 'Next'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
    fontFamily: "'Nunito', sans-serif",
    position: 'relative',
  },
  rabbit: {
    fontSize: '100px',
  },
  bubble: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px 32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxWidth: '400px',
    textAlign: 'center',
  },
  message: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  dots: {
    display: 'flex',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  button: {
    background: 'linear-gradient(to bottom, #ffd700 0%, #ffa500 100%)',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 40px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255,165,0,0.4)',
  },
  skipBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
  },
};

export default WelcomeScreen;
