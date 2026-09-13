import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';

export type SearchCategory =
  | 'all'
  | 'users'
  | 'posts'
  | 'videos'
  | 'reels'
  | 'groups'
  | 'pages'
  | 'events';

export type SortByOption = 'relevance' | 'recent' | 'most_liked' | 'most_viewed';
export type DateRangeOption = 'anytime' | 'today' | 'this_week' | 'this_month' | 'this_year';

export interface SearchFilterState {
  sortBy: SortByOption;
  dateRange: DateRangeOption;
  verifiedOnly: boolean;
  hasMediaOnly: boolean;
  location: string;
}

export interface UserSearchResult {
  id: string;
  type: 'user';
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  mutualFriendsCount: number;
  isVerified: boolean;
  isFollowing: boolean;
}

export interface PostSearchResult {
  id: string;
  type: 'post';
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  mediaUrl?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface VideoSearchResult {
  id: string;
  type: 'video';
  title: string;
  channelName: string;
  channelAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  viewsCount: number;
  createdAt: string;
  isHD: boolean;
}

export interface ReelSearchResult {
  id: string;
  type: 'reel';
  title: string;
  creatorName: string;
  creatorAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  songTitle: string;
  likesCount: number;
}

export interface GroupSearchResult {
  id: string;
  type: 'group';
  title: string;
  avatarUrl: string;
  coverUrl: string;
  category: string;
  membersCount: number;
  privacy: 'public' | 'private';
  isJoined: boolean;
  description: string;
}

export interface PageSearchResult {
  id: string;
  type: 'page';
  title: string;
  avatarUrl: string;
  category: string;
  followersCount: number;
  isVerified: boolean;
  isFollowing: boolean;
}

export interface EventSearchResult {
  id: string;
  type: 'event';
  title: string;
  coverUrl: string;
  date: string;
  location: string;
  attendeesCount: number;
  isAttending: boolean;
  category: string;
}

export type AnySearchResult =
  | UserSearchResult
  | PostSearchResult
  | VideoSearchResult
  | ReelSearchResult
  | GroupSearchResult
  | PageSearchResult
  | EventSearchResult;

export interface SearchHistoryItem {
  id: string;
  query: string;
  searchedAt: string;
}

interface SearchState {
  query: string;
  selectedCategory: SearchCategory;
  filters: SearchFilterState;
  searchHistory: SearchHistoryItem[];
  trendingSuggestions: string[];

  // Datasets
  users: UserSearchResult[];
  posts: PostSearchResult[];
  videos: VideoSearchResult[];
  reels: ReelSearchResult[];
  groups: GroupSearchResult[];
  pages: PageSearchResult[];
  events: EventSearchResult[];

