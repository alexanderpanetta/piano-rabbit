import { useState, useEffect, useCallback } from 'react';
import Piano from './Piano';
import MedalDisplay from './MedalDisplay';
import Confetti from './Confetti';
import { useGameState, GAME_STATES, TASK_RESULT } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudio';
import { lessons } from '../utils/lessonData';

const GameScreen = ({
  levelId,
  onComplete,
  onHome,
  hasNextLevel = true
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctFeedbackNote, setCorrectFeedbackNote] = useState(null);
  const [incorrectFeedbackNote, setIncorrectFeedbackNote] = useState(null);
  const [rabbitState, setRabbitState] = useState('neutral');

  const {
    isAudioReady,
    initAudio,
    playNote,
    playCorrect,
    playIncorrect,
    playMedalSound
  } = useAudio();

  const {
    gameState,
    currentTaskIndex,
    score,
    taskResult,
    sequenceProgress,
    currentLesson,
    currentTask,
    totalTasks,
    highlightedNotes,
    startLevel,
    handleNoteInput,
    reset,
    retryLevel
  } = useGameState({
    onCorrect: () => {
      playCorrect();
      setShowConfetti(true);
      setRabbitState('celebrating');
      setTimeout(() => {
        setShowConfetti(false);
        setRabbitState('neutral');
      }, 1200);
    },
    onIncorrect: () => {
      playIncorrect();
      setRabbitState('sad');
      setTimeout(() => setRabbitState('neutral'), 800);
    },
    onLevelComplete: (levelId, medal) => {
      playMedalSound(medal);
      setRabbitState(medal === 'gold' ? 'celebrating' : medal === 'none' ? 'sad' : 'neutral');
      if (medal === 'gold') setShowConfetti(true);
    }
  });

  useEffect(() => {
    const init = async () => {
      await initAudio();
      startLevel(levelId);
    };
    init();
    return () => reset();
  }, [levelId]);

  const handleKeyPress = useCallback((note) => {
    playNote(note);
    handleNoteInput(note);
    // Note: Visual feedback (green/red key flash) removed to avoid confusion
    // The game shows ✓ or ✗ feedback for correct/incorrect answers instead
  }, [playNote, handleNoteInput]);

  const getMessage = () => {
    if (gameState === GAME_STATES.FEEDBACK) {
      return taskResult === TASK_RESULT.CORRECT
        ? ["Great!", "Awesome!", "Perfect!"][Math.floor(Math.random() * 3)]
        : "Try again!";
    }
    return currentTask?.instruction || "Let's play!";
  };

  if (!isAudioReady) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <span style={{ fontSize: '80px' }}>🐰</span>
          <p style={styles.message}>Tap to start!</p>
          <button onClick={initAudio} style={styles.button}>
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.levelName}>{currentLesson?.name || ''}</span>
        <div style={styles.headerRight}>
          <span style={styles.progress}>📋 {currentTaskIndex + 1}/{totalTasks}</span>
          <span style={styles.score}>⭐ {score}</span>
          <button onClick={() => { reset(); onHome(); }} style={styles.homeBtn}>🏠</button>
        </div>
      </div>

      {/* Middle - instruction */}
      <div style={styles.middle}>
        <div style={styles.speechBubble}>
          <span style={{ fontSize: '50px' }}>
            {rabbitState === 'celebrating' ? '🐰🎉' : rabbitState === 'sad' ? '😢🐰' : '🐰'}
          </span>
          <p style={styles.instruction}>{getMessage()}</p>
        </div>

        {currentTask && gameState === GAME_STATES.PLAYING && (
          <div style={styles.notesDisplay}>
            {currentTask.displayNotes?.split(' ').map((note, i) => (
              <span
                key={i}
                style={{
                  ...styles.noteChip,
                  background: i < sequenceProgress.length ? '#28a745' :
                              i === sequenceProgress.length ? '#ffc107' : '#e9ecef',
                  color: i < sequenceProgress.length ? 'white' : '#333',
                }}
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {gameState === GAME_STATES.FEEDBACK && (
          <div style={{
            fontSize: '60px',
            color: taskResult === TASK_RESULT.CORRECT ? '#28a745' : '#dc3545',
          }}>
            {taskResult === TASK_RESULT.CORRECT ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* Piano */}
      <div style={styles.pianoContainer}>
        <Piano
          onNotePlay={handleKeyPress}
          highlightedNotes={gameState === GAME_STATES.PLAYING ? highlightedNotes : []}
          correctNotes={correctFeedbackNote ? [correctFeedbackNote] : []}
          incorrectNotes={incorrectFeedbackNote ? [incorrectFeedbackNote] : []}
          disabled={gameState !== GAME_STATES.PLAYING}
          showLabels={true}
        />
      </div>

      {gameState === GAME_STATES.COMPLETE && (
        <MedalDisplay
          medal={score >= 9 ? 'gold' : score >= 7 ? 'silver' : score >= 5 ? 'bronze' : 'none'}
          score={score}
          totalTasks={totalTasks}
          onPlayAgain={() => { setShowConfetti(false); setRabbitState('neutral'); retryLevel(); }}
          onNextLevel={() => { setShowConfetti(false); if (lessons[levelId + 1]) onComplete(levelId, score); }}
          onHome={() => { reset(); onHome(); }}
          hasNextLevel={hasNextLevel && !!lessons[levelId + 1]}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
    fontFamily: "'Nunito', sans-serif",
  },
  centerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid #eee',
  },
  levelName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progress: {
    fontSize: '16px',
    color: '#666',
  },
  score: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  homeBtn: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    gap: '12px',
  },
  speechBubble: {
    background: 'white',
    borderRadius: '20px',
    padding: '16px 24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center',
    maxWidth: '400px',
  },
  instruction: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '8px 0 0 0',
  },
  message: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  notesDisplay: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  noteChip: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  button: {
    background: 'linear-gradient(to bottom, #ffd700 0%, #ffa500 100%)',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255,165,0,0.4)',
  },
  pianoContainer: {
    padding: '16px 0',
  },
};

export default GameScreen;
