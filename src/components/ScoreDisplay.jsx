/**
 * ScoreDisplay Component
 *
 * Shows current score, progress, and level info during gameplay
 */
const ScoreDisplay = ({
  levelName = '',
  currentTask = 0,
  totalTasks = 10,
  score = 0,
  onHomeClick
}) => {
  return (
    <div className="flex items-center justify-between w-full px-2 sm:px-4 py-2">
      {/* Level name */}
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base font-semibold text-gray-700 bg-white/80 px-2 sm:px-3 py-1 rounded-full shadow">
          {levelName}
        </span>
      </div>

      {/* Progress and score */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Task progress */}
        <div className="flex items-center gap-1 bg-white/80 px-2 sm:px-3 py-1 rounded-full shadow">
          <span className="text-lg sm:text-xl">📋</span>
          <span className="text-sm sm:text-base font-semibold text-gray-700">
            {currentTask + 1}/{totalTasks}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 bg-white/80 px-2 sm:px-3 py-1 rounded-full shadow">
          <span className="text-lg sm:text-xl">⭐</span>
          <span className="text-sm sm:text-base font-bold text-yellow-600">
            {score}
          </span>
        </div>

        {/* Home button */}
        <button
          onClick={onHomeClick}
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
          aria-label="Go to home"
        >
          <span className="text-lg sm:text-xl">🏠</span>
        </button>
      </div>
    </div>
  );
};

export default ScoreDisplay;
