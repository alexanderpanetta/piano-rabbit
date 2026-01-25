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

  // Refs to track current values for use in timeouts (avoid stale closures)
  const currentTaskIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const currentLevelIdRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    currentTaskIndexRef.current = currentTaskIndex;
  }, [currentTaskIndex]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    currentLevelIdRef.current = currentLevelId;
  }, [currentLevelId]);

  // Get current lesson and task
  const currentLesson = currentLevelId ? lessons[currentLevelId] : null;
  const currentTask = currentLesson?.tasks[currentTaskIndex] || null;
  const totalTasks = currentLesson?.tasks.length || 10;

  /**
   * Get notes that should be highlighted for the current task
   * Currently returns empty - no hints shown on piano keys
   * The instruction text tells the player which note to play
   */
  const getHighlightedNotes = useCallback(() => {
    // No highlighting - player must learn the note positions
    return [];
  }, []);

  /**
   * Start a new level
   */
  const startLevel = useCallback((levelId) => {
    // Update refs immediately for use in callbacks
    currentLevelIdRef.current = levelId;
    currentTaskIndexRef.current = 0;
    scoreRef.current = 0;

    // Update state
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
   * Uses refs to avoid stale closure issues when called from setTimeout
   */
  const nextTask = useCallback(() => {
    const idx = currentTaskIndexRef.current;
    const finalScore = scoreRef.current;
    const levelId = currentLevelIdRef.current;
    const lesson = levelId ? lessons[levelId] : null;
    const total = lesson?.tasks.length || 10;

    if (idx + 1 >= total) {
      // Level complete
      const medal = getMedalForScore(finalScore, total);
      setGameState(GAME_STATES.COMPLETE);
      onLevelComplete?.(levelId, medal, finalScore);
    } else {
      // Next task - update both ref and state
      currentTaskIndexRef.current = idx + 1;
      setCurrentTaskIndex(idx + 1);
      setTaskResult(TASK_RESULT.PENDING);
      setSequenceProgress([]);
      setDiadProgress([]);
      setRetriesLeft(lesson?.tasks[idx + 1]?.maxRetries || 2);
      setGameState(GAME_STATES.PLAYING);
    }
  }, [onLevelComplete]);

  /**
   * Handle a correct task completion
   */
  const handleCorrect = useCallback(() => {
    // Update ref immediately to avoid stale closure in timeout
    scoreRef.current = scoreRef.current + 1;

    setTaskResult(TASK_RESULT.CORRECT);
    setScore(scoreRef.current);
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

  // Note: noteInputHandler is available for future audio detection mode
  // Currently we use direct calls from Piano component, so we don't
  // initialize it here to avoid double-processing notes

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
