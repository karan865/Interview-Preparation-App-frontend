import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { CONFIG } from '../constants/config';

// In-memory fallback for web or environments where SecureStore isn't native
let memoryStorage: Record<string, string> = {};

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        } else {
          memoryStorage[key] = value;
        }
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn(`[Storage] Failed to set item for key: ${key}`, error);
      memoryStorage[key] = value;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return memoryStorage[key] || null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[Storage] Failed to get item for key: ${key}`, error);
      return memoryStorage[key] || null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        delete memoryStorage[key];
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn(`[Storage] Failed to remove item for key: ${key}`, error);
      delete memoryStorage[key];
    }
  },

  // Auth token specific helpers
  async getAuthToken(): Promise<string | null> {
    return this.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  },

  async setAuthToken(token: string): Promise<void> {
    return this.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async clearAuthToken(): Promise<void> {
    return this.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  },
};
