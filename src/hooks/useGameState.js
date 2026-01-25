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


  // Refs to store latest callback functions (avoids stale closure issues)
  const onCorrectRef = useRef(onCorrect);
  const onIncorrectRef = useRef(onIncorrect);
  const onLevelCompleteRef = useRef(onLevelComplete);

  // Keep callback refs updated
  useEffect(() => { onCorrectRef.current = onCorrect; }, [onCorrect]);
  useEffect(() => { onIncorrectRef.current = onIncorrect; }, [onIncorrect]);
  useEffect(() => { onLevelCompleteRef.current = onLevelComplete; }, [onLevelComplete]);

  /**
   * Process a note input from the player
   * This function reads ALL values from refs to avoid ANY stale closure issues
   */
  const handleNoteInput = (note) => {
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

    // Helper to handle correct answer
    const doCorrect = () => {
      scoreRef.current = scoreRef.current + 1;
      gameStateRef.current = GAME_STATES.FEEDBACK;
      setTaskResult(TASK_RESULT.CORRECT);
      setScore(scoreRef.current);
      setGameState(GAME_STATES.FEEDBACK);
      onCorrectRef.current?.();

      setTimeout(() => {
        const idx = currentTaskIndexRef.current;
        const finalScore = scoreRef.current;
        const lvlId = currentLevelIdRef.current;
        const lsn = lvlId ? lessons[lvlId] : null;
        const total = lsn?.tasks.length || 10;

        if (idx + 1 >= total) {
          const medal = getMedalForScore(finalScore, total);
          gameStateRef.current = GAME_STATES.COMPLETE;
          setGameState(GAME_STATES.COMPLETE);
          onLevelCompleteRef.current?.(lvlId, medal, finalScore);
        } else {
          const newRetries = lsn?.tasks[idx + 1]?.maxRetries || 2;
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
      }, 1200);
    };

    // Helper to handle incorrect answer
    const doIncorrect = () => {
      onIncorrectRef.current?.();
      const retries = retriesLeftRef.current;

      if (task?.type !== 'single' && retries > 0) {
        retriesLeftRef.current = retries - 1;
        sequenceProgressRef.current = [];
        diadProgressRef.current = [];
        setRetriesLeft(retries - 1);
        setSequenceProgress([]);
        setDiadProgress([]);
        setTaskResult(TASK_RESULT.PENDING);
      } else {
        setTaskResult(TASK_RESULT.INCORRECT);
        gameStateRef.current = GAME_STATES.FEEDBACK;
        setGameState(GAME_STATES.FEEDBACK);

        setTimeout(() => {
          const idx = currentTaskIndexRef.current;
          const finalScore = scoreRef.current;
          const lvlId = currentLevelIdRef.current;
          const lsn = lvlId ? lessons[lvlId] : null;
          const total = lsn?.tasks.length || 10;

          if (idx + 1 >= total) {
            const medal = getMedalForScore(finalScore, total);
            gameStateRef.current = GAME_STATES.COMPLETE;
            setGameState(GAME_STATES.COMPLETE);
            onLevelCompleteRef.current?.(lvlId, medal, finalScore);
          } else {
            const newRetries = lsn?.tasks[idx + 1]?.maxRetries || 2;
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
        }, 1200);
      }
    };

    switch (task.type) {
      case 'single':
        if (note === task.note) {
          doCorrect();
        } else {
          doIncorrect();
        }
        break;

      case 'sequence':
        const expectedNote = task.notes[seqProgress.length];
        if (note === expectedNote) {
          const newProgress = [...seqProgress, note];
          sequenceProgressRef.current = newProgress;
          setSequenceProgress(newProgress);

          if (newProgress.length === task.notes.length) {
            doCorrect();
          }
        } else {
          doIncorrect();
        }
        break;

      case 'diad':
        if (diadTimeoutRef.current) {
          clearTimeout(diadTimeoutRef.current);
        }

        if (task.notes.includes(note) && !diadProg.includes(note)) {
          const newProgress = [...diadProg, note];
          diadProgressRef.current = newProgress;
          setDiadProgress(newProgress);

          if (newProgress.length === task.notes.length) {
            doCorrect();
          } else {
            diadTimeoutRef.current = setTimeout(() => {
              doIncorrect();
            }, 1000);
          }
        } else {
          doIncorrect();
        }
        break;

      default:
        break;
    }
  };

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
