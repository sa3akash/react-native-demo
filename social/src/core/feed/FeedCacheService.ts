import { storageService } from '../storage/StorageService';
import { PostModel, FeedType } from '../../store/useFeedStore';

interface CachedFeedPayload {
  timestamp: number;
  posts: PostModel[];
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export class FeedCacheService {
  public static saveFeed(feedType: FeedType, posts: PostModel[]): void {
    const payload: CachedFeedPayload = {
      timestamp: Date.now(),
      posts,
    };
    storageService.setItem(`cached_feed_${feedType}`, payload);
  }

  public static getCachedFeed(feedType: FeedType): PostModel[] | null {
    const payload = storageService.getItem<CachedFeedPayload>(`cached_feed_${feedType}`);
    if (!payload) return null;

    const isExpired = Date.now() - payload.timestamp > CACHE_TTL_MS;
    if (isExpired) return null;

    return payload.posts;
  }

  public static clearFeedCache(feedType?: FeedType): void {
    if (feedType) {
      storageService.removeItem(`cached_feed_${feedType}`);
    } else {
      const types: FeedType[] = ['home', 'following', 'friends', 'trending', 'local', 'video'];
      types.forEach((t) => storageService.removeItem(`cached_feed_${t}`));
    }
  }
}

export const feedCacheService = FeedCacheService;
