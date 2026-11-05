import { Vibration, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const SOUND_ENABLED_KEY = '@interview_prep_sound_enabled';

class SoundService {
  private soundEnabled: boolean = true;
  private isConfigured: boolean = false;
  private correctPlayer: any = null;
  private wrongPlayer: any = null;

  constructor() {
    this.init();
  }

  async init() {
    try {
      const stored = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
      await this.configureAudioMode();
    } catch {
      // Graceful fallback
    }
  }

  private async configureAudioMode() {
    if (this.isConfigured) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        interruptionMode: 'duckOthers',
      });
      this.isConfigured = true;
    } catch {
      // Graceful fallback
    }
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  async setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      await AsyncStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }

  async playCorrectSound() {
    if (!this.soundEnabled) return;

    // Haptic vibration feedback for instant physical feel
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate(40);
      }
    } catch {
      // Ignore vibration error
    }

    // Audio playback via official expo-audio
    try {
      await this.configureAudioMode();
      if (!this.correctPlayer) {
        this.correctPlayer = createAudioPlayer(require('../../assets/sounds/correct.wav'));
      } else if (this.correctPlayer.seekTo) {
        await this.correctPlayer.seekTo(0);
      }
      if (this.correctPlayer && this.correctPlayer.play) {
        this.correctPlayer.play();
      }
    } catch {
      // Graceful fallback
    }
  }

  async playWrongSound() {
    if (!this.soundEnabled) return;

    // Haptic vibration feedback (double buzz) for wrong answer
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 50, 40, 50]);
      }
    } catch {
      // Ignore vibration error
    }

    // Audio playback via official expo-audio
    try {
      await this.configureAudioMode();
      if (!this.wrongPlayer) {
        this.wrongPlayer = createAudioPlayer(require('../../assets/sounds/wrong.wav'));
      } else if (this.wrongPlayer.seekTo) {
        await this.wrongPlayer.seekTo(0);
      }
      if (this.wrongPlayer && this.wrongPlayer.play) {
        this.wrongPlayer.play();
      }
    } catch {
      // Graceful fallback
    }
  }
}

export const soundService = new SoundService();