  // Actions
  setQuery: (q: string) => void;
  setSelectedCategory: (cat: SearchCategory) => void;
  setFilters: (filters: Partial<SearchFilterState>) => void;
  resetFilters: () => void;
  addHistory: (query: string) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  toggleFollowUser: (userId: string) => void;
  toggleJoinGroup: (groupId: string) => void;
  toggleFollowPage: (pageId: string) => void;
  toggleAttendEvent: (eventId: string) => void;
  getFilteredResults: () => AnySearchResult[];
}

const DEFAULT_FILTERS: SearchFilterState = {
  sortBy: 'relevance',
  dateRange: 'anytime',
  verifiedOnly: false,
  hasMediaOnly: false,
  location: 'worldwide',
};

const INITIAL_USERS: UserSearchResult[] = [
  {
    id: 's_u1',
    type: 'user',
    name: 'Sarah Jenkins',
    username: 'sarah.jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'AI Research Scientist @ DeepMind • Building Multi-Modal LLMs',
    followersCount: 14200,
    mutualFriendsCount: 18,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: 's_u2',
    type: 'user',
    name: 'David Chen',
    username: 'david.chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Founder @ CloudPulse • Distributed Systems Architect',
    followersCount: 8900,
    mutualFriendsCount: 24,
    isVerified: true,
    isFollowing: true,
  },
  {
    id: 's_u3',
    type: 'user',
    name: 'Elena Rostova',
    username: 'elena.rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    bio: 'Principal Mobile Engineer • React Native Core Contributor',
    followersCount: 21500,
    mutualFriendsCount: 42,
    isVerified: true,
    isFollowing: false,
  },
];

const INITIAL_POSTS: PostSearchResult[] = [
  {
    id: 's_p1',
    type: 'post',
    authorName: 'Sarah Jenkins',
    authorUsername: 'sarah.jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    content: 'Just published our new paper on Sub-10ms On-Device Neural Audio Synthesis! #ai #machinelearning #mobile',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    hashtags: ['#ai', '#machinelearning', '#mobile'],
    likesCount: 1420,
    commentsCount: 185,
    createdAt: '2h ago',
  },
  {
    id: 's_p2',
    type: 'post',
    authorName: 'David Chen',
    authorUsername: 'david.chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    content: 'Architecting zero-copy TurboModules with C++ JSI in React Native 0.87. #reactnative #typescript',
    hashtags: ['#reactnative', '#typescript'],
    likesCount: 940,
    commentsCount: 88,
    createdAt: '5h ago',
  },
];

const INITIAL_VIDEOS: VideoSearchResult[] = [
  {
    id: 's_v1',
    type: 'video',
    title: 'Building 120 FPS React Native Apps with New Architecture',
    channelName: 'Elena Rostova',
    channelAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    duration: '18:42',
    viewsCount: 38400,
    createdAt: '1d ago',
    isHD: true,
  },
  {
    id: 's_v2',
    type: 'video',
    title: 'Deep Learning on Apple Silicon & Snapdragon NPU',
    channelName: 'Sarah Jenkins',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    duration: '24:15',
    viewsCount: 52100,
    createdAt: '3d ago',
    isHD: true,
  },
];

const INITIAL_REELS: ReelSearchResult[] = [
  {
    id: 's_r1',
    type: 'reel',
    title: 'Crazy Cyberpunk UI Animation in 30 Seconds! ⚡',
    creatorName: 'Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600',
    songTitle: 'Cyberpunk Synthwave 2077',
    likesCount: 28400,
  },
  {
    id: 's_r2',
    type: 'reel',
    title: 'Multi-Modal Live Streaming Architecture 🚀',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    songTitle: 'Lo-Fi Future Beats',
    likesCount: 19800,
  },
];

const INITIAL_GROUPS: GroupSearchResult[] = [
  {
    id: 's_g1',
    type: 'group',
    title: 'React Native Architecture Masters',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    category: 'Software Engineering',
    membersCount: 38500,
    privacy: 'public',
    isJoined: true,
    description: 'Community of staff mobile architects pushing performance frontiers.',
  },
  {
    id: 's_g2',
    type: 'group',
    title: 'AI & Generative Foundation Models',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    category: 'Artificial Intelligence',
    membersCount: 64200,
    privacy: 'public',
    isJoined: false,
    description: 'Deep discussions on Transformers, Diffusion, and Multi-Modal AI.',
  },
];

const INITIAL_PAGES: PageSearchResult[] = [
  {
    id: 's_pg1',
    type: 'page',
    title: 'Meta Open Source',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    category: 'Technology Company',
    followersCount: 1200000,
    isVerified: true,
    isFollowing: true,
  },
  {
    id: 's_pg2',
    type: 'page',
    title: 'Google DeepMind Research',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    category: 'Research Organization',
    followersCount: 2400000,
    isVerified: true,
    isFollowing: false,
  },
];

const INITIAL_EVENTS: EventSearchResult[] = [
  {
    id: 's_e1',
    type: 'event',
    title: 'Global React Native Summit 2026',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    date: 'Sep 18 • 10:00 AM PST',
    location: 'Moscone Center, San Francisco & Online',
    attendeesCount: 4800,
    isAttending: true,
    category: 'Conference',
  },
  {
    id: 's_e2',
    type: 'event',
    title: 'Edge AI & NPU Hackathon 2026',
    coverUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    date: 'Oct 05 • 09:00 AM EST',
    location: 'New York City, NY',
    attendeesCount: 1250,
    isAttending: false,
    category: 'Hackathon',
  },
];

const INITIAL_HISTORY: SearchHistoryItem[] = [
  { id: 'h1', query: 'React Native 0.87 New Architecture', searchedAt: '10m ago' },
  { id: 'h2', query: 'Sarah Jenkins', searchedAt: '1h ago' },
  { id: 'h3', query: '#deeplearning', searchedAt: 'Yesterday' },
];

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      selectedCategory: 'all',
      filters: DEFAULT_FILTERS,
      searchHistory: INITIAL_HISTORY,
      trendingSuggestions: [
        '#reactnative',
        '#ai',
        '#machinelearning',
        '#web3',
        'Sarah Jenkins',
        'David Chen',
        'Meta Open Source',
        '120 FPS Animation',
      ],

      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      videos: INITIAL_VIDEOS,
      reels: INITIAL_REELS,
      groups: INITIAL_GROUPS,
      pages: INITIAL_PAGES,
      events: INITIAL_EVENTS,

