import { create } from 'zustand';
import { produce } from 'immer';
import { eventBus } from '../core/events/EventBus';

export type StreamResolution = '720p' | '1080p_hd' | '4k_uhd';

export interface LiveCoHost {
  id: string;
  name: string;
  avatarUrl: string;
  isMuted: boolean;
  isCameraOff: boolean;
  role: 'host' | 'co_host';
}

export interface GuestRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  isBadge?: boolean;
  isPinned?: boolean;
  createdAt: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  coinPrice: number;
}

export interface GiftEvent {
  id: string;
  senderName: string;
  giftName: string;
  giftEmoji: string;
  coinValue: number;
}

export const VIRTUAL_GIFT_CATALOG: VirtualGift[] = [
  { id: 'g_rose', name: 'Rose', emoji: '🌹', coinPrice: 10 },
  { id: 'g_heart', name: 'Super Heart', emoji: '❤️', coinPrice: 50 },
  { id: 'g_rocket', name: 'Diamond Rocket', emoji: '🚀', coinPrice: 500 },
  { id: 'g_crown', name: 'Galaxy Crown', emoji: '👑', coinPrice: 1000 },
  { id: 'g_dragon', name: 'Mythic Dragon', emoji: '🐉', coinPrice: 5000 },
];

interface LiveStreamState {
  // Stream info
  streamId: string | null;
  title: string;
  category: string;
  isLive: boolean;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isFrontCamera: boolean;
  resolution: StreamResolution;
  durationSeconds: number;
  viewerCount: number;
  likesCount: number;
  totalCoins: number;

  // Multi Guest Co-hosting
  coHosts: LiveCoHost[];
  pendingGuestRequests: GuestRequest[];

  // Chat
  comments: LiveChatMessage[];
  pinnedCommentId: string | null;
  isCommentsDisabled: boolean;

  // Gifts
  recentGiftEvents: GiftEvent[];

  // Moderation
  mutedUserIds: string[];
  blockedWords: string[];

  // Actions
  startStream: (params: { title: string; category: string; resolution?: StreamResolution }) => void;
  endStream: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
  sendComment: (text: string, userName?: string, userAvatar?: string) => void;
  pinComment: (commentId: string) => void;
  unpinComment: () => void;
  sendGift: (giftId: string, senderName?: string) => void;
  addGuestRequest: (request: Omit<GuestRequest, 'id'>) => void;
  acceptGuestRequest: (requestId: string) => void;
  declineGuestRequest: (requestId: string) => void;
  removeCoHost: (hostId: string) => void;
  toggleMuteCoHost: (hostId: string) => void;
  muteUser: (userId: string) => void;
  addBlockedWord: (word: string) => void;
  removeBlockedWord: (word: string) => void;
  toggleCommentsDisabled: () => void;
  incrementLikes: () => void;
}

const INITIAL_COMMENTS: LiveChatMessage[] = [
  {
    id: 'cm_1',
    userId: 'usr_2',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    text: 'Audio and 4K stream look razor sharp! 🔥',
    isBadge: true,
    createdAt: 'Just now',
  },
  {
    id: 'cm_2',
    userId: 'usr_3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    text: 'How does TurboModule zero-copy serialization work with C++ vectors? 🤔',
    isBadge: true,
    createdAt: 'Just now',
  },
];

const INITIAL_COHOSTS: LiveCoHost[] = [
  {
    id: 'usr_meta_998',
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    isMuted: false,
    isCameraOff: false,
    role: 'host',
  },
];

