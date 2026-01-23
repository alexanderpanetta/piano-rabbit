/**
 * Lesson Data - All lesson and level definitions for Piano Rabbit
 *
 * Task Types:
 * - 'single': Play a single note
 * - 'sequence': Play a sequence of notes in order
 * - 'diad': Play two notes simultaneously
 */

export const MEDAL_THRESHOLDS = {
  gold: 9,    // 9-10 correct (90-100%)
  silver: 7,  // 7-8 correct (70-80%)
  bronze: 5,  // 5-6 correct (50-60%)
  none: 0     // 0-4 correct (0-40%)
};

export const getMedalForScore = (score, total = 10) => {
  const percentage = score / total;
  if (percentage >= 0.9) return 'gold';
  if (percentage >= 0.7) return 'silver';
  if (percentage >= 0.5) return 'bronze';
  return 'none';
};

export const MEDAL_NAMES = {
  gold: 'Gold Medal',
  silver: 'Silver Medal',
  bronze: 'Bronze Medal',
  none: 'Try Again'
};

export const lessons = {
  1: {
    id: 1,
    name: "Meet the Keys",
    description: "Learn your first piano notes!",
    unlockRequirement: null,
    tasks: [
      { type: 'single', note: 'C4', instruction: "Play C!", displayNotes: "C" },
      { type: 'single', note: 'D4', instruction: "Play D!", displayNotes: "D" },
      { type: 'single', note: 'E4', instruction: "Play E!", displayNotes: "E" },
      { type: 'single', note: 'C4', instruction: "Play C again!", displayNotes: "C" },
      { type: 'single', note: 'F4', instruction: "Play F!", displayNotes: "F" },
      { type: 'single', note: 'G4', instruction: "Play G!", displayNotes: "G" },
      { type: 'single', note: 'E4', instruction: "Play E!", displayNotes: "E" },
      { type: 'single', note: 'D4', instruction: "Play D!", displayNotes: "D" },
      { type: 'single', note: 'F4', instruction: "Play F!", displayNotes: "F" },
      { type: 'single', note: 'G4', instruction: "Play G!", displayNotes: "G" }
    ]
  },

  2: {
    id: 2,
    name: "More Notes!",
    description: "Learn A, B, and high C!",
    unlockRequirement: { level: 1, medal: 'bronze' },
    tasks: [
      { type: 'single', note: 'A4', instruction: "Play A!", displayNotes: "A" },
      { type: 'single', note: 'B4', instruction: "Play B!", displayNotes: "B" },
      { type: 'single', note: 'C5', instruction: "Play high C!", displayNotes: "C" },
      { type: 'single', note: 'A4', instruction: "Play A again!", displayNotes: "A" },
      { type: 'single', note: 'G4', instruction: "Play G!", displayNotes: "G" },
      { type: 'single', note: 'B4', instruction: "Play B!", displayNotes: "B" },
      { type: 'single', note: 'C5', instruction: "Play high C!", displayNotes: "C" },
      { type: 'single', note: 'E4', instruction: "Play E!", displayNotes: "E" },
      { type: 'single', note: 'A4', instruction: "Play A!", displayNotes: "A" },
      { type: 'single', note: 'C4', instruction: "Play low C!", displayNotes: "C" }
    ]
  },

  3: {
    id: 3,
    name: "Note Patterns",
    description: "Play 2 notes in a row!",
    unlockRequirement: { level: 2, medal: 'bronze' },
    tasks: [
      { type: 'sequence', notes: ['C4', 'D4'], instruction: "Play C then D!", displayNotes: "C D", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'F4'], instruction: "Play E then F!", displayNotes: "E F", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'A4'], instruction: "Play G then A!", displayNotes: "G A", maxRetries: 2 },
      { type: 'sequence', notes: ['C4', 'E4'], instruction: "Play C then E!", displayNotes: "C E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'F4'], instruction: "Play D then F!", displayNotes: "D F", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'G4'], instruction: "Play E then G!", displayNotes: "E G", maxRetries: 2 },
      { type: 'sequence', notes: ['F4', 'A4'], instruction: "Play F then A!", displayNotes: "F A", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'B4'], instruction: "Play G then B!", displayNotes: "G B", maxRetries: 2 },
      { type: 'sequence', notes: ['A4', 'C5'], instruction: "Play A then high C!", displayNotes: "A C", maxRetries: 2 },
      { type: 'sequence', notes: ['C5', 'C4'], instruction: "Play high C then low C!", displayNotes: "C C", maxRetries: 2 }
    ]
  },

  4: {
    id: 4,
    name: "Little Sequences",
    description: "Play 3 notes in a row!",
    unlockRequirement: { level: 3, medal: 'bronze' },
    tasks: [
      { type: 'sequence', notes: ['C4', 'D4', 'E4'], instruction: "Play C, D, E!", displayNotes: "C D E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'E4', 'F4'], instruction: "Play D, E, F!", displayNotes: "D E F", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'F4', 'G4'], instruction: "Play E, F, G!", displayNotes: "E F G", maxRetries: 2 },
      { type: 'sequence', notes: ['F4', 'G4', 'A4'], instruction: "Play F, G, A!", displayNotes: "F G A", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'A4', 'B4'], instruction: "Play G, A, B!", displayNotes: "G A B", maxRetries: 2 },
      { type: 'sequence', notes: ['A4', 'B4', 'C5'], instruction: "Play A, B, high C!", displayNotes: "A B C", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'D4', 'C4'], instruction: "Play E, D, C going down!", displayNotes: "E D C", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'F4', 'E4'], instruction: "Play G, F, E going down!", displayNotes: "G F E", maxRetries: 2 },
      { type: 'sequence', notes: ['C4', 'E4', 'G4'], instruction: "Play C, E, G!", displayNotes: "C E G", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'E4', 'C4'], instruction: "Play G, E, C going down!", displayNotes: "G E C", maxRetries: 2 }
    ]
  },

  5: {
    id: 5,
    name: "Mary's Lamb",
    description: "Play Mary Had a Little Lamb!",
    unlockRequirement: { level: 4, medal: 'silver' },
    tasks: [
      // Breaking the song into manageable phrases
      { type: 'sequence', notes: ['E4', 'D4', 'C4', 'D4'], instruction: "Mary had a...", displayNotes: "E D C D", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'E4', 'E4'], instruction: "...little lamb!", displayNotes: "E E E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'D4', 'D4'], instruction: "Little lamb...", displayNotes: "D D D", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'G4', 'G4'], instruction: "Little lamb!", displayNotes: "E G G", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'D4', 'C4', 'D4'], instruction: "Mary had a...", displayNotes: "E D C D", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'E4', 'E4', 'E4'], instruction: "...little lamb, its...", displayNotes: "E E E E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'D4', 'E4', 'D4'], instruction: "...fleece was white as...", displayNotes: "D D E D", maxRetries: 2 },
      { type: 'sequence', notes: ['C4'], instruction: "...snow!", displayNotes: "C", maxRetries: 2 },
      // Full first phrase practice
      { type: 'sequence', notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4'], instruction: "Full phrase: Mary had a little lamb!", displayNotes: "E D C D E E E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'D4', 'D4', 'E4', 'G4', 'G4'], instruction: "Full phrase: Little lamb, little lamb!", displayNotes: "D D D E G G", maxRetries: 2 }
    ]
  },

  6: {
    id: 6,
    name: "Twinkle Star",
    description: "Play Twinkle Twinkle Little Star!",
    unlockRequirement: { level: 5, medal: 'silver' },
    tasks: [
      { type: 'sequence', notes: ['C4', 'C4', 'G4', 'G4'], instruction: "Twinkle, twinkle...", displayNotes: "C C G G", maxRetries: 2 },
      { type: 'sequence', notes: ['A4', 'A4', 'G4'], instruction: "...little star!", displayNotes: "A A G", maxRetries: 2 },
      { type: 'sequence', notes: ['F4', 'F4', 'E4', 'E4'], instruction: "How I wonder...", displayNotes: "F F E E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'D4', 'C4'], instruction: "...what you are!", displayNotes: "D D C", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'G4', 'F4', 'F4'], instruction: "Up above the...", displayNotes: "G G F F", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'E4', 'D4'], instruction: "...world so high!", displayNotes: "E E D", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'G4', 'F4', 'F4'], instruction: "Like a diamond...", displayNotes: "G G F F", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'E4', 'D4'], instruction: "...in the sky!", displayNotes: "E E D", maxRetries: 2 },
      // Full first line
      { type: 'sequence', notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'], instruction: "Full line: Twinkle, twinkle, little star!", displayNotes: "C C G G A A G", maxRetries: 2 },
      { type: 'sequence', notes: ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'], instruction: "Full line: How I wonder what you are!", displayNotes: "F F E E D D C", maxRetries: 2 }
    ]
  },

  7: {
    id: 7,
    name: "Joyful Music",
    description: "Play Ode to Joy!",
    unlockRequirement: { level: 6, medal: 'silver' },
    tasks: [
      { type: 'sequence', notes: ['E4', 'E4', 'F4', 'G4'], instruction: "Start of Ode to Joy!", displayNotes: "E E F G", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'F4', 'E4', 'D4'], instruction: "Going down...", displayNotes: "G F E D", maxRetries: 2 },
      { type: 'sequence', notes: ['C4', 'C4', 'D4', 'E4'], instruction: "Going up again!", displayNotes: "C C D E", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'D4', 'D4'], instruction: "First ending!", displayNotes: "E D D", maxRetries: 2 },
      { type: 'sequence', notes: ['E4', 'E4', 'F4', 'G4'], instruction: "Second phrase start!", displayNotes: "E E F G", maxRetries: 2 },
      { type: 'sequence', notes: ['G4', 'F4', 'E4', 'D4'], instruction: "Going down again...", displayNotes: "G F E D", maxRetries: 2 },
      { type: 'sequence', notes: ['C4', 'C4', 'D4', 'E4'], instruction: "Building up!", displayNotes: "C C D E", maxRetries: 2 },
      { type: 'sequence', notes: ['D4', 'C4', 'C4'], instruction: "Second ending!", displayNotes: "D C C", maxRetries: 2 },
      // Full phrases
      { type: 'sequence', notes: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4'], instruction: "Full first half!", displayNotes: "E E F G G F E D", maxRetries: 2 },
      { type: 'sequence', notes: ['C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'D4'], instruction: "Full second half!", displayNotes: "C C D E E D D", maxRetries: 2 }
    ]
  },

  8: {
    id: 8,
    name: "Two Notes Together",
    description: "Play two notes at the same time!",
    unlockRequirement: { level: 7, medal: 'gold' },
    tasks: [
      { type: 'diad', notes: ['C4', 'E4'], instruction: "Play C and E together!", displayNotes: "C+E", maxRetries: 2 },
      { type: 'diad', notes: ['C4', 'G4'], instruction: "Play C and G together!", displayNotes: "C+G", maxRetries: 2 },
      { type: 'diad', notes: ['D4', 'F4'], instruction: "Play D and F together!", displayNotes: "D+F", maxRetries: 2 },
      { type: 'diad', notes: ['E4', 'G4'], instruction: "Play E and G together!", displayNotes: "E+G", maxRetries: 2 },
      { type: 'diad', notes: ['F4', 'A4'], instruction: "Play F and A together!", displayNotes: "F+A", maxRetries: 2 },
      { type: 'diad', notes: ['G4', 'B4'], instruction: "Play G and B together!", displayNotes: "G+B", maxRetries: 2 },
      { type: 'diad', notes: ['A4', 'C5'], instruction: "Play A and high C together!", displayNotes: "A+C", maxRetries: 2 },
      { type: 'diad', notes: ['C4', 'E4'], instruction: "Play C and E again!", displayNotes: "C+E", maxRetries: 2 },
      { type: 'diad', notes: ['D4', 'G4'], instruction: "Play D and G together!", displayNotes: "D+G", maxRetries: 2 },
      { type: 'diad', notes: ['E4', 'A4'], instruction: "Play E and A together!", displayNotes: "E+A", maxRetries: 2 }
    ]
  }
};

// Piano key definitions for the on-screen keyboard
// C4 to E5 (about 1.5 octaves)
export const PIANO_KEYS = [
  { note: 'C4', label: 'C', isBlack: false },
  { note: 'C#4', label: '', isBlack: true },
  { note: 'D4', label: 'D', isBlack: false },
  { note: 'D#4', label: '', isBlack: true },
  { note: 'E4', label: 'E', isBlack: false },
  { note: 'F4', label: 'F', isBlack: false },
  { note: 'F#4', label: '', isBlack: true },
  { note: 'G4', label: 'G', isBlack: false },
  { note: 'G#4', label: '', isBlack: true },
  { note: 'A4', label: 'A', isBlack: false },
  { note: 'A#4', label: '', isBlack: true },
  { note: 'B4', label: 'B', isBlack: false },
  { note: 'C5', label: 'C', isBlack: false },
  { note: 'C#5', label: '', isBlack: true },
  { note: 'D5', label: 'D', isBlack: false },
  { note: 'D#5', label: '', isBlack: true },
  { note: 'E5', label: 'E', isBlack: false }
];

// Get white keys only (for layout calculations)
export const WHITE_KEYS = PIANO_KEYS.filter(k => !k.isBlack);

// Get black keys only
export const BLACK_KEYS = PIANO_KEYS.filter(k => k.isBlack);

// Keyboard mapping for desktop play
export const KEYBOARD_MAP = {
  'a': 'C4',
  'w': 'C#4',
  's': 'D4',
  'e': 'D#4',
  'd': 'E4',
  'f': 'F4',
  't': 'F#4',
  'g': 'G4',
  'y': 'G#4',
  'h': 'A4',
  'u': 'A#4',
  'j': 'B4',
  'k': 'C5',
  'o': 'C#5',
  'l': 'D5',
  'p': 'D#5',
  ';': 'E5'
};

export default lessons;
