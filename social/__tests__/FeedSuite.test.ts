import { useFeedStore, FeedType } from '../src/store/useFeedStore';
import { FeedRankingService } from '../src/core/feed/FeedRankingService';
import { FeedCacheService } from '../src/core/feed/FeedCacheService';
import { FeedPrefetchService } from '../src/core/feed/FeedPrefetchService';
import {
  HomeScreen,
  PostCard,
  StoryBar,
  CommentsModal,
  RepostModal,
  ShareSheetModal,
} from '../src/features/feed';

describe('Enterprise Feed System Suite', () => {
  beforeEach(() => {
    // Reset feed store
    useFeedStore.setState({
      activeFeedType: 'home',
      page: 1,
      hasMore: true,
      isLoadingMore: false,
      isRefreshing: false,
    });
  });

  test('All Feed screens and interaction modals are defined and exportable', () => {
    expect(HomeScreen).toBeDefined();
    expect(PostCard).toBeDefined();
    expect(StoryBar).toBeDefined();
    expect(CommentsModal).toBeDefined();
    expect(RepostModal).toBeDefined();
    expect(ShareSheetModal).toBeDefined();
  });

  test('FeedRankingService calculates scores and filters all 6 Feed Types', () => {
    const posts = useFeedStore.getState().posts;
    const feedTypes: FeedType[] = ['home', 'following', 'friends', 'trending', 'local', 'video'];

    feedTypes.forEach((type) => {
      const ranked = FeedRankingService.rankPosts(posts, type);
      expect(ranked).toBeInstanceOf(Array);

      if (type === 'video') {
        ranked.forEach((p) => expect(p.videoUrl).toBeDefined());
      }
      if (type === 'local') {
        ranked.forEach((p) => expect(p.location).toBeDefined());
      }
    });

    const score = FeedRankingService.calculatePostScore(posts[0]);
    expect(score).toBeGreaterThan(0);
  });

  test('FeedCacheService saves and retrieves partitioned feed caches with TTL', () => {
    const posts = useFeedStore.getState().posts;
    FeedCacheService.saveFeed('trending', posts);

    const cached = FeedCacheService.getCachedFeed('trending');
    expect(cached).toHaveLength(posts.length);

    FeedCacheService.clearFeedCache('trending');
    expect(FeedCacheService.getCachedFeed('trending')).toBeNull();
  });

  test('FeedPrefetchService handles batch media prefetching without errors', async () => {
    const posts = useFeedStore.getState().posts;
    await expect(FeedPrefetchService.prefetchPostMedia(posts)).resolves.not.toThrow();
  });

  test('All 7 reactions are accurately tracked on posts', () => {
    const post = useFeedStore.getState().posts[0];
    
    // Clear initial reaction
    if (post.userReaction) {
      useFeedStore.getState().reactToPost(post.id, post.userReaction);
    }

    const reactions: Array<'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry'> = [
      'like',
      'love',
      'care',
      'haha',
      'wow',
      'sad',
      'angry',
    ];

    reactions.forEach((reaction) => {
      useFeedStore.getState().reactToPost(post.id, reaction);
      const updated = useFeedStore.getState().posts.find((p) => p.id === post.id);
      expect(updated?.userReaction).toBe(reaction);
    });
  });

  test('Post interactions: comments, nested replies, liking comments, reposting, and bookmarks', () => {
    const post = useFeedStore.getState().posts[0];

    // Add Comment
    useFeedStore.getState().addComment(post.id, {
      postId: post.id,
      authorId: 'usr_test',
      authorName: 'Tester',
      authorAvatar: '',
      content: 'Great breakthrough!',
    });
    const comments = useFeedStore.getState().comments[post.id];
    expect(comments).toBeDefined();
    expect(comments.length).toBeGreaterThan(0);

    const firstComment = comments[0];

    // Add Reply
    useFeedStore.getState().addCommentReply(post.id, firstComment.id, {
      postId: post.id,
      authorId: 'usr_sarah',
      authorName: 'Sarah',
      authorAvatar: '',
      content: 'Thank you!',
    });
    expect(useFeedStore.getState().comments[post.id][0].replies?.length).toBeGreaterThan(0);

    // Like Comment
    useFeedStore.getState().likeComment(post.id, firstComment.id);
    expect(useFeedStore.getState().comments[post.id][0].isLiked).toBe(true);

    // Repost Post
    useFeedStore.getState().repostPost(post.id, 'Must read research!');
    const updatedPost = useFeedStore.getState().posts.find((p) => p.id === post.id);
    expect(updatedPost?.isReposted).toBe(true);

    // Toggle Bookmark
    useFeedStore.getState().toggleBookmark(post.id);
    expect(useFeedStore.getState().bookmarks.includes(post.id)).toBe(true);
  });

  test('Feed pagination and pull-to-refresh execution', async () => {
    const initialCount = useFeedStore.getState().posts.length;

    // Fetch next page
    await useFeedStore.getState().fetchNextPage();
    expect(useFeedStore.getState().posts.length).toBeGreaterThan(initialCount);
    expect(useFeedStore.getState().page).toBe(2);

    // Pull to refresh
    await useFeedStore.getState().refreshFeed();
    expect(useFeedStore.getState().page).toBe(1);
  });
});
