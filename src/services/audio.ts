import { Howl } from 'howler';

export type SoundEffect =
  | 'tap'
  | 'success'
  | 'wave'
  | 'horn'
  | 'ding'
  | 'whoosh'
  | 'cheer'
  | 'snap'
  | 'splash';

/**
 * Lightweight wrapper around Howler so the games can trigger shared sound
 * effects and background loops without worrying about platform quirks.
 */
class AudioService {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private initialized = false;
  private musicEnabled = true;
  private sfxEnabled = true;
  private backgroundMusic?: Howl;

  async initialize() {
    if (this.initialized) return;

    // Note: Audio files are optional for development
    // The app will work without them, just silently
    console.log('Audio service initialized (files optional for testing)');

    this.initialized = true;

    // Don't try to load audio files until they're added
    // This prevents the HTML5 Audio pool exhaustion warnings
    // Uncomment the code below when you add audio files to public/assets/audio/

    /*
    const soundDefinitions: Record<SoundEffect, string> = {
      tap: '/assets/audio/tap.mp3',
      success: '/assets/audio/success.mp3',
      wave: '/assets/audio/wave.mp3',
      horn: '/assets/audio/horn.mp3',
      ding: '/assets/audio/ding.mp3',
      whoosh: '/assets/audio/whoosh.mp3',
      cheer: '/assets/audio/cheer.mp3',
      snap: '/assets/audio/snap.mp3',
      splash: '/assets/audio/splash.mp3'
    };

    for (const [key, src] of Object.entries(soundDefinitions)) {
      try {
        const sound = new Howl({
          src: [src],
          preload: false, // Don't preload until files exist
          volume: 0.7,
          html5: true
        });
        this.sounds.set(key as SoundEffect, sound);
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error);
      }
    }

    try {
      this.backgroundMusic = new Howl({
        src: ['/assets/audio/background-ocean.mp3'],
        loop: true,
        volume: 0.3,
        html5: true,
        preload: false
      });
    } catch (error) {
      console.warn('Failed to load background music', error);
    }
    */
  }

  play(soundEffect: SoundEffect) {
    if (!this.sfxEnabled) return;

    const sound = this.sounds.get(soundEffect);
    if (sound) {
      sound.play();
    }
  }

  playBackgroundMusic() {
    if (this.musicEnabled && this.backgroundMusic && !this.backgroundMusic.playing()) {
      this.backgroundMusic.play();
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    return this.musicEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  getMusicEnabled() {
    return this.musicEnabled;
  }

  getSfxEnabled() {
    return this.sfxEnabled;
  }
}

export const audioService = new AudioService();
