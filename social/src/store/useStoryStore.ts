import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

export interface StoryViewer {
  userId: string;
  userName: string;
  userAvatar: string;
  viewedAt: string;
  reaction?: string;
}

export interface StoryMusic {
  title: string;
  artist: string;
  albumArt?: string;
  previewUrl?: string;
}

export interface StoryPollOption {
  id: string;
  text: string;
  votes: number;
  userVoted?: boolean;
}

export interface StoryPoll {
  question: string;
  options: StoryPollOption[];
  totalVotes: number;
}

export interface StoryQuestion {
  prompt: string;
  responses: Array<{ id: string; authorName: string; text: string; createdAt: string }>;
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  isArchived?: boolean;
  viewers: StoryViewer[];
  music?: StoryMusic;
  poll?: StoryPoll;
  questionPrompt?: StoryQuestion;
}

export interface StoryHighlight {
  id: string;
  title: string;
  coverUrl: string;
  storyIds: string[];
  createdAt: string;
}

export interface UserStoriesGroup {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isSeen?: boolean;
  stories: StoryItem[];
}

interface StoryState {
  userStories: UserStoriesGroup[];
  archivedStories: StoryItem[];
  highlights: StoryHighlight[];

  addStory: (story: Omit<StoryItem, 'id' | 'createdAt' | 'expiresAt' | 'viewers'>) => void;
  recordStoryView: (userId: string, storyId: string, viewer: Omit<StoryViewer, 'viewedAt'>) => void;
  reactToStory: (userId: string, storyId: string, reaction: string, viewer: Omit<StoryViewer, 'viewedAt'>) => void;
  voteStoryPoll: (userId: string, storyId: string, optionId: string) => void;
  answerStoryQuestion: (userId: string, storyId: string, text: string, authorName: string) => void;
  createHighlight: (title: string, coverUrl: string, storyIds: string[]) => void;
  deleteHighlight: (highlightId: string) => void;
  archiveStory: (storyId: string) => void;
}

