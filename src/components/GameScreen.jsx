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
        setRabbitState('neutral');
      }, 1200);
    },
    onIncorrect: () => {
      playIncorrect();
      setRabbitState('sad');
      setTimeout(() => setRabbitState('pointing'), 800);
    },
    onLevelComplete: (levelId, medal) => {
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

    if (highlightedNotes.includes(note)) {
      setCorrectFeedbackNote(note);
      setTimeout(() => setCorrectFeedbackNote(null), 300);
    } else if (gameState === GAME_STATES.PLAYING) {
      setIncorrectFeedbackNote(note);
      setTimeout(() => setIncorrectFeedbackNote(null), 300);
    }
  }, [playNote, handleNoteInput, highlightedNotes, gameState]);

  const handlePlayAgain = () => {
    setShowConfetti(false);
    setRabbitState('neutral');
    retryLevel();
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (hasNextLevel && lessons[levelId + 1]) {
      onComplete(levelId, score);
    }
  };

  const handleHome = () => {
    reset();
    onHome();
  };

  const getRabbitMessage = () => {
    if (gameState === GAME_STATES.FEEDBACK) {
      if (taskResult === TASK_RESULT.CORRECT) {
        const praises = ["Great job!", "Awesome!", "Perfect!", "You got it!"];
        return praises[Math.floor(Math.random() * praises.length)];
      } else {
        return "Try again!";
      }
    }
    return currentTask?.instruction || "Let's play!";
  };

  if (!isAudioReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 gap-4">
        <Rabbit state="waiting" message="Tap to start!" size="medium" />
        <button onClick={initAudio} className="game-button">
          Start Playing
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Confetti active={showConfetti} />

      {/* Header - fixed height */}
      <div className="flex-shrink-0">
        <ScoreDisplay
          levelName={currentLesson?.name || ''}
          currentTask={currentTaskIndex}
          totalTasks={totalTasks}
          score={score}
          onHomeClick={handleHome}
        />
      </div>

      {/* Middle section - rabbit and task */}
      <div className="flex-shrink-0 flex flex-col items-center px-4 py-2">
        <Rabbit
          state={rabbitState}
          message={getRabbitMessage()}
          size="small"
        />

        {currentTask && gameState === GAME_STATES.PLAYING && (
          <div className="mt-2">
            <TaskDisplay
              displayNotes={currentTask.displayNotes}
              taskType={currentTask.type}
              sequenceProgress={sequenceProgress}
            />
          </div>
        )}

        {gameState === GAME_STATES.FEEDBACK && (
          <div className={`text-5xl font-bold mt-2 ${
            taskResult === TASK_RESULT.CORRECT ? 'text-green-500' : 'text-red-400'
          }`}>
            {taskResult === TASK_RESULT.CORRECT ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* Piano - takes remaining space at bottom */}
      <div className="flex-1 flex items-end pb-4">
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
