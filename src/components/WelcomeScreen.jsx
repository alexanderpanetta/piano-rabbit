import { useState } from 'react';
import Rabbit from './Rabbit';

const WelcomeScreen = ({
  isFirstTime = true,
  onStart,
  onSkipTutorial
}) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    { message: "Hi! I'm Rabbit! Let's learn piano together!" },
    { message: "I'll show you which keys to play - they'll glow yellow!" },
    { message: "Tap the glowing keys to play. Ready?" }
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onStart();
    }
  };

  const handleSkip = () => {
    onSkipTutorial?.();
    onStart();
  };

  // Returning user
  if (!isFirstTime) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 gap-6">
        <Rabbit
          state="waving"
          message="Welcome back! Ready to play?"
          size="large"
        />
        <button onClick={onStart} className="game-button text-xl">
          Let's Play!
        </button>
      </div>
    );
  }

  // First time - tutorial
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 gap-6">
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-medium"
      >
        Skip
      </button>

      <Rabbit
        state="waving"
        message={tutorialSteps[step].message}
        size="large"
      />

      {/* Progress dots */}
      <div className="flex gap-2">
        {tutorialSteps.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === step ? 'bg-yellow-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <button onClick={handleNext} className="game-button text-xl">
        {step === tutorialSteps.length - 1 ? "Let's Start!" : 'Next'}
      </button>
    </div>
  );
};

export default WelcomeScreen;
