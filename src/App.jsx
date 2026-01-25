import { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LevelSelect from './components/LevelSelect';
import GameScreen from './components/GameScreen';
import { useProgress } from './hooks/useProgress';
import { useAudio } from './hooks/useAudio';
import { lessons } from './utils/lessonData';

/**
 * App screens
 */
const SCREENS = {
  WELCOME: 'welcome',
  LEVEL_SELECT: 'level_select',
  GAME: 'game'
};

/**
 * Main App Component
 *
 * Manages navigation between screens and coordinates game state
 */
function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Progress management
  const {
    progress,
    isLoaded,
    isLevelUnlocked,
    completeLevel,
    setCurrentLevel,
    markTutorialSeen,
    getNextLevel,
    resetProgress
  } = useProgress();

  // Audio initialization
  const { initAudio, playClick } = useAudio();

  // Handle welcome screen completion
  const handleWelcomeStart = useCallback(() => {
    markTutorialSeen();
    setCurrentScreen(SCREENS.LEVEL_SELECT);
  }, [markTutorialSeen]);

  // Handle level selection
  const handleSelectLevel = useCallback(async (levelId) => {
    // Initialize audio on first interaction
    await initAudio();
    playClick();

    setSelectedLevel(levelId);
    setCurrentLevel(levelId);
    setCurrentScreen(SCREENS.GAME);
  }, [initAudio, playClick, setCurrentLevel]);

  // Handle game completion
  const handleGameComplete = useCallback((levelId, score) => {
    // Determine medal
    const medal = score >= 9 ? 'gold' : score >= 7 ? 'silver' : score >= 5 ? 'bronze' : 'none';

    // Update progress
    completeLevel(levelId, medal);

    // Move to next level if available
    const nextLevelId = levelId + 1;
    if (lessons[nextLevelId] && isLevelUnlocked(nextLevelId)) {
      setSelectedLevel(nextLevelId);
      setCurrentLevel(nextLevelId);
    } else {
      setCurrentScreen(SCREENS.LEVEL_SELECT);
      setSelectedLevel(null);
    }
  }, [completeLevel, isLevelUnlocked, setCurrentLevel]);

  // Handle going home
  const handleGoHome = useCallback(() => {
    setCurrentScreen(SCREENS.LEVEL_SELECT);
    setSelectedLevel(null);
  }, []);

  // Handle back from level select
  const handleBackFromLevelSelect = useCallback(() => {
    setCurrentScreen(SCREENS.WELCOME);
  }, []);

  // Handle reset progress
  const handleReset = useCallback(() => {
    resetProgress();
    setCurrentScreen(SCREENS.WELCOME);
  }, [resetProgress]);

  // Show loading while progress loads
  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
      }}>
        <div style={{
          fontSize: '24px',
          color: '#666',
          fontFamily: "'Nunito', sans-serif",
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.WELCOME:
        return (
          <WelcomeScreen
            isFirstTime={!progress.hasSeenTutorial}
            onStart={handleWelcomeStart}
            onSkipTutorial={markTutorialSeen}
          />
        );

      case SCREENS.LEVEL_SELECT:
        return (
          <LevelSelect
            unlockedLevels={progress.unlockedLevels}
            medals={progress.medals}
            recommendedLevel={getNextLevel()}
            totalStars={progress.totalStarsEarned}
            onSelectLevel={handleSelectLevel}
            onBack={handleBackFromLevelSelect}
            onReset={handleReset}
          />
        );

      case SCREENS.GAME:
        if (!selectedLevel) {
          setCurrentScreen(SCREENS.LEVEL_SELECT);
          return null;
        }
        return (
          <GameScreen
            levelId={selectedLevel}
            onComplete={handleGameComplete}
            onHome={handleGoHome}
            hasNextLevel={!!lessons[selectedLevel + 1]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      {renderScreen()}
    </div>
  );
}

export default App;
