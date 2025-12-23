import { Audio } from "expo-av";

const FADE_DURATION = 800;
const FADE_STEPS = 20;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const SoundManager = {
  enabled: true,
  sounds: {},
  music: null,
  currentMusic: null,

  async initAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      console.warn("Audio mode init failed", e);
    }
  },

  /* 🔊 EFECTOS */

  async register(key, asset) {
    await this.initAudioMode();
    const { sound } = await Audio.Sound.createAsync(asset);
    this.sounds[key] = sound;
  },

  async play(key) {
    if (!this.enabled) return;
    const sound = this.sounds[key];
    if (!sound) return;

    try {
      await sound.replayAsync();
    } catch {}
  },

  /* 🎵 FADE HELPERS */

  async fadeOut(sound, fromVolume = 0.4) {
    if (!sound) return;

    const stepTime = FADE_DURATION / FADE_STEPS;
    const stepVolume = fromVolume / FADE_STEPS;

    for (let v = fromVolume; v > 0; v -= stepVolume) {
      await sound.setVolumeAsync(Math.max(v, 0));
      await sleep(stepTime);
    }
  },

  async fadeIn(sound, toVolume = 0.4) {
    const stepTime = FADE_DURATION / FADE_STEPS;
    const stepVolume = toVolume / FADE_STEPS;

    for (let v = 0; v <= toVolume; v += stepVolume) {
      await sound.setVolumeAsync(Math.min(v, toVolume));
      await sleep(stepTime);
    }
  },

  /* 🎼 MÚSICA */

  async playMusic(key, asset, volume = 0.4) {
    if (!this.enabled) return;
    if (this.currentMusic === key) return;

    await this.initAudioMode();

    if (this.music) {
      await this.fadeOut(this.music, volume);
      await this.music.stopAsync();
      await this.music.unloadAsync();
      this.music = null;
      this.currentMusic = null;
    }

    const { sound } = await Audio.Sound.createAsync(asset, {
      isLooping: true,
      volume: 0,
    });

    this.music = sound;
    this.currentMusic = key;

    await sound.playAsync();
    await this.fadeIn(sound, volume);
  },

  async stopMusic() {
    if (this.music) {
      await this.fadeOut(this.music);
      await this.music.stopAsync();
      await this.music.unloadAsync();
      this.music = null;
      this.currentMusic = null;
    }
  },

  setEnabled(flag) {
    this.enabled = flag;
    if (!flag) {
      this.stopMusic();
      Object.values(this.sounds).forEach((s) => s?.stopAsync?.());
    }
  },
};

export default SoundManager;

export const registerSound = (k, a) => SoundManager.register(k, a);
export const playSound = (k) => SoundManager.play(k);
export const playMusic = (k, a, v) => SoundManager.playMusic(k, a, v);
export const stopMusic = () => SoundManager.stopMusic();
export const setSoundEnabled = (b) => SoundManager.setEnabled(b);
