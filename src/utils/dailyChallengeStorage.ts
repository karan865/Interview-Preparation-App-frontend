import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyChallengeSettings,
  DailyChallengeState,
  DailyStreakData,
  DailyHistoryEntry,
} from '../types/dailyChallenge';

const STORAGE_KEYS = {
  SETTINGS: '@daily_challenge_settings_v1',
  TODAY_STATE: '@daily_challenge_state_v1',
  STREAK: '@daily_challenge_streak_v1',
  HISTORY: '@daily_challenge_history_v1',
};

export const DEFAULT_DAILY_SETTINGS: DailyChallengeSettings = {
  learningQuestionCount: 20,
  testQuestionCount: 10,
  passingScore: 80,
  technologyIds: [],
};

export const DEFAULT_DAILY_STREAK: DailyStreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
};

export const dailyChallengeStorage = {
  async loadSettings(): Promise<DailyChallengeSettings> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_DAILY_SETTINGS;
      const parsed = JSON.parse(raw);
      return {
        learningQuestionCount: [10, 20, 30].includes(parsed.learningQuestionCount)
          ? parsed.learningQuestionCount
          : 20,
        testQuestionCount: [10, 20, 30].includes(parsed.testQuestionCount)
          ? parsed.testQuestionCount
          : 10,
        passingScore: [70, 80].includes(parsed.passingScore) ? parsed.passingScore : 80,
        technologyIds: Array.isArray(parsed.technologyIds) ? parsed.technologyIds : [],
      };
    } catch {
      return DEFAULT_DAILY_SETTINGS;
    }
  },

  async saveSettings(settings: DailyChallengeSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save daily challenge settings', e);
    }
  },

  async loadTodayState(): Promise<DailyChallengeState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.TODAY_STATE);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async saveTodayState(state: DailyChallengeState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TODAY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save daily challenge state', e);
    }
  },

  async clearTodayState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TODAY_STATE);
    } catch (e) {
      console.warn('Failed to clear daily challenge state', e);
    }
  },

  async loadStreak(): Promise<DailyStreakData> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
      if (!raw) return DEFAULT_DAILY_STREAK;
      const parsed = JSON.parse(raw);
      return {
        currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
        longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
        lastCompletedDate: parsed.lastCompletedDate || null,
      };
    } catch {
      return DEFAULT_DAILY_STREAK;
    }
  },

  async saveStreak(streak: DailyStreakData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    } catch (e) {
      console.warn('Failed to save daily challenge streak', e);
    }
  },

  async loadHistory(): Promise<DailyHistoryEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async appendHistory(entry: DailyHistoryEntry): Promise<void> {
    try {
      const current = await this.loadHistory();
      // Replace existing entry for same date or prepend
      const filtered = current.filter((item) => item.date !== entry.date);
      const updated = [entry, ...filtered].slice(0, 30); // keep last 30 days
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to append daily challenge history', e);
    }
  },
};
