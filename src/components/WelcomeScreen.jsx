import { useState } from 'react';
import Rabbit from './Rabbit';

/**
 * Tutorial step data
 */
const tutorialSteps = [
  {
    rabbitState: 'waving',
    message: "Hi! I'm Rabbit! Let's learn piano together!",
    highlight: null
  },
  {
    rabbitState: 'teaching',
    message: "This is a piano! Each key makes a different sound.",
    highlight: 'piano'
  },
  {
    rabbitState: 'pointing',
    message: "I'll show you which keys to play. They'll glow like this!",
    highlight: 'glow'
  }
];

/**
 * Mini piano for tutorial
 */
const TutorialPiano = ({ highlight }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg p-2 shadow-xl">
        <div className="flex h-24">
          {['C', 'D', 'E', 'F', 'G'].map((note, i) => (
            <div
              key={note}
              className={`
                flex-1 mx-0.5 rounded-b-lg flex items-end justify-center pb-2
                text-gray-600 font-bold text-lg
                ${highlight === 'glow' && note === 'E'
                  ? 'bg-gradient-to-b from-yellow-100 to-yellow-400 animate-pulse-glow'
                  : 'bg-gradient-to-b from-white to-gray-100'
                }
              `}
            >
              {note}
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 bg-gradient-to-b from-gray-900 to-gray-800 rounded-b-lg" />
    </div>
  );
};

/**
 * WelcomeScreen Component
 *
 * Shows welcome message and optional tutorial for first-time users
 */
const WelcomeScreen = ({
  isFirstTime = true,
  onStart,
  onSkipTutorial
}) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(isFirstTime);

  const handleNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      // Tutorial complete, start game
      onStart();
    }
  };

  const handleSkip = () => {
    onSkipTutorial?.();
    onStart();
  };

  // Returning user - simple welcome
  if (!showTutorial) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Rabbit
          state="waving"
          message="Welcome back! Ready to play?"
          size="large"
        />

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onStart}
            className="game-button text-xl"
          >
            Let's Play!
          </button>
        </div>
      </div>
    );
  }

  // First-time user - tutorial
  const currentStep = tutorialSteps[tutorialStep];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-medium"
      >
        Skip Tutorial
      </button>

      {/* Tutorial content */}
      <div className="flex flex-col items-center max-w-lg mx-auto">
        {/* Rabbit */}
        <Rabbit
          state={currentStep.rabbitState}
          message={currentStep.message}
          size="large"
        />

        {/* Tutorial piano (if needed) */}
        {(currentStep.highlight === 'piano' || currentStep.highlight === 'glow') && (
          <div className="mt-6 w-full">
            <TutorialPiano highlight={currentStep.highlight} />
          </div>
        )}

        {/* Progress dots */}
        <div className="flex gap-2 mt-6">
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === tutorialStep ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="game-button mt-6 text-xl"
        >
          {tutorialStep === tutorialSteps.length - 1 ? "Let's Start!" : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
