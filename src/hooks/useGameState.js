import { useState, useCallback, useRef, useEffect } from 'react';
import { lessons, getMedalForScore } from '../utils/lessonData';
import { getNoteInputHandler } from '../utils/noteInputHandler';

/**
 * Game states
 */
export const GAME_STATES = {
  IDLE: 'idle',           // Waiting to start
  PLAYING: 'playing',     // Active gameplay
  FEEDBACK: 'feedback',   // Showing correct/incorrect feedback
  COMPLETE: 'complete'    // Level finished
};

/**
 * Task result states
 */
export const TASK_RESULT = {
  PENDING: 'pending',
  CORRECT: 'correct',
  INCORRECT: 'incorrect'
};

/**
 * Custom hook for managing game state during a lesson
 */
export const useGameState = ({ onCorrect, onIncorrect, onLevelComplete }) => {
  // Core state
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [taskResult, setTaskResult] = useState(TASK_RESULT.PENDING);

  // Sequence tracking for multi-note tasks
  const [sequenceProgress, setSequenceProgress] = useState([]);
  const [retriesLeft, setRetriesLeft] = useState(2);

  // Diad tracking for simultaneous notes
  const [diadProgress, setDiadProgress] = useState([]);
  const diadTimeoutRef = useRef(null);

  // Note input handler reference
  const inputHandlerRef = useRef(null);

  // Get current lesson and task
  const currentLesson = currentLevelId ? lessons[currentLevelId] : null;
  const currentTask = currentLesson?.tasks[currentTaskIndex] || null;
  const totalTasks = currentLesson?.tasks.length || 10;

  /**
   * Get notes that should be highlighted for the current task
   */
  const getHighlightedNotes = useCallback(() => {
    if (!currentTask || gameState !== GAME_STATES.PLAYING) return [];

    switch (currentTask.type) {
      case 'single':
        return [currentTask.note];
      case 'sequence':
        // Highlight the next note in the sequence
        const nextNoteIndex = sequenceProgress.length;
        if (nextNoteIndex < currentTask.notes.length) {
          return [currentTask.notes[nextNoteIndex]];
        }
        return [];
      case 'diad':
        // Highlight all notes that haven't been played yet
        return currentTask.notes.filter(note => !diadProgress.includes(note));
      default:
        return [];
    }
  }, [currentTask, gameState, sequenceProgress, diadProgress]);

  /**
   * Start a new level
   */
  const startLevel = useCallback((levelId) => {
    setCurrentLevelId(levelId);
    setCurrentTaskIndex(0);
    setScore(0);
    setTaskResult(TASK_RESULT.PENDING);
    setSequenceProgress([]);
    setDiadProgress([]);
    setRetriesLeft(2);
    setGameState(GAME_STATES.PLAYING);
  }, []);

  /**
   * Move to the next task or complete the level
   */
  const nextTask = useCallback(() => {
    if (currentTaskIndex + 1 >= totalTasks) {
      // Level complete
      const medal = getMedalForScore(score + (taskResult === TASK_RESULT.CORRECT ? 1 : 0));
      setGameState(GAME_STATES.COMPLETE);
      onLevelComplete?.(currentLevelId, medal, score + (taskResult === TASK_RESULT.CORRECT ? 1 : 0));
    } else {
      // Next task
      setCurrentTaskIndex(prev => prev + 1);
      setTaskResult(TASK_RESULT.PENDING);
      setSequenceProgress([]);
      setDiadProgress([]);
      setRetriesLeft(currentLesson?.tasks[currentTaskIndex + 1]?.maxRetries || 2);
      setGameState(GAME_STATES.PLAYING);
    }
  }, [currentTaskIndex, totalTasks, score, taskResult, currentLevelId, currentLesson, onLevelComplete]);

  /**
   * Handle a correct task completion
   */
  const handleCorrect = useCallback(() => {
    setTaskResult(TASK_RESULT.CORRECT);
    setScore(prev => prev + 1);
    setGameState(GAME_STATES.FEEDBACK);
    onCorrect?.();

    // Auto-advance after feedback delay
    setTimeout(() => {
      nextTask();
    }, 1200);
  }, [onCorrect, nextTask]);

  /**
   * Handle an incorrect attempt
   */
  const handleIncorrect = useCallback(() => {
    onIncorrect?.();

    if (currentTask?.type !== 'single' && retriesLeft > 0) {
      // For sequences/diads, allow retries
      setRetriesLeft(prev => prev - 1);
      setSequenceProgress([]);
      setDiadProgress([]);
      setTaskResult(TASK_RESULT.PENDING);
    } else {
      // No retries left or single note task
      setTaskResult(TASK_RESULT.INCORRECT);
      setGameState(GAME_STATES.FEEDBACK);

      // Auto-advance after feedback delay
      setTimeout(() => {
        nextTask();
      }, 1200);
    }
  }, [currentTask, retriesLeft, onIncorrect, nextTask]);

  /**
   * Process a note input from the player
   */
  const handleNoteInput = useCallback((note) => {
    if (gameState !== GAME_STATES.PLAYING || !currentTask) return;

    switch (currentTask.type) {
      case 'single':
        if (note === currentTask.note) {
          handleCorrect();
        } else {
          handleIncorrect();
        }
        break;

      case 'sequence':
        const expectedNote = currentTask.notes[sequenceProgress.length];
        if (note === expectedNote) {
          const newProgress = [...sequenceProgress, note];
          setSequenceProgress(newProgress);

          if (newProgress.length === currentTask.notes.length) {
            // Sequence complete
            handleCorrect();
          }
        } else {
          // Wrong note in sequence
          handleIncorrect();
        }
        break;

      case 'diad':
        // Clear any existing timeout
        if (diadTimeoutRef.current) {
          clearTimeout(diadTimeoutRef.current);
        }

        // Check if this note is one of the expected notes
        if (currentTask.notes.includes(note) && !diadProgress.includes(note)) {
          const newProgress = [...diadProgress, note];
          setDiadProgress(newProgress);

          if (newProgress.length === currentTask.notes.length) {
            // All notes played
            handleCorrect();
          } else {
            // Wait for more notes (with timeout)
            diadTimeoutRef.current = setTimeout(() => {
              // Timeout - not all notes played together
              handleIncorrect();
            }, 1000);
          }
        } else {
          // Wrong note or duplicate
          handleIncorrect();
        }
        break;

      default:
        break;
    }
  }, [gameState, currentTask, sequenceProgress, diadProgress, handleCorrect, handleIncorrect]);

  /**
   * Reset the game state
   */
  const reset = useCallback(() => {
    setGameState(GAME_STATES.IDLE);
    setCurrentLevelId(null);
    setCurrentTaskIndex(0);
    setScore(0);
    setTaskResult(TASK_RESULT.PENDING);
    setSequenceProgress([]);
    setDiadProgress([]);
    setRetriesLeft(2);

    if (diadTimeoutRef.current) {
      clearTimeout(diadTimeoutRef.current);
    }
  }, []);

  /**
   * Retry the current level
   */
  const retryLevel = useCallback(() => {
    if (currentLevelId) {
      startLevel(currentLevelId);
    }
  }, [currentLevelId, startLevel]);

  // Initialize note input handler
  useEffect(() => {
    inputHandlerRef.current = getNoteInputHandler();
    inputHandlerRef.current.init({
      onNoteDetected: handleNoteInput,
      onNoteReleased: () => {}
    });

    return () => {
      inputHandlerRef.current?.destroy();
    };
  }, [handleNoteInput]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (diadTimeoutRef.current) {
        clearTimeout(diadTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    gameState,
    currentLevelId,
    currentTaskIndex,
    score,
    taskResult,
    sequenceProgress,
    retriesLeft,

    // Derived
    currentLesson,
    currentTask,
    totalTasks,
    highlightedNotes: getHighlightedNotes(),

    // Actions
    startLevel,
    handleNoteInput,
    reset,
    retryLevel
  };
};

export default useGameState;
