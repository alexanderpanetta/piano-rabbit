import { lessons } from '../utils/lessonData';

const LevelSelect = ({
  unlockedLevels = [1],
  medals = {},
  recommendedLevel = 1,
  totalStars = 0,
  onSelectLevel,
  onBack,
  onReset
}) => {
  const levelIds = Object.keys(lessons).map(Number).sort((a, b) => a - b);

  const getMedalEmoji = (medal) => {
    if (medal === 'gold') return '🥇';
    if (medal === 'silver') return '🥈';
    if (medal === 'bronze') return '🥉';
    return '';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <span style={styles.stars}>⭐ {totalStars} stars</span>
      </div>

      <h1 style={styles.title}>Choose a Level</h1>

      {/* Reset button */}
      {onReset && (
        <div style={styles.resetContainer}>
          <button
            onClick={() => {
              if (window.confirm('Start over from the beginning? This will erase all progress.')) {
                onReset();
              }
            }}
            style={styles.resetBtn}
          >
            Start Over
          </button>
        </div>
      )}

      {/* Level grid */}
      <div style={styles.grid}>
        {levelIds.map((levelId) => {
          const lesson = lessons[levelId];
          const isUnlocked = unlockedLevels.includes(levelId);
          const medal = medals[levelId];
          const isRecommended = levelId === recommendedLevel;

          return (
            <button
              key={levelId}
              onClick={() => isUnlocked && onSelectLevel(levelId)}
              disabled={!isUnlocked}
              style={{
                ...styles.levelCard,
                opacity: isUnlocked ? 1 : 0.5,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                border: isRecommended ? '3px solid #ffc107' : '1px solid #ddd',
                boxShadow: isRecommended ? '0 0 20px rgba(255,193,7,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={styles.levelHeader}>
                <span style={styles.levelNum}>{levelId}</span>
                <span style={styles.levelMedal}>
                  {isUnlocked ? (medal ? getMedalEmoji(medal) : '⭐') : '🔒'}
                </span>
              </div>
              <h3 style={styles.levelName}>{lesson.name}</h3>
              <p style={styles.levelDesc}>{lesson.description}</p>
              {isRecommended && (
                <span style={styles.recommended}>Play Next!</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
    fontFamily: "'Nunito', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#666',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  stars: {
    background: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    color: '#f59e0b',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#333',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  levelCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'left',
  },
  levelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  levelNum: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#999',
  },
  levelMedal: {
    fontSize: '28px',
  },
  levelName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 4px 0',
  },
  levelDesc: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  recommended: {
    display: 'inline-block',
    marginTop: '8px',
    background: '#fff3cd',
    color: '#856404',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  resetContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#999',
    cursor: 'pointer',
  },
};

export default LevelSelect;
