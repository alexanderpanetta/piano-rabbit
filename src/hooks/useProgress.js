import { useState, useCallback, useEffect } from 'react';
import { lessons } from '../utils/lessonData';

const STORAGE_KEY = 'piano-rabbit-progress';

/**
 * Default progress state for new players
 */
const defaultProgress = {
  unlockedLevels: [1],
  medals: {},
  currentLevel: 1,
  totalStarsEarned: 0,
  hasSeenTutorial: false,
  settings: {
    volume: 0.8,
    showKeyLabels: true
  }
};

/**
 * Custom hook for managing player progress with localStorage persistence
 */
export const useProgress = () => {
  const [progress, setProgress] = useState(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load progress from localStorage on mount
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        setProgress({
          ...defaultProgress,
          ...parsed,
          settings: {
            ...defaultProgress.settings,
            ...parsed.settings
          }
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    setIsLoaded(true);
  }, []);

  /**
   * Save progress to localStorage whenever it changes
   */
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [progress, isLoaded]);

  /**
   * Check if a level is unlocked
   * @param {number} levelId - The level ID to check
   * @returns {boolean}
   */
  const isLevelUnlocked = useCallback((levelId) => {
    return progress.unlockedLevels.includes(levelId);
  }, [progress.unlockedLevels]);

  /**
   * Get the medal earned for a level
   * @param {number} levelId - The level ID
   * @returns {'gold' | 'silver' | 'bronze' | null}
   */
  const getMedal = useCallback((levelId) => {
    return progress.medals[levelId] || null;
  }, [progress.medals]);

  /**
   * Check if a level can be unlocked based on requirements
   * @param {number} levelId - The level to check
   * @returns {boolean}
   */
  const canUnlockLevel = useCallback((levelId) => {
    const lesson = lessons[levelId];
    if (!lesson) return false;

    const req = lesson.unlockRequirement;
    if (!req) return true; // No requirement = always unlocked

    // Check if prerequisite level has required medal
    const prereqMedal = progress.medals[req.level];
    if (!prereqMedal) return false;

    const medalRanking = { gold: 3, silver: 2, bronze: 1 };
    const requiredRank = medalRanking[req.medal] || 0;
    const earnedRank = medalRanking[prereqMedal] || 0;

    return earnedRank >= requiredRank;
  }, [progress.medals]);

  /**
   * Complete a level with a specific medal
   * @param {number} levelId - The level completed
   * @param {'gold' | 'silver' | 'bronze' | 'none'} medal - Medal earned
   */
  const completeLevel = useCallback((levelId, medal) => {
    setProgress(prev => {
      const newProgress = { ...prev };

      // Update medal (only if better than existing)
      if (medal !== 'none') {
        const medalRanking = { gold: 3, silver: 2, bronze: 1 };
        const currentMedal = prev.medals[levelId];
        const currentRank = medalRanking[currentMedal] || 0;
        const newRank = medalRanking[medal] || 0;

        if (newRank > currentRank) {
          newProgress.medals = {
            ...prev.medals,
            [levelId]: medal
          };

          // Update stars
          const starValues = { gold: 3, silver: 2, bronze: 1 };
          const starsGained = (starValues[medal] || 0) - (starValues[currentMedal] || 0);
          newProgress.totalStarsEarned = prev.totalStarsEarned + starsGained;
        }
      }

      // Check and unlock next levels
      const newUnlocked = [...prev.unlockedLevels];
      Object.keys(lessons).forEach(id => {
        const numId = parseInt(id, 10);
        if (!newUnlocked.includes(numId)) {
          const lesson = lessons[numId];
          const req = lesson?.unlockRequirement;
          if (!req) {
            newUnlocked.push(numId);
          } else {
            const prereqMedal = newProgress.medals[req.level];
            if (prereqMedal) {
              const medalRanking = { gold: 3, silver: 2, bronze: 1 };
              const requiredRank = medalRanking[req.medal] || 0;
              const earnedRank = medalRanking[prereqMedal] || 0;
              if (earnedRank >= requiredRank) {
                newUnlocked.push(numId);
              }
            }
          }
        }
      });
      newProgress.unlockedLevels = newUnlocked.sort((a, b) => a - b);

      return newProgress;
    });
  }, []);

  /**
   * Set the current level
   * @param {number} levelId - The level to set as current
   */
  const setCurrentLevel = useCallback((levelId) => {
    setProgress(prev => ({
      ...prev,
      currentLevel: levelId
    }));
  }, []);

  /**
   * Mark tutorial as seen
   */
  const markTutorialSeen = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      hasSeenTutorial: true
    }));
  }, []);

  /**
   * Update a setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  const updateSetting = useCallback((key, value) => {
    setProgress(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  }, []);

  /**
   * Reset all progress
   */
  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Get the next recommended level to play
   * @returns {number}
   */
  const getNextLevel = useCallback(() => {
    // Find highest unlocked level without a medal, or highest level overall
    const unlockedWithoutMedal = progress.unlockedLevels.filter(
      id => !progress.medals[id]
    );

    if (unlockedWithoutMedal.length > 0) {
      return Math.min(...unlockedWithoutMedal);
    }

    // All unlocked levels have medals, return highest unlocked
    return Math.max(...progress.unlockedLevels);
  }, [progress.unlockedLevels, progress.medals]);

  return {
    progress,
    isLoaded,
    isLevelUnlocked,
    getMedal,
    canUnlockLevel,
    completeLevel,
    setCurrentLevel,
    markTutorialSeen,
    updateSetting,
    resetProgress,
    getNextLevel
  };
};

export default useProgress;
