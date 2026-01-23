/**
 * Sound Effects Configuration for Piano Rabbit
 *
 * All sound effects are generated using Tone.js
 */

// Feedback sound configurations
export const SOUND_EFFECTS = {
  // Correct answer - bright ascending chime
  correct: {
    notes: ['E5', 'G5', 'C6'],
    duration: '16n',
    stagger: 0.08,
    synth: 'bell'
  },

  // Incorrect answer - soft buzzer (not scary)
  incorrect: {
    notes: ['E3', 'D3'],
    duration: '8n',
    stagger: 0.1,
    synth: 'soft'
  },

  // Gold medal fanfare - triumphant
  goldMedal: {
    notes: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'],
    duration: '8n',
    stagger: 0.12,
    synth: 'fanfare'
  },

  // Silver medal - pleasant success
  silverMedal: {
    notes: ['C4', 'E4', 'G4', 'C5'],
    duration: '8n',
    stagger: 0.15,
    synth: 'fanfare'
  },

  // Bronze medal - encouraging
  bronzeMedal: {
    notes: ['C4', 'E4', 'G4'],
    duration: '8n',
    stagger: 0.15,
    synth: 'bell'
  },

  // Try again - gentle, encouraging
  tryAgain: {
    notes: ['G4', 'E4', 'C4'],
    duration: '4n',
    stagger: 0.2,
    synth: 'soft'
  },

  // Level start
  levelStart: {
    notes: ['C4', 'G4'],
    duration: '8n',
    stagger: 0.1,
    synth: 'bell'
  },

  // Button click
  click: {
    notes: ['G5'],
    duration: '32n',
    stagger: 0,
    synth: 'click'
  }
};

// Synth configurations for different sound types
export const SYNTH_CONFIGS = {
  // Piano sound for main gameplay
  piano: {
    oscillator: {
      type: 'triangle'
    },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.2,
      release: 1.2
    }
  },

  // Bell sound for correct answers
  bell: {
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.1,
      release: 0.8
    }
  },

  // Soft sound for incorrect/encouragement
  soft: {
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 0.5
    }
  },

  // Fanfare for medals
  fanfare: {
    oscillator: {
      type: 'triangle'
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 1
    }
  },

  // Click for UI
  click: {
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.05
    }
  }
};

export default SOUND_EFFECTS;