const INITIAL_STORIES: UserStoriesGroup[] = [
  {
    id: 'story_usr_1',
    userId: 'usr_1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    isSeen: false,
    stories: [
      {
        id: 's_1_1',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        type: 'image',
        caption: 'Late night deep learning experiments at the AI Lab 🔬✨',
        createdAt: '1h ago',
        expiresAt: '23h left',
        viewers: [
          { userId: 'usr_2', userName: 'David Chen', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', viewedAt: '45m ago', reaction: '🔥' },
          { userId: 'usr_3', userName: 'Elena Rostova', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', viewedAt: '30m ago', reaction: '❤️' },
        ],
        music: {
          title: 'Midnight Code Sessions',
          artist: 'Synthesize',
          albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
        },
        poll: {
          question: 'Are edge models ready for production?',
          options: [
            { id: 'opt_1', text: '100% Yes! 🚀', votes: 142, userVoted: true },
            { id: 'opt_2', text: 'Need more precision', votes: 38, userVoted: false },
          ],
          totalVotes: 180,
        },
      },
      {
        id: 's_1_2',
        mediaUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        type: 'video',
        caption: 'Fabric renderer running 120 FPS smoothly!',
        createdAt: '30m ago',
        expiresAt: '23h left',
        viewers: [
          { userId: 'usr_2', userName: 'David Chen', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', viewedAt: '10m ago' },
        ],
      },
    ],
  },
  {
    id: 'story_usr_2',
    userId: 'usr_2',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isSeen: false,
    stories: [
      {
        id: 's_2_1',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        type: 'image',
        caption: 'CloudPulse 2.0 deployment success worldwide! ☁️🚀',
        createdAt: '2h ago',
        expiresAt: '22h left',
        viewers: [],
        questionPrompt: {
          prompt: 'Ask me anything about scaling distributed infrastructure 👇',
          responses: [
            { id: 'resp_1', authorName: 'Alex Rivera', text: 'How do you handle multi-region failovers?', createdAt: '1h ago' },
          ],
        },
      },
    ],
  },
];

const INITIAL_ARCHIVE: StoryItem[] = [
  {
    id: 'arch_1',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    type: 'image',
    caption: 'React Native EU Keynote Talk 🎤',
    createdAt: 'Aug 10, 2026',
    expiresAt: 'Expired',
    isArchived: true,
    viewers: [
      { userId: 'usr_2', userName: 'David Chen', userAvatar: '', viewedAt: 'Aug 10', reaction: '👏' },
    ],
  },
  {
    id: 'arch_2',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    type: 'image',
    caption: 'Building Secure Enclave hardware biometrics 🛡️',
    createdAt: 'Aug 14, 2026',
    expiresAt: 'Expired',
    isArchived: true,
    viewers: [],
  },
];

const INITIAL_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: 'hl_1',
    title: 'Work & Tech 💻',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    storyIds: ['arch_1', 'arch_2'],
    createdAt: 'Aug 15, 2026',
  },
  {
    id: 'hl_2',
    title: 'Conferences 🎤',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    storyIds: ['arch_1'],
    createdAt: 'Aug 18, 2026',
  },
];

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      userStories: INITIAL_STORIES,
      archivedStories: INITIAL_ARCHIVE,
      highlights: INITIAL_HIGHLIGHTS,

      addStory: (newStoryData) => {
        const id = `story_${Date.now()}`;
        const newStory: StoryItem = {
          ...newStoryData,
          id,
          createdAt: 'Just now',
          expiresAt: '24h left',
          viewers: [],
        };

        set(
          produce((state: StoryState) => {
            const myGroup = state.userStories.find((g) => g.userId === 'usr_meta_998');
            if (myGroup) {
              myGroup.stories.unshift(newStory);
            } else {
              state.userStories.unshift({
                id: 'story_my_group',
                userId: 'usr_meta_998',
                userName: 'Alex Rivera',
                userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                isSeen: false,
                stories: [newStory],
              });
            }
          })
        );
      },

      recordStoryView: (userId, storyId, viewer) => {
        set(
          produce((state: StoryState) => {
            const group = state.userStories.find((g) => g.userId === userId);
            if (group) {
              const story = group.stories.find((s) => s.id === storyId);
              if (story && !story.viewers.some((v) => v.userId === viewer.userId)) {
                story.viewers.push({
                  ...viewer,
                  viewedAt: 'Just now',
                });
              }
            }
          })
        );
      },

      reactToStory: (userId, storyId, reaction, viewer) => {
        set(
          produce((state: StoryState) => {
            const group = state.userStories.find((g) => g.userId === userId);
            if (group) {
              const story = group.stories.find((s) => s.id === storyId);
              if (story) {
                const existing = story.viewers.find((v) => v.userId === viewer.userId);
                if (existing) {
                  existing.reaction = reaction;
                } else {
                  story.viewers.push({
                    ...viewer,
                    viewedAt: 'Just now',
                    reaction,
                  });
                }
              }
            }
          })
        );

        eventBus.emit('NOTIFICATION:RECEIVED', {
          id: `notif_story_${Date.now()}`,
          title: 'Story Reaction',
          body: `${viewer.userName} reacted with ${reaction} to your story!`,
          type: 'STORY_REACTION',
        });
      },

      voteStoryPoll: (userId, storyId, optionId) => {
        set(
          produce((state: StoryState) => {
            const group = state.userStories.find((g) => g.userId === userId);
            if (group) {
              const story = group.stories.find((s) => s.id === storyId);
              if (story?.poll) {
                story.poll.options.forEach((opt) => {
                  if (opt.id === optionId) {
                    opt.votes += 1;
                    opt.userVoted = true;
                  } else if (opt.userVoted) {
                    opt.votes = Math.max(0, opt.votes - 1);
                    opt.userVoted = false;
                  }
                });
                story.poll.totalVotes += 1;
              }
            }
          })
        );
      },

      answerStoryQuestion: (userId, storyId, text, authorName) => {
        set(
          produce((state: StoryState) => {
            const group = state.userStories.find((g) => g.userId === userId);
            if (group) {
              const story = group.stories.find((s) => s.id === storyId);
              if (story?.questionPrompt) {
                story.questionPrompt.responses.unshift({
                  id: `resp_${Date.now()}`,
                  authorName,
                  text,
                  createdAt: 'Just now',
                });
              }
            }
          })
        );
      },

      createHighlight: (title, coverUrl, storyIds) => {
        const newHl: StoryHighlight = {
          id: `hl_${Date.now()}`,
          title,
          coverUrl,
          storyIds,
          createdAt: 'Just now',
        };

        set(
          produce((state: StoryState) => {
            state.highlights.push(newHl);
          })
        );
      },

      deleteHighlight: (highlightId) => {
        set(
          produce((state: StoryState) => {
            state.highlights = state.highlights.filter((h) => h.id !== highlightId);
          })
        );
      },

      archiveStory: (storyId) => {
        set(
          produce((state: StoryState) => {
            state.userStories.forEach((g) => {
              const story = g.stories.find((s) => s.id === storyId);
              if (story && !state.archivedStories.some((a) => a.id === storyId)) {
                state.archivedStories.unshift({ ...story, isArchived: true });
              }
            });
          })
        );
      },
    }),
    {
      name: 'story-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        archivedStories: state.archivedStories,
        highlights: state.highlights,
      }),
    }
  )
);
