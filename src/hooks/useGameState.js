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

  // Refs to track current values for use in callbacks (avoid stale closures)
  const currentTaskIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const currentLevelIdRef = useRef(null);
  const sequenceProgressRef = useRef([]);
  const diadProgressRef = useRef([]);
  const retriesLeftRef = useRef(2);
  const gameStateRef = useRef(GAME_STATES.IDLE);

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

  useEffect(() => {
    sequenceProgressRef.current = sequenceProgress;
  }, [sequenceProgress]);

  useEffect(() => {
    diadProgressRef.current = diadProgress;
  }, [diadProgress]);

  useEffect(() => {
    retriesLeftRef.current = retriesLeft;
  }, [retriesLeft]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Get current lesson and task
  const currentLesson = currentLevelId ? lessons[currentLevelId] : null;
  const currentTask = currentLesson?.tasks[currentTaskIndex] || null;
  const totalTasks = currentLesson?.tasks.length || 10;

  /**
   * Get notes that should be highlighted for the current task
   * Only highlights for sequences/diads where multiple keys have same label
   */
  const getHighlightedNotes = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.PLAYING) return [];

    const levelId = currentLevelIdRef.current;
    const taskIdx = currentTaskIndexRef.current;
    const lesson = levelId ? lessons[levelId] : null;
    const task = lesson?.tasks[taskIdx];

    if (!task) return [];

    switch (task.type) {
      case 'single':
        // No highlighting for single notes - they must learn the positions
        return [];
      case 'sequence':
        // Highlight the next note in the sequence (needed because C4 vs C5, D4 vs D5, etc.)
        const seqProgress = sequenceProgressRef.current;
        const nextNoteIndex = seqProgress.length;
        if (nextNoteIndex < task.notes.length) {
          return [task.notes[nextNoteIndex]];
        }
        return [];
      case 'diad':
        // Highlight notes not yet played (needed because multiple keys have same label)
        const diadProg = diadProgressRef.current;
        return task.notes.filter(note => !diadProg.includes(note));
      default:
        return [];
    }
  }, []);

  /**
   * Start a new level
   */
  const startLevel = useCallback((levelId) => {
    // Update ALL refs immediately for use in callbacks
    currentLevelIdRef.current = levelId;
    currentTaskIndexRef.current = 0;
    scoreRef.current = 0;
    sequenceProgressRef.current = [];
    diadProgressRef.current = [];
    retriesLeftRef.current = 2;
    gameStateRef.current = GAME_STATES.PLAYING;

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
      gameStateRef.current = GAME_STATES.COMPLETE;
      setGameState(GAME_STATES.COMPLETE);
      onLevelComplete?.(levelId, medal, finalScore);
    } else {
      // Next task - update ALL refs and state
      const newRetries = lesson?.tasks[idx + 1]?.maxRetries || 2;
      currentTaskIndexRef.current = idx + 1;
      sequenceProgressRef.current = [];
      diadProgressRef.current = [];
      retriesLeftRef.current = newRetries;
      gameStateRef.current = GAME_STATES.PLAYING;

      setCurrentTaskIndex(idx + 1);
      setTaskResult(TASK_RESULT.PENDING);
      setSequenceProgress([]);
      setDiadProgress([]);
      setRetriesLeft(newRetries);
      setGameState(GAME_STATES.PLAYING);
    }
  }, [onLevelComplete]);

  /**
   * Handle a correct task completion
   */
  const handleCorrect = useCallback(() => {
    // Update refs immediately to avoid stale closure in timeout
    scoreRef.current = scoreRef.current + 1;
    gameStateRef.current = GAME_STATES.FEEDBACK;

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
   * Uses refs for ALL state to avoid stale closure issues
   */
  const handleIncorrect = useCallback(() => {
    onIncorrect?.();

    // Get fresh values from refs
    const levelId = currentLevelIdRef.current;
    const taskIdx = currentTaskIndexRef.current;
    const lesson = levelId ? lessons[levelId] : null;
    const task = lesson?.tasks[taskIdx];
    const retries = retriesLeftRef.current;

    if (task?.type !== 'single' && retries > 0) {
      // For sequences/diads, allow retries
      retriesLeftRef.current = retries - 1;
      sequenceProgressRef.current = [];
      diadProgressRef.current = [];
      setRetriesLeft(retries - 1);
      setSequenceProgress([]);
      setDiadProgress([]);
      setTaskResult(TASK_RESULT.PENDING);
    } else {
      // No retries left or single note task
      setTaskResult(TASK_RESULT.INCORRECT);
      gameStateRef.current = GAME_STATES.FEEDBACK;
      setGameState(GAME_STATES.FEEDBACK);

      // Auto-advance after feedback delay
      setTimeout(() => {
        nextTask();
      }, 1200);
    }
  }, [onIncorrect, nextTask]);

  /**
   * Process a note input from the player
   * Uses refs for ALL state to avoid stale closure issues
   */
  const handleNoteInput = useCallback((note) => {
    // Use ref for gameState check
    if (gameStateRef.current !== GAME_STATES.PLAYING) return;

    // Get fresh values from refs
    const levelId = currentLevelIdRef.current;
    const taskIdx = currentTaskIndexRef.current;
    const lesson = levelId ? lessons[levelId] : null;
    const task = lesson?.tasks[taskIdx];
    const seqProgress = sequenceProgressRef.current;
    const diadProg = diadProgressRef.current;

    if (!task) return;

    switch (task.type) {
      case 'single':
        if (note === task.note) {
          handleCorrect();
        } else {
          handleIncorrect();
        }
        break;

      case 'sequence':
        const expectedNote = task.notes[seqProgress.length];
        if (note === expectedNote) {
          const newProgress = [...seqProgress, note];
          sequenceProgressRef.current = newProgress;
          setSequenceProgress(newProgress);

          if (newProgress.length === task.notes.length) {
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
        if (task.notes.includes(note) && !diadProg.includes(note)) {
          const newProgress = [...diadProg, note];
          diadProgressRef.current = newProgress;
          setDiadProgress(newProgress);

          if (newProgress.length === task.notes.length) {
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
  }, [handleCorrect, handleIncorrect]);

  /**
   * Reset the game state
   */
  const reset = useCallback(() => {
    // Update all refs
    gameStateRef.current = GAME_STATES.IDLE;
    currentLevelIdRef.current = null;
    currentTaskIndexRef.current = 0;
    scoreRef.current = 0;
    sequenceProgressRef.current = [];
    diadProgressRef.current = [];
    retriesLeftRef.current = 2;

    // Update state
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
