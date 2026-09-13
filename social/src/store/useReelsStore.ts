import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

export type ReelFilter = 'normal' | 'vintage' | 'cyberpunk' | 'cinema' | 'bw' | 'golden';
export type ReelEffect = 'none' | 'beauty' | 'speed_ramp' | 'flash' | 'sparkles' | 'green_screen';

export interface ReelCaption {
  timestamp: number;
  text: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  usesCount: number;
  isTrending?: boolean;
}

export interface ReelModel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  description: string;
  videoUrl: string;
  videoThumbnail: string;
  songTitle: string;
  songArtist: string;
  songCoverUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  remixesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  filter?: ReelFilter;
  effect?: ReelEffect;
  captions?: ReelCaption[];
  remixOf?: {
    originalCreatorName: string;
    originalReelId: string;
  };
}

interface ReelsState {
  reels: ReelModel[];
  savedReels: string[];
  audioLibrary: AudioTrack[];
  activeReelIndex: number;

  setActiveReelIndex: (index: number) => void;
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  shareReel: (reelId: string) => void;
  createReel: (reel: Omit<ReelModel, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'remixesCount'>) => void;
  createRemix: (originalReelId: string, remixData: { videoUrl: string; description: string }) => void;
}

const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'audio_1',
    title: 'Cybernetic Flow (Original Mix)',
    artist: 'Elena Rostova',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    duration: '0:30',
    usesCount: 48200,
    isTrending: true,
  },
  {
    id: 'audio_2',
    title: 'Midnight Highway Synthwave',
    artist: 'Kavinsky & Daft Beats',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200',
    duration: '0:45',
    usesCount: 125000,
    isTrending: true,
  },
  {
    id: 'audio_3',
    title: 'Deep Code Resonance',
    artist: 'AI Audio Generator',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
    duration: '0:25',
    usesCount: 18400,
  },
];

const INITIAL_REELS: ReelModel[] = [
  {
    id: 'reel_1',
    creatorId: 'usr_3',
    creatorName: 'elena.design',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    isVerified: true,
    isFollowing: false,
    description: 'Ultra smooth 120Hz gesture physics in React Native with Reanimated 4 & Fabric Engine 🔥🚀 #ReactNative #MobileDev #UIUX',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    songTitle: 'Cybernetic Flow (Original Mix)',
    songArtist: 'Elena Rostova',
    songCoverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    likesCount: 14200,
    commentsCount: 894,
    sharesCount: 3200,
    remixesCount: 142,
    isLiked: false,
    isSaved: false,
    filter: 'cyberpunk',
    captions: [
      { timestamp: 0, text: '60 FPS animations on Mobile' },
      { timestamp: 3, text: 'Zero JS bridge overhead with Worklets' },
      { timestamp: 6, text: 'Ultra fluid native spring physics!' },
    ],
  },
  {
    id: 'reel_2',
    creatorId: 'usr_2',
    creatorName: 'david.cloudpulse',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isVerified: true,
    isFollowing: true,
    description: 'Benchmarking MMKV vs SQLite on 1,000,000 concurrent writes ⚡ The result will shock you! #Performance #Database',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    songTitle: 'Midnight Highway Synthwave',
    songArtist: 'Kavinsky & Daft Beats',
    songCoverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200',
    likesCount: 28400,
    commentsCount: 1205,
    sharesCount: 5400,
    remixesCount: 89,
    isLiked: true,
    isSaved: true,
    filter: 'cinema',
  },
  {
    id: 'reel_3',
    creatorId: 'usr_1',
    creatorName: 'sarah.ai',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    isVerified: true,
    isFollowing: false,
    description: 'Edge Neural Networks running on-device with zero cloud latency. The future of mobile AI is here! 🔬🧠 #DeepLearning',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    songTitle: 'Deep Code Resonance',
    songArtist: 'AI Audio Generator',
    songCoverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
    likesCount: 45100,
    commentsCount: 2310,
    sharesCount: 9800,
    remixesCount: 310,
    isLiked: false,
    isSaved: false,
    filter: 'golden',
  },
];

export const useReelsStore = create<ReelsState>()(
  persist(
    (set, get) => ({
      reels: INITIAL_REELS,
      savedReels: ['reel_2'],
      audioLibrary: INITIAL_AUDIO_TRACKS,
      activeReelIndex: 0,

      setActiveReelIndex: (index) => set({ activeReelIndex: index }),

      likeReel: (reelId) => {
        set(
          produce((state: ReelsState) => {
            const reel = state.reels.find((r) => r.id === reelId);
            if (reel) {
              reel.isLiked = !reel.isLiked;
              reel.likesCount += reel.isLiked ? 1 : -1;
            }
          })
        );
      },

      saveReel: (reelId) => {
        set(
          produce((state: ReelsState) => {
            const index = state.savedReels.indexOf(reelId);
            if (index > -1) {
              state.savedReels.splice(index, 1);
            } else {
              state.savedReels.push(reelId);
            }
            const reel = state.reels.find((r) => r.id === reelId);
            if (reel) {
              reel.isSaved = !reel.isSaved;
            }
          })
        );
      },

      toggleFollowCreator: (creatorId) => {
        set(
          produce((state: ReelsState) => {
            state.reels.forEach((r) => {
              if (r.creatorId === creatorId) {
                r.isFollowing = !r.isFollowing;
              }
            });
          })
        );
      },

      shareReel: (reelId) => {
        set(
          produce((state: ReelsState) => {
            const reel = state.reels.find((r) => r.id === reelId);
            if (reel) {
              reel.sharesCount += 1;
            }
          })
        );
      },

      createReel: (newReelData) => {
        const id = `reel_${Date.now()}`;
        const newReel: ReelModel = {
          ...newReelData,
          id,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          remixesCount: 0,
          isLiked: false,
          isSaved: false,
        };

        set(
          produce((state: ReelsState) => {
            state.reels.unshift(newReel);
          })
        );

        eventBus.emit('FEED:POST_CREATED', { postId: id, authorId: newReel.creatorId });
      },

      createRemix: (originalReelId, remixData) => {
        const original = get().reels.find((r) => r.id === originalReelId);
        if (!original) return;

        const id = `remix_${Date.now()}`;
        const remixReel: ReelModel = {
          id,
          creatorId: 'usr_meta_998',
          creatorName: 'Alex Rivera',
          creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          description: `${remixData.description} (Remix with @${original.creatorName})`,
          videoUrl: remixData.videoUrl,
          videoThumbnail: original.videoThumbnail,
          songTitle: original.songTitle,
          songArtist: original.songArtist,
          songCoverUrl: original.songCoverUrl,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          remixesCount: 0,
          isLiked: false,
          isSaved: false,
          remixOf: {
            originalCreatorName: original.creatorName,
            originalReelId: original.id,
          },
        };

        set(
          produce((state: ReelsState) => {
            const targetInDraft = state.reels.find((r) => r.id === originalReelId);
            if (targetInDraft) {
              targetInDraft.remixesCount += 1;
            }
            state.reels.unshift(remixReel);
          })
        );
      },
    }),
    {
      name: 'reels-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        savedReels: state.savedReels,
      }),
    }
  )
);
