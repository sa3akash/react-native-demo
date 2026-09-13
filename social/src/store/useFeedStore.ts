import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { ReactionType } from '../shared/components/organisms/ReactionPicker';
import { eventBus } from '../core/events/EventBus';
import { offlineSyncQueue } from '../core/network/offlineSyncQueue';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { FeedRankingService } from '../core/feed/FeedRankingService';
import { FeedCacheService } from '../core/feed/FeedCacheService';
import { FeedPrefetchService } from '../core/feed/FeedPrefetchService';

export type FeedType = 'home' | 'following' | 'friends' | 'trending' | 'local' | 'video';

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: PostComment[];
}

export interface PostModel {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline?: string;
  isVerified?: boolean;
  content: string;
  createdAt: string;
  privacy: 'public' | 'friends' | 'private';
  mediaUrls?: string[];
  videoUrl?: string;
  videoDuration?: string;
  poll?: {
    question: string;
    options: Array<{ id: string; text: string; votes: number; userVoted?: boolean }>;
    totalVotes: number;
  };
  reactionsCount: Record<ReactionType, number>;
  userReaction?: ReactionType;
  commentsCount: number;
  sharesCount: number;
  repostsCount: number;
  isBookmarked?: boolean;
  isReposted?: boolean;
  repostQuote?: string;
  location?: string;
  feeling?: string;
  tags?: string[];
}

interface FeedState {
  activeFeedType: FeedType;
  posts: PostModel[];
  bookmarks: string[];
  comments: Record<string, PostComment[]>;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  page: number;
  hasMore: boolean;

  setActiveFeedType: (type: FeedType) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  toggleBookmark: (postId: string) => void;
  repostPost: (postId: string, quoteContent?: string) => void;
  createPost: (post: Omit<PostModel, 'id' | 'createdAt' | 'reactionsCount' | 'commentsCount' | 'sharesCount' | 'repostsCount'>) => void;
  addComment: (postId: string, comment: Omit<PostComment, 'id' | 'createdAt' | 'likesCount' | 'replies'>) => void;
  addCommentReply: (postId: string, parentCommentId: string, reply: Omit<PostComment, 'id' | 'createdAt' | 'likesCount' | 'replies'>) => void;
  likeComment: (postId: string, commentId: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  fetchNextPage: () => Promise<void>;
  refreshFeed: () => Promise<void>;
}

const mockPosts: PostModel[] = [
  {
    id: 'post_101',
    authorId: 'usr_1',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    authorHeadline: 'AI Research Scientist @ DeepMind',
    isVerified: true,
    content: 'Excited to announce our breakthrough on multi-modal neural architecture search! 🎉 We achieved 4.2x faster inference latency while preserving 99.8% precision across edge mobile devices.\n\nCheck out the open-source repository and let me know your thoughts! #ArtificialIntelligence #MachineLearning #DeepMind #OpenSource',
    createdAt: '25m ago',
    privacy: 'public',
    mediaUrls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    ],
    reactionsCount: { like: 142, love: 68, care: 14, haha: 2, wow: 35, sad: 0, angry: 0 },
    userReaction: 'like',
    commentsCount: 38,
    sharesCount: 19,
    repostsCount: 12,
    isBookmarked: false,
    location: 'London, UK',
  },
  {
    id: 'post_102',
    authorId: 'usr_2',
    authorName: 'David Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    authorHeadline: 'Founder & CEO @ CloudPulse',
    isVerified: true,
    content: 'Which state management paradigm do you prioritize in production React Native apps for 2026? Vote below and share your benchmark experiences 👇 #ReactNative #MobileDev #Architecture',
    createdAt: '1h ago',
    privacy: 'public',
    poll: {
      question: 'Best React Native State Manager?',
      options: [
        { id: 'opt_1', text: 'Zustand + TanStack Query', votes: 482, userVoted: true },
        { id: 'opt_2', text: 'Redux Toolkit + RTK Query', votes: 124, userVoted: false },
        { id: 'opt_3', text: 'MobX State Tree', votes: 32, userVoted: false },
        { id: 'opt_4', text: 'Signals / Jotai', votes: 89, userVoted: false },
      ],
      totalVotes: 727,
    },
    reactionsCount: { like: 210, love: 45, care: 8, haha: 5, wow: 12, sad: 1, angry: 0 },
    commentsCount: 74,
    sharesCount: 28,
    repostsCount: 16,
    isBookmarked: true,
    location: 'San Francisco, CA',
  },
  {
    id: 'post_103',
    authorId: 'usr_3',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    authorHeadline: 'Lead UI/UX Architect @ PixelForge',
    content: 'Sneak peek of the new 60 FPS glassmorphic reel interactions with haptic feedback! 🌟 The fluid spring physics feel incredible in hand.\n\nDesigned in Figma, crafted with Reanimated & Fabric.',
    createdAt: '3h ago',
    privacy: 'public',
    mediaUrls: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    ],
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    videoDuration: '0:34',
    reactionsCount: { like: 389, love: 182, care: 24, haha: 1, wow: 92, sad: 0, angry: 0 },
    userReaction: 'love',
    commentsCount: 95,
    sharesCount: 64,
    repostsCount: 41,
    isBookmarked: false,
    location: 'San Francisco, CA',
  },
];

