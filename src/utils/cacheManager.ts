/**
 * Centralized Cache Manager
 *
 * Provides in-memory caching with automatic TTL (Time-To-Live) expiration,
 * prefix-based invalidation, and global cache purge functionality.
 *
 * Prevents stale content from surviving across content updates, technology changes,
 * topic navigations, or pull-to-refresh actions.
 */

export const DEFAULT_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private ttl: number;

  constructor(ttlMs = DEFAULT_CACHE_TTL_MS) {
    this.ttl = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  set(key: string, data: T): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  deletePrefix(prefix: string): void {
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Global registry of all screen caches for system-wide purge
const registeredCaches: Array<MemoryCache<any>> = [];

export const registerCache = <T>(cache: MemoryCache<T>): MemoryCache<T> => {
  registeredCaches.push(cache);
  return cache;
};

/**
 * Purges all in-memory catalog, topic, question, and query caches.
 * Call when backend content reset is detected, user triggers global refresh, or session resets.
 */
export const invalidateAllContentCaches = (): void => {
  for (const cache of registeredCaches) {
    cache.clear();
  }
};
