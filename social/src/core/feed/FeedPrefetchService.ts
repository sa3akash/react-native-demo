import { Image } from 'react-native';
import { PostModel } from '../../store/useFeedStore';

export class FeedPrefetchService {
  private static prefetchedUrls = new Set<string>();

  /**
   * Prefetch all media images and video thumbnails for a batch of feed posts
   */
  public static async prefetchPostMedia(posts: PostModel[]): Promise<void> {
    const urlsToPrefetch: string[] = [];

    posts.forEach((post) => {
      if (post.authorAvatar && !this.prefetchedUrls.has(post.authorAvatar)) {
        urlsToPrefetch.push(post.authorAvatar);
        this.prefetchedUrls.add(post.authorAvatar);
      }
      if (post.mediaUrls) {
        post.mediaUrls.forEach((url) => {
          if (!this.prefetchedUrls.has(url)) {
            urlsToPrefetch.push(url);
            this.prefetchedUrls.add(url);
          }
        });
      }
    });

    if (urlsToPrefetch.length === 0) return;

    // Batch prefetch with Promise.allSettled
    try {
      await Promise.allSettled(
        urlsToPrefetch.map((url) => Image.prefetch(url))
      );
    } catch {
      // Background prefetch silent failover
    }
  }

  public static clearCache(): void {
    this.prefetchedUrls.clear();
  }
}

export const feedPrefetchService = FeedPrefetchService;