const INITIAL_COMMENTS: Record<string, PostComment[]> = {
  post_101: [
    {
      id: 'c_1',
      postId: 'post_101',
      authorId: 'usr_2',
      authorName: 'David Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      content: 'Incredible work on reducing latency Sarah! How does memory consumption compare on low-end devices?',
      createdAt: '15m ago',
      likesCount: 12,
      isLiked: true,
      replies: [
        {
          id: 'c_1_1',
          postId: 'post_101',
          authorId: 'usr_1',
          authorName: 'Sarah Jenkins',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          content: 'Thanks David! Quantized INT8 weights reduced peak RAM footprint by ~62% on Snapdragon 7-series.',
          createdAt: '10m ago',
          likesCount: 8,
          isLiked: false,
        },
      ],
    },
    {
      id: 'c_2',
      postId: 'post_101',
      authorId: 'usr_3',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      content: 'Already starred the repo ⭐ Cannot wait to test this on edge devices.',
      createdAt: '8m ago',
      likesCount: 5,
      isLiked: false,
    },
  ],
};

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      activeFeedType: 'home',
      posts: mockPosts,
      bookmarks: ['post_102'],
      comments: INITIAL_COMMENTS,
      isLoadingMore: false,
      isRefreshing: false,
      page: 1,
      hasMore: true,

      setActiveFeedType: (type) => {
        set({ activeFeedType: type });
        const cached = FeedCacheService.getCachedFeed(type);
        if (cached) {
          set({ posts: cached });
        } else {
          const ranked = FeedRankingService.rankPosts(get().posts, type);
          FeedCacheService.saveFeed(type, ranked);
        }
      },

      reactToPost: (postId, reaction) => {
        set(
          produce((state: FeedState) => {
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              if (post.userReaction === reaction) {
                post.reactionsCount[reaction] = Math.max(0, post.reactionsCount[reaction] - 1);
                post.userReaction = undefined;
              } else {
                if (post.userReaction) {
                  post.reactionsCount[post.userReaction] = Math.max(0, post.reactionsCount[post.userReaction] - 1);
                }
                post.reactionsCount[reaction] = (post.reactionsCount[reaction] || 0) + 1;
                post.userReaction = reaction;
              }
            }
          })
        );

        offlineSyncQueue.enqueue({
          type: 'LIKE_POST',
          endpoint: `/posts/${postId}/react`,
          method: 'POST',
          payload: { reaction },
        });

        eventBus.emit('FEED:REACTION_ADDED', { postId, reaction, userId: 'usr_meta_998' });
      },

      toggleBookmark: (postId) => {
        set(
          produce((state: FeedState) => {
            const index = state.bookmarks.indexOf(postId);
            if (index > -1) {
              state.bookmarks.splice(index, 1);
            } else {
              state.bookmarks.push(postId);
            }
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              post.isBookmarked = !post.isBookmarked;
            }
          })
        );

        offlineSyncQueue.enqueue({
          type: 'BOOKMARK_POST',
          endpoint: `/posts/${postId}/bookmark`,
          method: 'POST',
          payload: {},
        });
      },

      repostPost: (postId, quoteContent) => {
        set(
          produce((state: FeedState) => {
            const originalPost = state.posts.find((p) => p.id === postId);
            if (originalPost) {
              originalPost.repostsCount += 1;
              originalPost.isReposted = true;

              if (quoteContent) {
                // Create a quote post
                const quotePost: PostModel = {
                  id: `post_quote_${Date.now()}`,
                  authorId: 'usr_meta_998',
                  authorName: 'Alex Rivera',
                  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                  content: `${quoteContent}\n\n↳ Quoting @${originalPost.authorName}: "${originalPost.content.slice(0, 100)}..."`,
                  createdAt: 'Just now',
                  privacy: 'public',
                  reactionsCount: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
                  commentsCount: 0,
                  sharesCount: 0,
                  repostsCount: 0,
                  isBookmarked: false,
                };
                state.posts.unshift(quotePost);
              }
            }
          })
        );

        offlineSyncQueue.enqueue({
          type: 'REPOST_POST',
          endpoint: `/posts/${postId}/repost`,
          method: 'POST',
          payload: { quoteContent },
        });

        eventBus.emit('FEED:POST_REPOSTED', { postId, quoteContent });
      },

      createPost: (newPostData) => {
        const id = `post_${Date.now()}`;
        const newPost: PostModel = {
          ...newPostData,
          id,
          createdAt: 'Just now',
          reactionsCount: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
          commentsCount: 0,
          sharesCount: 0,
          repostsCount: 0,
          isBookmarked: false,
        };

        set(
          produce((state: FeedState) => {
            state.posts.unshift(newPost);
          })
        );

        offlineSyncQueue.enqueue({
          type: 'CREATE_POST',
          endpoint: '/posts',
          method: 'POST',
          payload: newPost,
        });

        eventBus.emit('FEED:POST_CREATED', { postId: id, authorId: newPost.authorId });
      },

      addComment: (postId, commentData) => {
        const newComment: PostComment = {
          ...commentData,
          id: `comment_${Date.now()}`,
          postId,
          createdAt: 'Just now',
          likesCount: 0,
          isLiked: false,
          replies: [],
        };

        set(
          produce((state: FeedState) => {
            if (!state.comments[postId]) {
              state.comments[postId] = [];
            }
            state.comments[postId].unshift(newComment);

            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              post.commentsCount += 1;
            }
          })
        );

        offlineSyncQueue.enqueue({
          type: 'CREATE_COMMENT',
          endpoint: `/posts/${postId}/comments`,
          method: 'POST',
          payload: commentData,
        });
      },

      addCommentReply: (postId, parentCommentId, replyData) => {
        const newReply: PostComment = {
          ...replyData,
          id: `reply_${Date.now()}`,
          postId,
          createdAt: 'Just now',
          likesCount: 0,
          isLiked: false,
        };

        set(
          produce((state: FeedState) => {
            const list = state.comments[postId];
            if (list) {
              const parent = list.find((c) => c.id === parentCommentId);
              if (parent) {
                if (!parent.replies) parent.replies = [];
                parent.replies.push(newReply);
              }
            }
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              post.commentsCount += 1;
            }
          })
        );
      },

      likeComment: (postId, commentId) => {
        set(
          produce((state: FeedState) => {
            const list = state.comments[postId];
            if (list) {
              const comment = list.find((c) => c.id === commentId);
              if (comment) {
                comment.isLiked = !comment.isLiked;
                comment.likesCount += comment.isLiked ? 1 : -1;
              }
            }
          })
        );
      },

      votePoll: (postId, optionId) => {
        set(
          produce((state: FeedState) => {
            const post = state.posts.find((p) => p.id === postId);
            if (post?.poll) {
              post.poll.options.forEach((opt) => {
                if (opt.id === optionId) {
                  opt.votes += 1;
                  opt.userVoted = true;
                } else if (opt.userVoted) {
                  opt.votes = Math.max(0, opt.votes - 1);
                  opt.userVoted = false;
                }
              });
              post.poll.totalVotes += 1;
            }
          })
        );
      },

      fetchNextPage: async () => {
        if (get().isLoadingMore || !get().hasMore) return;
        set({ isLoadingMore: true });

        // Simulate network page fetch
        await new Promise((r) => setTimeout(() => r(undefined), 600));

        const nextPageNum = get().page + 1;
        const newBatch: PostModel[] = [
          {
            id: `post_page_${nextPageNum}_1`,
            authorId: 'usr_4',
            authorName: 'Marcus Aurelius',
            authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            authorHeadline: 'Security Protocol Lead',
            content: 'Testing hardware-bound cryptographic biometrics with KeyStore & Secure Enclave on React Native New Architecture. 🔒 Latency is < 2ms!',
            createdAt: '6h ago',
            privacy: 'public',
            reactionsCount: { like: 88, love: 32, care: 6, haha: 0, wow: 18, sad: 0, angry: 0 },
            commentsCount: 14,
            sharesCount: 9,
            repostsCount: 4,
            isBookmarked: false,
          },
        ];

        FeedPrefetchService.prefetchPostMedia(newBatch);

        set(
          produce((state: FeedState) => {
            state.posts.push(...newBatch);
            state.page = nextPageNum;
            state.isLoadingMore = false;
            if (nextPageNum >= 4) {
              state.hasMore = false;
            }
          })
        );
      },

      refreshFeed: async () => {
        set({ isRefreshing: true });
        await new Promise((r) => setTimeout(() => r(undefined), 700));

        const ranked = FeedRankingService.rankPosts(mockPosts, get().activeFeedType);
        FeedCacheService.saveFeed(get().activeFeedType, ranked);
        FeedPrefetchService.prefetchPostMedia(ranked);

        set({
          posts: ranked,
          isRefreshing: false,
          page: 1,
          hasMore: true,
        });
      },
    }),
    {
      name: 'feed-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
);
