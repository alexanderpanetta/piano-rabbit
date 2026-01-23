/**
 * TaskDisplay Component
 *
 * Shows the current instruction and notes to play
 */
const TaskDisplay = ({
  instruction = '',
  displayNotes = '',
  taskType = 'single',
  sequenceProgress = [],
  totalNotes = 0
}) => {
  // For sequences, show which notes have been played
  const renderNoteProgress = () => {
    if (taskType !== 'sequence' || !displayNotes) return null;

    const notes = displayNotes.split(' ');
    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2 flex-wrap">
        {notes.map((note, index) => {
          const isPlayed = index < sequenceProgress.length;
          const isCurrent = index === sequenceProgress.length;

          return (
            <span
              key={index}
              className={`
                text-xl sm:text-2xl font-bold px-2 sm:px-3 py-1 rounded-lg transition-all duration-200
                ${isPlayed
                  ? 'bg-green-500 text-white scale-95'
                  : isCurrent
                    ? 'bg-yellow-400 text-gray-800 scale-110 animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {note}
            </span>
          );
        })}
      </div>
    );
  };

  // For diads, show both notes
  const renderDiadNotes = () => {
    if (taskType !== 'diad' || !displayNotes) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-2xl sm:text-3xl font-bold text-yellow-600 animate-pulse">
          {displayNotes}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg max-w-md mx-auto">
      {/* Main instruction */}
      <p className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
        {instruction}
      </p>

      {/* Note visualization based on task type */}
      {taskType === 'sequence' && renderNoteProgress()}
      {taskType === 'diad' && renderDiadNotes()}

      {/* Single note display */}
      {taskType === 'single' && displayNotes && (
        <div className="flex items-center justify-center mt-2">
          <span className="text-3xl sm:text-4xl font-bold text-yellow-500 animate-pulse">
            {displayNotes}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskDisplay;
