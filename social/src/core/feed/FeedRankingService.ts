import { PostModel, FeedType } from '../../store/useFeedStore';

export interface RankingFactors {
  recencyWeight: number;
  engagementWeight: number;
  affinityWeight: number;
  mediaBonus: number;
}

const DEFAULT_FACTORS: RankingFactors = {
  recencyWeight: 0.35,
  engagementWeight: 0.40,
  affinityWeight: 0.15,
  mediaBonus: 0.10,
};

export class FeedRankingService {
  /**
   * Calculate a normalized ranking score for a post (0 to 100+)
   */
  public static calculatePostScore(
    post: PostModel,
    followingIds: Set<string> = new Set(['usr_1', 'usr_2', 'usr_3']),
    userLocation: string = 'San Francisco, CA',
    factors: RankingFactors = DEFAULT_FACTORS
  ): number {
    // 1. Recency Decay (exponential half-life decay)
    let ageInHours = 1;
    if (post.createdAt.includes('m ago')) {
      ageInHours = parseInt(post.createdAt, 10) / 60 || 0.5;
    } else if (post.createdAt.includes('h ago')) {
      ageInHours = parseInt(post.createdAt, 10) || 2;
    } else if (post.createdAt.includes('d ago')) {
      ageInHours = (parseInt(post.createdAt, 10) || 1) * 24;
    }
    const recencyScore = Math.max(0, 100 * Math.exp(-ageInHours / 12));

    // 2. Engagement Velocity Score
    const totalReactions = Object.values(post.reactionsCount).reduce((a, b) => a + b, 0);
    const engagementScore =
      totalReactions * 1.5 +
      post.commentsCount * 3.0 +
      post.sharesCount * 4.0 +
      post.repostsCount * 5.0;

    // 3. Relationship Affinity
    const isFollowed = followingIds.has(post.authorId);
    const affinityScore = isFollowed ? 80 : 20;

    // 4. Media Richness Bonus
    let mediaScore = 0;
    if (post.videoUrl) mediaScore += 40;
    if (post.mediaUrls && post.mediaUrls.length > 0) mediaScore += 25;
    if (post.poll) mediaScore += 30;

    const finalScore =
      recencyScore * factors.recencyWeight +
      engagementScore * factors.engagementWeight +
      affinityScore * factors.affinityWeight +
      mediaScore * factors.mediaBonus;

    return Math.round(finalScore * 100) / 100;
  }

  /**
   * Filter and Rank a list of posts according to active FeedType
   */
  public static rankPosts(
    posts: PostModel[],
    feedType: FeedType,
    followingIds: Set<string> = new Set(['usr_1', 'usr_2', 'usr_3']),
    userLocation: string = 'San Francisco, CA'
  ): PostModel[] {
    let filtered = [...posts];

    switch (feedType) {
      case 'home':
        // Algorithmic ranking based on engagement, recency, affinity
        return filtered.sort((a, b) => {
          const scoreA = this.calculatePostScore(a, followingIds, userLocation);
          const scoreB = this.calculatePostScore(b, followingIds, userLocation);
          return scoreB - scoreA;
        });

      case 'following':
        // Chronological order from followed authors
        filtered = filtered.filter((p) => followingIds.has(p.authorId));
        return filtered;

      case 'friends':
        // Close circle posts
        filtered = filtered.filter((p) => p.privacy === 'friends' || followingIds.has(p.authorId));
        return filtered;

      case 'trending':
        // Ranked strictly by viral velocity in past 24h
        return filtered.sort((a, b) => {
          const velA = Object.values(a.reactionsCount).reduce((x, y) => x + y, 0) + a.commentsCount * 2 + a.sharesCount * 3;
          const velB = Object.values(b.reactionsCount).reduce((x, y) => x + y, 0) + b.commentsCount * 2 + b.sharesCount * 3;
          return velB - velA;
        });

      case 'local':
        // Local posts matching city/region
        return filtered.filter(
          (p) =>
            Boolean(p.location) &&
            (p.location?.toLowerCase().includes('san francisco') ||
             p.location?.toLowerCase().includes('california') ||
             p.location?.toLowerCase().includes('uk') ||
             p.location?.toLowerCase().includes('london'))
        );

      case 'video':
        // Only posts containing video content
        return filtered.filter((p) => Boolean(p.videoUrl));

      default:
        return filtered;
    }
  }
}

export const feedRankingService = FeedRankingService;
