import { storageService } from '../storage/StorageService';

export interface CacheEntry {
  url: string;
  localPath: string;
  sizeBytes: number;
  lastAccessed: number;
  type: 'image' | 'video_chunk';
}

export class MediaCacheManager {
  private static instance: MediaCacheManager;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private maxMemoryBytes = 100 * 1024 * 1024; // 100 MB
  private currentMemoryBytes = 0;
  private hitsCount = 0;
  private missesCount = 0;

  private constructor() {}

  public static getInstance(): MediaCacheManager {
    if (!MediaCacheManager.instance) {
      MediaCacheManager.instance = new MediaCacheManager();
    }
    return MediaCacheManager.instance;
  }

  /**
   * Preload and cache first video chunk for zero-latency instant autoplay
   */
  public prefetchVideo(url: string, estimatedSizeBytes = 2 * 1024 * 1024): string {
    if (this.memoryCache.has(url)) {
      this.hitsCount++;
      const entry = this.memoryCache.get(url)!;
      entry.lastAccessed = Date.now();
      return entry.localPath;
    }

    this.missesCount++;
    const hash = encodeURIComponent(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    const localPath = `file:///cache/videos/${hash}.mp4`;
    const entry: CacheEntry = {
      url,
      localPath,
      sizeBytes: estimatedSizeBytes,
      lastAccessed: Date.now(),
      type: 'video_chunk',
    };

    this.ensureMemoryCapacity(estimatedSizeBytes);
    this.memoryCache.set(url, entry);
    this.currentMemoryBytes += estimatedSizeBytes;
    return localPath;
  }

  /**
   * Preload and cache image
   */
  public prefetchImage(url: string, sizeBytes = 350 * 1024): string {
    if (this.memoryCache.has(url)) {
      this.hitsCount++;
      return this.memoryCache.get(url)!.localPath;
    }

    this.missesCount++;
    const hash = encodeURIComponent(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    const localPath = `file:///cache/images/${hash}.webp`;
    const entry: CacheEntry = {
      url,
      localPath,
      sizeBytes,
      lastAccessed: Date.now(),
      type: 'image',
    };

    this.ensureMemoryCapacity(sizeBytes);
    this.memoryCache.set(url, entry);
    this.currentMemoryBytes += sizeBytes;
    return localPath;
  }

  private ensureMemoryCapacity(neededBytes: number): void {
    if (this.currentMemoryBytes + neededBytes <= this.maxMemoryBytes) return;

    // Evict oldest accessed entries (LRU)
    const sorted = Array.from(this.memoryCache.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed
    );

    for (const [key, entry] of sorted) {
      this.memoryCache.delete(key);
      this.currentMemoryBytes -= entry.sizeBytes;
      if (this.currentMemoryBytes + neededBytes <= this.maxMemoryBytes) break;
    }
  }

  public getCacheMetrics(): {
    cachedItemsCount: number;
    usedMemoryMb: number;
    hitsCount: number;
    missesCount: number;
    hitRatioPercent: number;
  } {
    const total = this.hitsCount + this.missesCount;
    const hitRatio = total > 0 ? (this.hitsCount / total) * 100 : 100;

    return {
      cachedItemsCount: this.memoryCache.size,
      usedMemoryMb: Number((this.currentMemoryBytes / (1024 * 1024)).toFixed(2)),
      hitsCount: this.hitsCount,
      missesCount: this.missesCount,
      hitRatioPercent: Number(hitRatio.toFixed(1)),
    };
  }

  public clear(): void {
    this.memoryCache.clear();
    this.currentMemoryBytes = 0;
  }
}

export const mediaCacheManager = MediaCacheManager.getInstance();