export const useLiveStreamStore = create<LiveStreamState>()((set, get) => ({
  streamId: 'live_stream_101',
  title: 'Next-Gen Mobile Architecture 2026 Q&A 🔴',
  category: 'Coding & Tech',
  isLive: true,
  isHost: true,
  isMuted: false,
  isCameraOff: false,
  isFrontCamera: true,
  resolution: '1080p_hd',
  durationSeconds: 864,
  viewerCount: 2450,
  likesCount: 18420,
  totalCoins: 4850,

  coHosts: INITIAL_COHOSTS,
  pendingGuestRequests: [
    {
      id: 'g_req_1',
      userId: 'usr_1',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      id: 'g_req_2',
      userId: 'usr_3',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    },
  ],

  comments: INITIAL_COMMENTS,
  pinnedCommentId: null,
  isCommentsDisabled: false,

  recentGiftEvents: [],
  mutedUserIds: [],
  blockedWords: ['spam', 'bot'],

  startStream: ({ title, category, resolution = '1080p_hd' }) => {
    set({
      streamId: `live_${Date.now()}`,
      title,
      category,
      resolution,
      isLive: true,
      isHost: true,
      durationSeconds: 0,
      viewerCount: 1,
      likesCount: 0,
      totalCoins: 0,
      comments: [],
      recentGiftEvents: [],
      pendingGuestRequests: [],
      coHosts: [
        {
          id: 'usr_meta_998',
          name: 'Alex Rivera',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          isMuted: false,
          isCameraOff: false,
          role: 'host',
        },
      ],
    });

    eventBus.emit('FEED:POST_CREATED', { postId: `live_${Date.now()}`, authorId: 'usr_meta_998' });
  },

  endStream: () => {
    set({ isLive: false });
  },

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleCamera: () => set((s) => ({ isCameraOff: !s.isCameraOff })),
  switchCamera: () => set((s) => ({ isFrontCamera: !s.isFrontCamera })),

  sendComment: (text, userName = 'You', userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400') => {
    const { blockedWords, isCommentsDisabled } = get();
    if (isCommentsDisabled || !text.trim()) return;

    // Filter blocked words
    const containsBlocked = blockedWords.some((w) => text.toLowerCase().includes(w.toLowerCase()));
    if (containsBlocked) return;

    const newComment: LiveChatMessage = {
      id: `cm_${Date.now()}`,
      userId: 'usr_meta_998',
      userName,
      userAvatar,
      text: text.trim(),
      isBadge: true,
      createdAt: 'Just now',
    };

    set(
      produce((state: LiveStreamState) => {
        state.comments.push(newComment);
      })
    );
  },

  pinComment: (commentId) => set({ pinnedCommentId: commentId }),
  unpinComment: () => set({ pinnedCommentId: null }),

  sendGift: (giftId, senderName = 'Alex Rivera') => {
    const gift = VIRTUAL_GIFT_CATALOG.find((g) => g.id === giftId);
    if (!gift) return;

    const event: GiftEvent = {
      id: `gft_${Date.now()}`,
      senderName,
      giftName: gift.name,
      giftEmoji: gift.emoji,
      coinValue: gift.coinPrice,
    };

    set(
      produce((state: LiveStreamState) => {
        state.totalCoins += gift.coinPrice;
        state.recentGiftEvents.unshift(event);
      })
    );
  },

  addGuestRequest: (request) => {
    set(
      produce((state: LiveStreamState) => {
        state.pendingGuestRequests.push({
          ...request,
          id: `g_req_${Date.now()}`,
        });
      })
    );
  },

  acceptGuestRequest: (requestId) => {
    set(
      produce((state: LiveStreamState) => {
        const reqIndex = state.pendingGuestRequests.findIndex((r) => r.id === requestId);
        if (reqIndex > -1 && state.coHosts.length < 4) {
          const req = state.pendingGuestRequests[reqIndex];
          state.pendingGuestRequests.splice(reqIndex, 1);
          state.coHosts.push({
            id: req.userId,
            name: req.userName,
            avatarUrl: req.userAvatar,
            isMuted: false,
            isCameraOff: false,
            role: 'co_host',
          });
        }
      })
    );
  },

  declineGuestRequest: (requestId) => {
    set(
      produce((state: LiveStreamState) => {
        state.pendingGuestRequests = state.pendingGuestRequests.filter((r) => r.id !== requestId);
      })
    );
  },

  removeCoHost: (hostId) => {
    set(
      produce((state: LiveStreamState) => {
        state.coHosts = state.coHosts.filter((h) => h.id !== hostId);
      })
    );
  },

  toggleMuteCoHost: (hostId) => {
    set(
      produce((state: LiveStreamState) => {
        const host = state.coHosts.find((h) => h.id === hostId);
        if (host) host.isMuted = !host.isMuted;
      })
    );
  },

  muteUser: (userId) => {
    set(
      produce((state: LiveStreamState) => {
        if (!state.mutedUserIds.includes(userId)) {
          state.mutedUserIds.push(userId);
        }
      })
    );
  },

  addBlockedWord: (word) => {
    if (!word.trim()) return;
    set(
      produce((state: LiveStreamState) => {
        if (!state.blockedWords.includes(word.trim())) {
          state.blockedWords.push(word.trim());
        }
      })
    );
  },

  removeBlockedWord: (word) => {
    set(
      produce((state: LiveStreamState) => {
        state.blockedWords = state.blockedWords.filter((w) => w !== word);
      })
    );
  },

  toggleCommentsDisabled: () => set((s) => ({ isCommentsDisabled: !s.isCommentsDisabled })),

  incrementLikes: () => set((s) => ({ likesCount: s.likesCount + 1 })),
}));
