interface CacheEntry {
  data: unknown;
  freshUntil: number;
  staleUntil: number;
}

interface QueryCacheOptions {
  capacity?: number;
  staleMs?: number;
  retryMs?: number;
  now?: () => number;
  onError?: (key: string, error: unknown) => void;
}

// Retain the last successful public content during a short database outage.
// Concurrent requests for the same data share one database operation.
export class QueryCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly pending = new Map<string, Promise<unknown>>();
  private readonly capacity: number;
  private readonly staleMs: number;
  private readonly retryMs: number;
  private readonly now: () => number;
  private readonly onError?: QueryCacheOptions['onError'];

  constructor(options: QueryCacheOptions = {}) {
    this.capacity = options.capacity ?? 500;
    this.staleMs = options.staleMs ?? 30 * 60 * 1000;
    this.retryMs = options.retryMs ?? 5000;
    this.now = options.now ?? Date.now;
    this.onError = options.onError;
  }

  async get<T>(key: string, load: () => Promise<T>, ttlMs = 60000): Promise<T> {
    const cached = this.entries.get(key);
    if (cached && cached.freshUntil > this.now()) {
      return cached.data as T;
    }

    const pending = this.pending.get(key);
    if (pending) return pending as Promise<T>;

    const request = Promise.resolve().then(load).then((data) => {
      if (!this.entries.has(key) && this.entries.size >= this.capacity) {
        const oldest = this.entries.keys().next().value;
        if (oldest !== undefined) this.entries.delete(oldest);
      }
      const freshUntil = this.now() + ttlMs;
      this.entries.set(key, { data, freshUntil, staleUntil: freshUntil + this.staleMs });
      return data;
    }).catch((error: unknown) => {
      this.onError?.(key, error);
      if (cached && cached.staleUntil > this.now()) {
        cached.freshUntil = Math.min(this.now() + this.retryMs, cached.staleUntil);
        return cached.data as T;
      }
      this.entries.delete(key);
      // A cold failure must reach Next.js, which can retain the last good ISR
      // page. Returning [] or null here would cache an empty page or false 404.
      throw error;
    }).finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, request);
    return request;
  }
}
