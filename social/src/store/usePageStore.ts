import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

export type PageType = 'business' | 'creator' | 'organization';
export type PageRole = 'owner' | 'admin' | 'editor';

export interface PageAnalytics {
  followers: {
    total: number;
    newThisWeek: number;
    growthRatePercent: number;
    demographics: Array<{ region: string; percentage: number }>;
  };
  reach: {
    totalReach: number;
    organicReach: number;
    paidReach: number;
    impressions: number;
    reachGrowthPercent: number;
  };
  engagement: {
    ratePercent: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    linkClicks: number;
    profileVisits: number;
  };
  weeklyChart: Array<{ day: string; reach: number; engagement: number }>;
}

export interface PagePost {
  id: string;
  pageId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export interface PageModel {
  id: string;
  name: string;
  username: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  category: string;
  pageType: PageType;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  isFollowing: boolean;
  followersCount: number;
  userRole?: PageRole;
  posts: PagePost[];
  analytics: PageAnalytics;
}

interface PageState {
  pages: PageModel[];
  selectedPageId: string | null;

  setSelectedPageId: (id: string | null) => void;
  createPage: (params: {
    name: string;
    description: string;
    category: string;
    pageType: PageType;
    avatarUrl?: string;
    coverUrl?: string;
    website?: string;
    email?: string;
    address?: string;
  }) => string;
  toggleFollowPage: (pageId: string) => void;
  createPagePost: (pageId: string, content: string, mediaUrl?: string) => void;
  updatePageDetails: (pageId: string, partial: Partial<PageModel>) => void;
}

const INITIAL_PAGES: PageModel[] = [
  {
    id: 'page_1',
    name: 'Meta Open Source',
    username: 'metaopensource',
    description: 'Empowering engineers globally with foundational open-source technologies including React Native, PyTorch, and Llama.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    category: 'Technology Enterprise',
    pageType: 'organization',
    website: 'https://opensource.fb.com',
    email: 'opensource@meta.com',
    address: '1 Hacker Way, Menlo Park, CA',
    isVerified: true,
    isFollowing: true,
    followersCount: 1240000,
    userRole: 'admin',
    posts: [
      {
        id: 'pp_1',
        pageId: 'page_1',
        authorName: 'Meta Open Source',
        authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        content: '🎉 React Native 0.87 is officially released with 100% New Architecture enabled by default and zero-copy TurboModules!',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        createdAt: '1d ago',
        likesCount: 3840,
        commentsCount: 290,
        sharesCount: 840,
      },
    ],
    analytics: {
      followers: {
        total: 1240000,
        newThisWeek: 18400,
        growthRatePercent: 12.8,
        demographics: [
          { region: 'United States', percentage: 38 },
          { region: 'European Union', percentage: 26 },
          { region: 'India & APAC', percentage: 24 },
          { region: 'Other', percentage: 12 },
        ],
      },
      reach: {
        totalReach: 3850000,
        organicReach: 3200000,
        paidReach: 650000,
        impressions: 8900000,
        reachGrowthPercent: 18.4,
      },
      engagement: {
        ratePercent: 7.4,
        totalLikes: 142000,
        totalComments: 18900,
        totalShares: 34200,
        linkClicks: 62400,
        profileVisits: 185000,
      },
      weeklyChart: [
        { day: 'Mon', reach: 480000, engagement: 34000 },
        { day: 'Tue', reach: 520000, engagement: 41000 },
        { day: 'Wed', reach: 640000, engagement: 49000 },
        { day: 'Thu', reach: 590000, engagement: 44000 },
        { day: 'Fri', reach: 720000, engagement: 58000 },
        { day: 'Sat', reach: 450000, engagement: 31000 },
        { day: 'Sun', reach: 450000, engagement: 32000 },
      ],
    },
  },
  {
    id: 'page_2',
    name: 'Sarah Jenkins AI Studio',
    username: 'sarahjenkins.ai',
    description: 'Creator page documenting breakthroughs in on-device neural rendering, multi-modal LLMs, and agentic workflows.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    category: 'AI Research Scientist & Creator',
    pageType: 'creator',
    website: 'https://sarahjenkins.ai',
    email: 'contact@sarahjenkins.ai',
    isVerified: true,
    isFollowing: false,
    followersCount: 84200,
    posts: [
      {
        id: 'pp_2',
        pageId: 'page_2',
        authorName: 'Sarah Jenkins AI Studio',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        content: 'New video essay is live: How Diffusion Transformers will revolutionize mobile real-time game rendering.',
        createdAt: '3h ago',
        likesCount: 1420,
        commentsCount: 98,
        sharesCount: 142,
      },
    ],
    analytics: {
      followers: {
        total: 84200,
        newThisWeek: 3400,
        growthRatePercent: 16.2,
        demographics: [
          { region: 'United States', percentage: 44 },
          { region: 'United Kingdom', percentage: 22 },
          { region: 'Germany', percentage: 18 },
          { region: 'Other', percentage: 16 },
        ],
      },
      reach: {
        totalReach: 480000,
        organicReach: 480000,
        paidReach: 0,
        impressions: 1120000,
        reachGrowthPercent: 24.5,
      },
      engagement: {
        ratePercent: 9.8,
        totalLikes: 28400,
        totalComments: 3100,
        totalShares: 4900,
        linkClicks: 14200,
        profileVisits: 41000,
      },
      weeklyChart: [
        { day: 'Mon', reach: 62000, engagement: 6100 },
        { day: 'Tue', reach: 71000, engagement: 7400 },
        { day: 'Wed', reach: 89000, engagement: 9200 },
        { day: 'Thu', reach: 78000, engagement: 8100 },
        { day: 'Fri', reach: 95000, engagement: 10400 },
        { day: 'Sat', reach: 52000, engagement: 4900 },
        { day: 'Sun', reach: 53000, engagement: 5000 },
      ],
    },
  },
  {
    id: 'page_3',
    name: 'CloudPulse Enterprise Cloud',
    username: 'cloudpulse.io',
    description: 'High-availability Kubernetes clusters, global edge serverless runtimes, and automated multi-region replication.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    category: 'Cloud Infrastructure & B2B SaaS',
    pageType: 'business',
    website: 'https://cloudpulse.io',
    email: 'support@cloudpulse.io',
    address: '500 Howard St, San Francisco, CA',
    isVerified: true,
    isFollowing: true,
    followersCount: 315000,
    posts: [],
    analytics: {
      followers: {
        total: 315000,
        newThisWeek: 4200,
        growthRatePercent: 8.4,
        demographics: [
          { region: 'North America', percentage: 50 },
          { region: 'Europe', percentage: 30 },
          { region: 'Asia', percentage: 20 },
        ],
      },
      reach: {
        totalReach: 890000,
        organicReach: 710000,
        paidReach: 180000,
        impressions: 2100000,
        reachGrowthPercent: 9.1,
      },
      engagement: {
        ratePercent: 5.2,
        totalLikes: 24100,
        totalComments: 1800,
        totalShares: 4200,
        linkClicks: 38900,
        profileVisits: 62000,
      },
      weeklyChart: [
        { day: 'Mon', reach: 120000, engagement: 6200 },
        { day: 'Tue', reach: 135000, engagement: 7400 },
        { day: 'Wed', reach: 140000, engagement: 8100 },
        { day: 'Thu', reach: 130000, engagement: 7100 },
        { day: 'Fri', reach: 155000, engagement: 9200 },
        { day: 'Sat', reach: 98000, engagement: 4200 },
        { day: 'Sun', reach: 112000, engagement: 5100 },
      ],
    },
  },
];

export const usePageStore = create<PageState>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,
      selectedPageId: null,

