import AsyncStorage from '@react-native-async-storage/async-storage';
import { MasteryStatus } from '../types/progress';

export interface LocalQuestionProgress {
  status: MasteryStatus;
  reviewCount: number;
  lastReviewedAt: string;
}

export interface ProgressStats {
  totalReviewed: number;
  knownCount: number;
  reviewCount: number;
  weakCount: number;
}

export interface LastOpenedQuestion {
  questionId: string;
  title: string;
  technologyName: string;
  topicName?: string;
  technologySlug?: string;
  topicSlug?: string;
  openedAt: string;
}

const STORAGE_KEYS = {
  PROGRESS: '@interview_prep_progress',
  SAVED: '@interview_prep_saved',
  RECENTLY_VIEWED: '@interview_prep_recently_viewed',
  LAST_SESSION: '@interview_prep_last_session',
  LAST_OPENED: '@interview_prep_last_opened',
};

// In-memory cache for ultra-fast, synchronous-like lookups and offline resilience
let progressCache: Record<string, LocalQuestionProgress> | null = null;
let savedCache: Set<string> | null = null;
let recentlyViewedCache: string[] | null = null;
let lastOpenedCache: LastOpenedQuestion | null = null;

export const progressStorage = {
  /**
   * Initializes local cache from storage
   */
  async init(): Promise<void> {
    try {
      const [rawProgress, rawSaved, rawRecent, rawLastOpened] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED),
        AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_OPENED),
      ]);

      progressCache = rawProgress ? JSON.parse(rawProgress) : {};
      savedCache = new Set(rawSaved ? JSON.parse(rawSaved) : []);
      recentlyViewedCache = rawRecent ? JSON.parse(rawRecent) : [];
      lastOpenedCache = rawLastOpened ? JSON.parse(rawLastOpened) : null;
    } catch (error) {
      console.warn('[ProgressStorage] Failed to initialize from storage:', error);
      progressCache = {};
      savedCache = new Set();
      recentlyViewedCache = [];
      lastOpenedCache = null;
    }
  },

  /**
   * Retrieves progress for a specific question
   */
  async getProgress(questionId: string): Promise<LocalQuestionProgress | null> {
    if (!progressCache) await this.init();
    return progressCache?.[questionId] || null;
  },

  /**
   * Synchronous progress lookup from memory cache (ideal for list item rendering)
   */
  getProgressSync(questionId: string): LocalQuestionProgress | null {
    return progressCache?.[questionId] || null;
  },

  /**
   * Sets mastery status for a question (known, review, weak)
   */
  async setProgress(questionId: string, status: MasteryStatus): Promise<LocalQuestionProgress> {
    if (!progressCache) await this.init();

    const existing = progressCache![questionId];
    const updated: LocalQuestionProgress = {
      status,
      reviewCount: (existing?.reviewCount || 0) + 1,
      lastReviewedAt: new Date().toISOString(),
    };

    progressCache![questionId] = updated;

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressCache));
    } catch (error) {
      console.warn('[ProgressStorage] Failed to persist progress:', error);
    }

    return updated;
  },

  /**
   * Gets all progress records mapped by questionId
   */
  async getAllProgress(): Promise<Record<string, LocalQuestionProgress>> {
    if (!progressCache) await this.init();
    return { ...progressCache };
  },

  /**
   * Check if a question is saved/bookmarked
   */
  async isQuestionSaved(questionId: string): Promise<boolean> {
    if (!savedCache) await this.init();
    return savedCache!.has(questionId);
  },

  isQuestionSavedSync(questionId: string): boolean {
    return savedCache ? savedCache.has(questionId) : false;
  },

  /**
   * Toggles save/bookmark state for a question
   */
  async toggleSaveQuestion(questionId: string): Promise<boolean> {
    if (!savedCache) await this.init();

    const isCurrentlySaved = savedCache!.has(questionId);
    if (isCurrentlySaved) {
      savedCache!.delete(questionId);
    } else {
      savedCache!.add(questionId);
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(Array.from(savedCache!)));
    } catch (error) {
      console.warn('[ProgressStorage] Failed to persist saved questions:', error);
    }

    return !isCurrentlySaved;
  },

  /**
   * Returns array of saved question IDs
   */
  async getSavedQuestionIds(): Promise<string[]> {
    if (!savedCache) await this.init();
    return Array.from(savedCache!);
  },

  /**
   * Records a question in the recently viewed queue (latest 10)
   */
  async recordRecentlyViewed(questionId: string): Promise<void> {
    if (!recentlyViewedCache) await this.init();

    // Remove if already present, then unshift to front
    recentlyViewedCache = [questionId, ...recentlyViewedCache!.filter((id) => id !== questionId)].slice(0, 10);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewedCache));
    } catch (error) {
      console.warn('[ProgressStorage] Failed to persist recently viewed:', error);
    }
  },

  /**
   * Returns recently viewed question IDs
   */
  async getRecentlyViewedIds(limit = 10): Promise<string[]> {
    if (!recentlyViewedCache) await this.init();
    return recentlyViewedCache!.slice(0, limit);
  },

  /**
   * Records last opened question metadata for Continue Learning
   */
  async recordLastOpened(meta: LastOpenedQuestion): Promise<void> {
    lastOpenedCache = meta;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_OPENED, JSON.stringify(meta));
    } catch (error) {
      console.warn('[ProgressStorage] Failed to persist last opened question:', error);
    }
  },

  /**
   * Gets last opened question metadata
   */
  async getLastOpened(): Promise<LastOpenedQuestion | null> {
    if (!lastOpenedCache) await this.init();
    return lastOpenedCache;
  },

  getLastOpenedSync(): LastOpenedQuestion | null {
    return lastOpenedCache;
  },

  /**
   * Computes aggregate progress statistics
   */
  async getProgressStats(): Promise<ProgressStats> {
    if (!progressCache) await this.init();

    const values = Object.values(progressCache || {});
    let knownCount = 0;
    let reviewCount = 0;
    let weakCount = 0;

    for (const item of values) {
      if (item.status === 'known') knownCount++;
      else if (item.status === 'review') reviewCount++;
      else if (item.status === 'weak') weakCount++;
    }

    return {
      totalReviewed: values.length,
      knownCount,
      reviewCount,
      weakCount,
    };
  },

  /**
   * Resets all progress (useful for user testing/reset)
   */
  async clearAll(): Promise<void> {
    progressCache = {};
    savedCache = new Set();
    recentlyViewedCache = [];

    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROGRESS,
      STORAGE_KEYS.SAVED,
      STORAGE_KEYS.RECENTLY_VIEWED,
      STORAGE_KEYS.LAST_SESSION,
    ]);
  },
};
