import { lessons, MEDAL_NAMES } from '../utils/lessonData';

/**
 * Medal icon component
 */
const MedalIcon = ({ medal, size = 'small' }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };

  const icons = {
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉',
    none: ''
  };

  return (
    <span className={sizeClasses[size]}>
      {icons[medal] || ''}
    </span>
  );
};

/**
 * Level Card Component
 */
const LevelCard = ({
  level,
  isUnlocked,
  medal,
  isRecommended,
  onClick
}) => {
  const lesson = lessons[level];
  if (!lesson) return null;

  return (
    <button
      onClick={() => isUnlocked && onClick(level)}
      disabled={!isUnlocked}
      className={`
        level-card w-full text-left
        ${!isUnlocked ? 'locked' : ''}
        ${isRecommended ? 'current' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Level info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-400">
              {level}
            </span>
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {lesson.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {lesson.description}
          </p>
        </div>

        {/* Medal or lock */}
        <div className="flex-shrink-0">
          {isUnlocked ? (
            medal ? (
              <MedalIcon medal={medal} size="medium" />
            ) : (
              <span className="text-2xl">⭐</span>
            )
          ) : (
            <span className="text-2xl">🔒</span>
          )}
        </div>
      </div>

      {/* Unlock requirement hint */}
      {!isUnlocked && lesson.unlockRequirement && (
        <p className="text-xs text-gray-400 mt-2">
          Get {MEDAL_NAMES[lesson.unlockRequirement.medal]} on Level {lesson.unlockRequirement.level} to unlock
        </p>
      )}

      {/* Recommended badge */}
      {isRecommended && (
        <div className="mt-2">
          <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            Play Next!
          </span>
        </div>
      )}
    </button>
  );
};

/**
 * LevelSelect Component
 *
 * Shows all levels with their unlock status and medals earned
 */
const LevelSelect = ({
  unlockedLevels = [1],
  medals = {},
  recommendedLevel = 1,
  totalStars = 0,
  onSelectLevel,
  onBack
}) => {
  const levelIds = Object.keys(lessons).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-semibold">Back</span>
        </button>

        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-yellow-600">{totalStars}</span>
          <span className="text-sm text-gray-500">stars</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        Choose a Level
      </h1>

      {/* Level grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {levelIds.map((levelId) => (
          <LevelCard
            key={levelId}
            level={levelId}
            isUnlocked={unlockedLevels.includes(levelId)}
            medal={medals[levelId]}
            isRecommended={levelId === recommendedLevel}
            onClick={onSelectLevel}
          />
        ))}
      </div>

      {/* Progress summary */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          {unlockedLevels.length} of {levelIds.length} levels unlocked
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <MedalIcon medal="gold" size="small" />
            <span className="text-sm text-gray-600">
              {Object.values(medals).filter(m => m === 'gold').length}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <MedalIcon medal="silver" size="small" />
            <span className="text-sm text-gray-600">
              {Object.values(medals).filter(m => m === 'silver').length}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <MedalIcon medal="bronze" size="small" />
            <span className="text-sm text-gray-600">
              {Object.values(medals).filter(m => m === 'bronze').length}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
