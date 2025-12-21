import { Audio } from 'expo-av';

// Simple singleton sound manager using expo-av
// Place audio files under `src/assets/sounds/` with names like:
// click.mp3, vote.mp3, reveal.mp3, win.mp3, lose.mp3

const SoundManager = {
  enabled: true,
  sounds: {},

  async initAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      console.warn('Audio mode init failed', e);
    }
  },

  async register(key, assetModule) {
    try {
      await this.initAudioMode();
      const { sound } = await Audio.Sound.createAsync(assetModule);
      this.sounds[key] = sound;
      return sound;
    } catch (e) {
      console.warn(`Failed to register sound ${key}`, e);
      return null;
    }
  },

  async play(key) {
    if (!this.enabled) return;
    const sound = this.sounds[key];
    if (!sound) {
      // Not registered — ignore silently but warn in dev
      // console.warn('No sound registered for', key);
      return;
    }

    try {
      // replay from start
      try { await sound.replayAsync(); return; } catch (e) {}
      try { await sound.setPositionAsync(0); await sound.playAsync(); } catch (e) { await sound.playAsync(); }
    } catch (e) {
      console.warn('Error playing sound', key, e);
    }
  },

  setEnabled(flag) {
    this.enabled = !!flag;
    if (!this.enabled) {
      // stop any playing sounds
      Object.values(this.sounds).forEach(s => s?.stopAsync?.().catch(()=>{}));
    }
  },

  async unloadAll() {
    await Promise.all(
      Object.values(this.sounds).map(s => s?.unloadAsync?.().catch(()=>{}))
    );
    this.sounds = {};
  }
};

export default SoundManager;
export const registerSound = (k, asset) => SoundManager.register(k, asset);
export const playSound = (k) => SoundManager.play(k);
export const setSoundEnabled = (b) => SoundManager.setEnabled(b);
export const unloadAllSounds = () => SoundManager.unloadAll();
