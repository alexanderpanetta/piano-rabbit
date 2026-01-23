import { useRef, useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { SYNTH_CONFIGS, SOUND_EFFECTS } from '../utils/soundEffects';

/**
 * Custom hook for managing all audio in the game
 * Uses Tone.js for piano sounds and sound effects
 */
export const useAudio = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for synths (persistent across renders)
  const pianoSynthRef = useRef(null);
  const effectSynthsRef = useRef({});
  const activeNotesRef = useRef(new Map());

  /**
   * Initialize audio context and synths
   * Must be called after user interaction (browser audio policy)
   */
  const initAudio = useCallback(async () => {
    if (isAudioReady) return true;

    try {
      // Start Tone.js audio context
      await Tone.start();

      // Create piano synth with polyphony
      pianoSynthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'triangle8'
        },
        envelope: {
          attack: 0.005,
          decay: 0.3,
          sustain: 0.2,
          release: 1.5
        }
      }).toDestination();

      // Set volume
      pianoSynthRef.current.volume.value = -6;

      // Create effect synths
      Object.entries(SYNTH_CONFIGS).forEach(([name, config]) => {
        effectSynthsRef.current[name] = new Tone.PolySynth(Tone.Synth, config).toDestination();
        effectSynthsRef.current[name].volume.value = -8;
      });

      setIsAudioReady(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setIsLoading(false);
      return false;
    }
  }, [isAudioReady]);

  /**
   * Play a piano note
   * @param {string} note - Note to play (e.g., 'C4')
   * @param {number} duration - Duration in seconds (optional)
   */
  const playNote = useCallback((note, duration = 0.5) => {
    if (!pianoSynthRef.current || !isAudioReady) return;

    try {
      const now = Tone.now();
      pianoSynthRef.current.triggerAttackRelease(note, duration, now);

      // Track active note for visualization
      activeNotesRef.current.set(note, now);

      // Clear after duration
      setTimeout(() => {
        activeNotesRef.current.delete(note);
      }, duration * 1000);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [isAudioReady]);

  /**
   * Play multiple notes simultaneously (for diads/chords)
   * @param {string[]} notes - Array of notes to play
   * @param {number} duration - Duration in seconds
   */
  const playChord = useCallback((notes, duration = 0.5) => {
    if (!pianoSynthRef.current || !isAudioReady) return;

    try {
      const now = Tone.now();
      pianoSynthRef.current.triggerAttackRelease(notes, duration, now);

      notes.forEach(note => {
        activeNotesRef.current.set(note, now);
        setTimeout(() => {
          activeNotesRef.current.delete(note);
        }, duration * 1000);
      });
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }, [isAudioReady]);

  /**
   * Play a sound effect
   * @param {'correct' | 'incorrect' | 'goldMedal' | 'silverMedal' | 'bronzeMedal' | 'tryAgain' | 'levelStart' | 'click'} effectName
   */
  const playEffect = useCallback((effectName) => {
    if (!isAudioReady) return;

    const effect = SOUND_EFFECTS[effectName];
    if (!effect) {
      console.warn(`Unknown sound effect: ${effectName}`);
      return;
    }

    const synth = effectSynthsRef.current[effect.synth];
    if (!synth) {
      console.warn(`Unknown synth type: ${effect.synth}`);
      return;
    }

    try {
      const now = Tone.now();
      effect.notes.forEach((note, index) => {
        synth.triggerAttackRelease(
          note,
          effect.duration,
          now + index * effect.stagger
        );
      });
    } catch (error) {
      console.error('Error playing effect:', error);
    }
  }, [isAudioReady]);

  /**
   * Play the correct answer sound
   */
  const playCorrect = useCallback(() => {
    playEffect('correct');
  }, [playEffect]);

  /**
   * Play the incorrect answer sound
   */
  const playIncorrect = useCallback(() => {
    playEffect('incorrect');
  }, [playEffect]);

  /**
   * Play medal achievement sound
   * @param {'gold' | 'silver' | 'bronze' | 'none'} medal
   */
  const playMedalSound = useCallback((medal) => {
    const effectMap = {
      gold: 'goldMedal',
      silver: 'silverMedal',
      bronze: 'bronzeMedal',
      none: 'tryAgain'
    };
    playEffect(effectMap[medal] || 'tryAgain');
  }, [playEffect]);

  /**
   * Play UI click sound
   */
  const playClick = useCallback(() => {
    playEffect('click');
  }, [playEffect]);

  /**
   * Stop all sounds
   */
  const stopAll = useCallback(() => {
    if (pianoSynthRef.current) {
      pianoSynthRef.current.releaseAll();
    }
    Object.values(effectSynthsRef.current).forEach(synth => {
      synth?.releaseAll();
    });
    activeNotesRef.current.clear();
  }, []);

  /**
   * Set master volume
   * @param {number} volume - Volume from 0 to 1
   */
  const setVolume = useCallback((volume) => {
    const dbVolume = volume <= 0 ? -Infinity : 20 * Math.log10(volume);
    Tone.Destination.volume.value = dbVolume;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
      if (pianoSynthRef.current) {
        pianoSynthRef.current.dispose();
      }
      Object.values(effectSynthsRef.current).forEach(synth => {
        synth?.dispose();
      });
    };
  }, [stopAll]);

  return {
    isAudioReady,
    isLoading,
    initAudio,
    playNote,
    playChord,
    playEffect,
    playCorrect,
    playIncorrect,
    playMedalSound,
    playClick,
    stopAll,
    setVolume
  };
};

export default useAudio;