      setSelectedPageId: (id) => set({ selectedPageId: id }),

      createPage: ({
        name,
        description,
        category,
        pageType,
        avatarUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        coverUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        website,
        email,
        address,
      }) => {
        const id = `page_${Date.now()}`;
        const newPage: PageModel = {
          id,
          name,
          username: name.toLowerCase().replace(/\s+/g, ''),
          description,
          category,
          pageType,
          avatarUrl,
          coverUrl,
          website,
          email,
          address,
          isVerified: false,
          isFollowing: true,
          followersCount: 1,
          userRole: 'owner',
          posts: [],
          analytics: {
            followers: { total: 1, newThisWeek: 1, growthRatePercent: 100, demographics: [] },
            reach: { totalReach: 100, organicReach: 100, paidReach: 0, impressions: 250, reachGrowthPercent: 100 },
            engagement: { ratePercent: 10.0, totalLikes: 10, totalComments: 2, totalShares: 1, linkClicks: 5, profileVisits: 15 },
            weeklyChart: [
              { day: 'Mon', reach: 10, engagement: 2 },
              { day: 'Tue', reach: 15, engagement: 3 },
              { day: 'Wed', reach: 20, engagement: 4 },
              { day: 'Thu', reach: 18, engagement: 3 },
              { day: 'Fri', reach: 25, engagement: 5 },
              { day: 'Sat', reach: 12, engagement: 2 },
              { day: 'Sun', reach: 10, engagement: 1 },
            ],
          },
        };

        set(
          produce((state: PageState) => {
            state.pages.unshift(newPage);
          })
        );

        eventBus.emit('FEED:POST_CREATED', { postId: id, authorId: 'usr_meta_998' });
        return id;
      },

      toggleFollowPage: (pageId) => {
        set(
          produce((state: PageState) => {
            const page = state.pages.find((p) => p.id === pageId);
            if (page) {
              page.isFollowing = !page.isFollowing;
              page.followersCount += page.isFollowing ? 1 : -1;
            }
          })
        );
      },

      createPagePost: (pageId, content, mediaUrl) => {
        const id = `pp_${Date.now()}`;
        const newPost: PagePost = {
          id,
          pageId,
          authorName: get().pages.find((p) => p.id === pageId)?.name || 'Page',
          authorAvatar: get().pages.find((p) => p.id === pageId)?.avatarUrl || '',
          content,
          mediaUrl,
          createdAt: 'Just now',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
        };

        set(
          produce((state: PageState) => {
            const page = state.pages.find((p) => p.id === pageId);
            if (page) {
              page.posts.unshift(newPost);
            }
          })
        );
      },

      updatePageDetails: (pageId, partial) => {
        set(
          produce((state: PageState) => {
            const page = state.pages.find((p) => p.id === pageId);
            if (page) {
              Object.assign(page, partial);
            }
          })
        );
      },
    }),
    {
      name: 'pages-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        pages: state.pages,
      }),
    }
  )
);
