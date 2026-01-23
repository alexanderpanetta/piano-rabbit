/**
 * NoteInputHandler - Abstraction layer for note input detection
 *
 * ARCHITECTURE NOTE: This handler abstracts the source of note input,
 * allowing the game to work with either touch/click input (current)
 * or audio input from a real piano (future enhancement).
 *
 * The game logic should ONLY receive note events from this handler,
 * never directly from touch events or audio streams.
 */

class NoteInputHandler {
  constructor(mode = 'touch') {
    this.mode = mode;
    this.onNoteDetected = null;
    this.onNoteReleased = null;
    this.activeNotes = new Set();

    // Future: Audio detection configuration
    // this.audioContext = null;
    // this.analyser = null;
    // this.pitchDetector = null;
    // this.minConfidence = 0.9;
  }

  /**
   * Initialize the handler with callbacks
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onNoteDetected - Called when a note is detected
   * @param {Function} callbacks.onNoteReleased - Called when a note is released
   */
  init({ onNoteDetected, onNoteReleased }) {
    this.onNoteDetected = onNoteDetected;
    this.onNoteReleased = onNoteReleased;

    if (this.mode === 'audio') {
      this._initAudioMode();
    }
  }

  /**
   * Set the input mode
   * @param {'touch' | 'audio'} mode - The input mode to use
   */
  setMode(mode) {
    if (this.mode === mode) return;

    // Cleanup current mode
    if (this.mode === 'audio') {
      this._stopAudioMode();
    }

    this.mode = mode;

    // Initialize new mode
    if (mode === 'audio') {
      this._initAudioMode();
    }
  }

  /**
   * Register a touch/click input for a note (touch mode)
   * @param {string} note - The note that was pressed (e.g., 'C4', 'D#4')
   */
  registerTouch(note) {
    if (this.mode !== 'touch') return;

    this.activeNotes.add(note);
    this.onNoteDetected?.(note, {
      source: 'touch',
      timestamp: Date.now(),
      velocity: 100 // Default velocity for touch
    });
  }

  /**
   * Register a touch/click release for a note (touch mode)
   * @param {string} note - The note that was released
   */
  releaseTouch(note) {
    if (this.mode !== 'touch') return;

    this.activeNotes.delete(note);
    this.onNoteReleased?.(note, {
      source: 'touch',
      timestamp: Date.now()
    });
  }

  /**
   * Check if a specific note is currently active
   * @param {string} note - The note to check
   * @returns {boolean}
   */
  isNoteActive(note) {
    return this.activeNotes.has(note);
  }

  /**
   * Get all currently active notes
   * @returns {string[]}
   */
  getActiveNotes() {
    return Array.from(this.activeNotes);
  }

  /**
   * Clear all active notes
   */
  clearActiveNotes() {
    this.activeNotes.clear();
  }

  /**
   * Cleanup and destroy the handler
   */
  destroy() {
    if (this.mode === 'audio') {
      this._stopAudioMode();
    }
    this.onNoteDetected = null;
    this.onNoteReleased = null;
    this.activeNotes.clear();
  }

  // ============================================
  // FUTURE: Audio Mode Implementation
  // ============================================

  /**
   * Initialize audio mode for pitch detection
   * @private
   */
  _initAudioMode() {
    // FUTURE IMPLEMENTATION:
    // This method will:
    // 1. Request microphone permission
    // 2. Create AudioContext and AnalyserNode
    // 3. Initialize pitch detection algorithm (e.g., autocorrelation, YIN, or ML-based)
    // 4. Start the detection loop

    console.warn('Audio mode is not yet implemented. Using touch mode.');
    this.mode = 'touch';

    /*
    async _initAudioMode() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        source.connect(this.analyser);

        // Initialize pitch detector (e.g., using pitchfinder library)
        // this.pitchDetector = new PitchDetector(this.audioContext.sampleRate);

        this._startPitchDetection();
      } catch (error) {
        console.error('Failed to initialize audio mode:', error);
        this.mode = 'touch';
      }
    }
    */
  }

  /**
   * Stop audio mode and cleanup resources
   * @private
   */
  _stopAudioMode() {
    // FUTURE IMPLEMENTATION:
    // This method will:
    // 1. Stop the detection loop
    // 2. Close the AudioContext
    // 3. Release microphone

    /*
    _stopAudioMode() {
      if (this.detectionLoop) {
        cancelAnimationFrame(this.detectionLoop);
      }
      if (this.audioContext) {
        this.audioContext.close();
      }
      this.audioContext = null;
      this.analyser = null;
    }
    */
  }

  /**
   * Start the pitch detection loop
   * @private
   */
  _startPitchDetection() {
    // FUTURE IMPLEMENTATION:
    // This method will run a loop that:
    // 1. Gets audio data from the analyser
    // 2. Runs pitch detection
    // 3. Converts frequency to note
    // 4. Fires onNoteDetected callback

    /*
    _startPitchDetection() {
      const bufferLength = this.analyser.fftSize;
      const buffer = new Float32Array(bufferLength);

      const detect = () => {
        this.analyser.getFloatTimeDomainData(buffer);
        const { frequency, confidence } = this.pitchDetector.detect(buffer);

        if (confidence > this.minConfidence && frequency > 0) {
          const note = this._frequencyToNote(frequency);
          if (!this.activeNotes.has(note)) {
            this.activeNotes.add(note);
            this.onNoteDetected?.(note, {
              source: 'audio',
              timestamp: Date.now(),
              frequency,
              confidence,
              velocity: this._estimateVelocity(buffer)
            });
          }
        } else {
          // Note ended
          for (const note of this.activeNotes) {
            this.activeNotes.delete(note);
            this.onNoteReleased?.(note, {
              source: 'audio',
              timestamp: Date.now()
            });
          }
        }

        this.detectionLoop = requestAnimationFrame(detect);
      };

      detect();
    }
    */
  }

  /**
   * Convert a frequency in Hz to a note name
   * @param {number} frequency - Frequency in Hz
   * @returns {string} Note name (e.g., 'C4', 'D#4')
   * @private
   */
  _frequencyToNote(frequency) {
    // A4 = 440Hz, MIDI note 69
    const A4 = 440;
    const A4_MIDI = 69;

    // Calculate MIDI note number
    const midiNote = Math.round(12 * Math.log2(frequency / A4) + A4_MIDI);

    // Convert MIDI to note name
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;

    return `${noteNames[noteIndex]}${octave}`;
  }

  /**
   * Convert a note name to frequency in Hz
   * @param {string} note - Note name (e.g., 'C4', 'D#4')
   * @returns {number} Frequency in Hz
   */
  static noteToFrequency(note) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const match = note.match(/^([A-G]#?)(\d+)$/);

    if (!match) return 0;

    const [, noteName, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);
    const noteIndex = noteNames.indexOf(noteName);

    if (noteIndex === -1) return 0;

    // Calculate MIDI note number
    const midiNote = (octave + 1) * 12 + noteIndex;

    // Convert MIDI to frequency (A4 = 440Hz = MIDI 69)
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }
}

// Singleton instance for the application
let handlerInstance = null;

export const getNoteInputHandler = () => {
  if (!handlerInstance) {
    handlerInstance = new NoteInputHandler('touch');
  }
  return handlerInstance;
};

export const resetNoteInputHandler = () => {
  if (handlerInstance) {
    handlerInstance.destroy();
    handlerInstance = null;
  }
};

export default NoteInputHandler;