      setQuery: (q) => set({ query: q }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      addHistory: (query) => {
        if (!query.trim()) return;
        set(
          produce((state: SearchState) => {
            state.searchHistory = state.searchHistory.filter(
              (h) => h.query.toLowerCase() !== query.toLowerCase()
            );
            state.searchHistory.unshift({
              id: `h_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              query: query.trim(),
              searchedAt: 'Just now',
            });
          })
        );
      },

      removeHistory: (id) => {
        set(
          produce((state: SearchState) => {
            state.searchHistory = state.searchHistory.filter((h) => h.id !== id);
          })
        );
      },

      clearHistory: () => set({ searchHistory: [] }),

      toggleFollowUser: (userId) => {
        set(
          produce((state: SearchState) => {
            const user = state.users.find((u) => u.id === userId);
            if (user) {
              user.isFollowing = !user.isFollowing;
              user.followersCount += user.isFollowing ? 1 : -1;
            }
          })
        );
      },

      toggleJoinGroup: (groupId) => {
        set(
          produce((state: SearchState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              grp.isJoined = !grp.isJoined;
              grp.membersCount += grp.isJoined ? 1 : -1;
            }
          })
        );
      },

      toggleFollowPage: (pageId) => {
        set(
          produce((state: SearchState) => {
            const page = state.pages.find((p) => p.id === pageId);
            if (page) {
              page.isFollowing = !page.isFollowing;
              page.followersCount += page.isFollowing ? 1 : -1;
            }
          })
        );
      },

      toggleAttendEvent: (eventId) => {
        set(
          produce((state: SearchState) => {
            const evt = state.events.find((e) => e.id === eventId);
            if (evt) {
              evt.isAttending = !evt.isAttending;
              evt.attendeesCount += evt.isAttending ? 1 : -1;
            }
          })
        );
      },

      getFilteredResults: () => {
        const { query, selectedCategory, filters, users, posts, videos, reels, groups, pages, events } = get();
        const q = query.toLowerCase().trim();

        let pool: AnySearchResult[] = [];

        if (selectedCategory === 'all') {
          pool = [...users, ...posts, ...videos, ...reels, ...groups, ...pages, ...events];
        } else if (selectedCategory === 'users') {
          pool = [...users];
        } else if (selectedCategory === 'posts') {
          pool = [...posts];
        } else if (selectedCategory === 'videos') {
          pool = [...videos];
        } else if (selectedCategory === 'reels') {
          pool = [...reels];
        } else if (selectedCategory === 'groups') {
          pool = [...groups];
        } else if (selectedCategory === 'pages') {
          pool = [...pages];
        } else if (selectedCategory === 'events') {
          pool = [...events];
        }

        // Query text match
        if (q) {
          pool = pool.filter((item) => {
            if ('name' in item && item.name.toLowerCase().includes(q)) return true;
            if ('username' in item && item.username.toLowerCase().includes(q)) return true;
            if ('title' in item && item.title.toLowerCase().includes(q)) return true;
            if ('content' in item && item.content.toLowerCase().includes(q)) return true;
            if ('bio' in item && item.bio.toLowerCase().includes(q)) return true;
            if ('category' in item && item.category.toLowerCase().includes(q)) return true;
            if ('hashtags' in item && item.hashtags.some((h) => h.toLowerCase().includes(q))) return true;
            return false;
          });
        }

        // Filter: verified only
        if (filters.verifiedOnly) {
          pool = pool.filter((item) => ('isVerified' in item ? item.isVerified : true));
        }

        // Sorting
        if (filters.sortBy === 'most_liked') {
          pool.sort((a, b) => {
            const likesA = 'likesCount' in a ? (a.likesCount as number) : 0;
            const likesB = 'likesCount' in b ? (b.likesCount as number) : 0;
            return likesB - likesA;
          });
        } else if (filters.sortBy === 'most_viewed') {
          pool.sort((a, b) => {
            const viewsA = 'viewsCount' in a ? (a.viewsCount as number) : 0;
            const viewsB = 'viewsCount' in b ? (b.viewsCount as number) : 0;
            return viewsB - viewsA;
          });
        }

        return pool;
      },
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
