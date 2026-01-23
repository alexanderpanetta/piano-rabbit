import { useState, useEffect, useCallback } from 'react';
import Piano from './Piano';
import Rabbit from './Rabbit';
import TaskDisplay from './TaskDisplay';
import ScoreDisplay from './ScoreDisplay';
import MedalDisplay from './MedalDisplay';
import Confetti from './Confetti';
import { useGameState, GAME_STATES, TASK_RESULT } from '../hooks/useGameState';
import { useAudio } from '../hooks/useAudio';
import { lessons } from '../utils/lessonData';

/**
 * GameScreen Component
 *
 * Main gameplay screen combining all game elements
 */
const GameScreen = ({
  levelId,
  onComplete,
  onHome,
  hasNextLevel = true
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctFeedbackNote, setCorrectFeedbackNote] = useState(null);
  const [incorrectFeedbackNote, setIncorrectFeedbackNote] = useState(null);
  const [rabbitState, setRabbitState] = useState('teaching');

  // Audio hook
  const {
    isAudioReady,
    initAudio,
    playNote,
    playCorrect,
    playIncorrect,
    playMedalSound
  } = useAudio();

  // Game state hook
  const {
    gameState,
    currentTaskIndex,
    score,
    taskResult,
    sequenceProgress,
    retriesLeft,
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
        setRabbitState('teaching');
      }, 1200);
    },
    onIncorrect: () => {
      playIncorrect();
      setRabbitState('sad');
      setTimeout(() => {
        setRabbitState('pointing');
      }, 800);
    },
    onLevelComplete: (levelId, medal, finalScore) => {
      playMedalSound(medal);
      if (medal === 'gold') {
        setShowConfetti(true);
        setRabbitState('celebrating');
      } else if (medal === 'none') {
        setRabbitState('sad');
      } else {
        setRabbitState('waving');
      }
    }
  });

  // Initialize audio and start level
  useEffect(() => {
    const init = async () => {
      await initAudio();
      startLevel(levelId);
    };
    init();

    return () => {
      reset();
    };
  }, [levelId]);

  // Handle piano key press
  const handleKeyPress = useCallback((note) => {
    // Play the note sound
    playNote(note);

    // Process the note for game logic
    handleNoteInput(note);

    // Visual feedback
    if (highlightedNotes.includes(note)) {
      setCorrectFeedbackNote(note);
      setTimeout(() => setCorrectFeedbackNote(null), 300);
    } else if (gameState === GAME_STATES.PLAYING) {
      setIncorrectFeedbackNote(note);
      setTimeout(() => setIncorrectFeedbackNote(null), 300);
    }
  }, [playNote, handleNoteInput, highlightedNotes, gameState]);

  // Handle level completion actions
  const handlePlayAgain = () => {
    setShowConfetti(false);
    setRabbitState('teaching');
    retryLevel();
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (hasNextLevel) {
      const nextLevelId = levelId + 1;
      if (lessons[nextLevelId]) {
        onComplete(levelId, score);
      }
    }
  };

  const handleHome = () => {
    reset();
    onHome();
  };

  // Get rabbit message based on game state
  const getRabbitMessage = () => {
    if (gameState === GAME_STATES.FEEDBACK) {
      if (taskResult === TASK_RESULT.CORRECT) {
        const praises = ["Great job!", "Awesome!", "Perfect!", "Well done!", "You got it!"];
        return praises[Math.floor(Math.random() * praises.length)];
      } else {
        const encouragements = ["Try again!", "You can do it!", "Keep going!", "Almost!"];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
      }
    }

    if (currentTask) {
      return currentTask.instruction;
    }

    return "Let's play!";
  };

  // Audio not ready - show loading
  if (!isAudioReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Rabbit state="waiting" message="Loading sounds..." size="large" />
        <button
          onClick={initAudio}
          className="game-button mt-4"
        >
          Tap to Start
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* Header */}
      <ScoreDisplay
        levelName={currentLesson?.name || ''}
        currentTask={currentTaskIndex}
        totalTasks={totalTasks}
        score={score}
        onHomeClick={handleHome}
      />

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-4">
        {/* Rabbit and instruction */}
        <div className="flex flex-col items-center">
          <Rabbit
            state={rabbitState}
            message={getRabbitMessage()}
            size="medium"
          />
        </div>

        {/* Task display */}
        {currentTask && gameState === GAME_STATES.PLAYING && (
          <TaskDisplay
            instruction=""
            displayNotes={currentTask.displayNotes}
            taskType={currentTask.type}
            sequenceProgress={sequenceProgress}
            totalNotes={currentTask.notes?.length || 1}
          />
        )}

        {/* Retries indicator for sequences/diads */}
        {currentTask?.type !== 'single' && retriesLeft < 2 && gameState === GAME_STATES.PLAYING && (
          <div className="text-sm text-gray-500">
            {retriesLeft === 1 ? '1 try left' : 'Last try!'}
          </div>
        )}

        {/* Feedback display */}
        {gameState === GAME_STATES.FEEDBACK && (
          <div className={`text-4xl sm:text-5xl font-bold animate-bounce-in ${
            taskResult === TASK_RESULT.CORRECT ? 'text-green-500' : 'text-red-400'
          }`}>
            {taskResult === TASK_RESULT.CORRECT ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* Piano */}
      <div className="pb-4 sm:pb-8">
        <Piano
          onNotePlay={handleKeyPress}
          highlightedNotes={gameState === GAME_STATES.PLAYING ? highlightedNotes : []}
          correctNotes={correctFeedbackNote ? [correctFeedbackNote] : []}
          incorrectNotes={incorrectFeedbackNote ? [incorrectFeedbackNote] : []}
          disabled={gameState !== GAME_STATES.PLAYING}
          showLabels={true}
        />
      </div>

      {/* Level complete modal */}
      {gameState === GAME_STATES.COMPLETE && (
        <MedalDisplay
          medal={score >= 9 ? 'gold' : score >= 7 ? 'silver' : score >= 5 ? 'bronze' : 'none'}
          score={score}
          totalTasks={totalTasks}
          onPlayAgain={handlePlayAgain}
          onNextLevel={handleNextLevel}
          onHome={handleHome}
          hasNextLevel={hasNextLevel && !!lessons[levelId + 1]}
        />
      )}
    </div>
  );
};

export default GameScreen;
