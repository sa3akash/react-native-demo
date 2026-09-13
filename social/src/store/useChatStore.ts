import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { eventBus } from '../core/events/EventBus';
import { offlineSyncQueue } from '../core/network/offlineSyncQueue';
import { webSocketManager } from '../core/realtime/WebSocketManager';
import { zustandMMKVStorage } from '../core/storage/StorageService';

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'voice'
  | 'file'
  | 'gif'
  | 'sticker';

export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type ConversationType = 'direct' | 'group' | 'channel' | 'community';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  voiceDuration?: string;
  createdAt: string;
  status: DeliveryStatus;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  replyToMessage?: {
    id: string;
    senderName: string;
    content: string;
    type?: MessageType;
  };
  isPinned?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedFor?: 'everyone' | 'me';
  forwardedFrom?: string;
  scheduledFor?: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  role?: 'admin' | 'member';
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  title: string;
  avatarUrl: string;
  type: ConversationType;
  description?: string;
  participants: ConversationParticipant[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderName: string;
    type?: MessageType;
    status?: DeliveryStatus;
  };
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  pinnedMessageId?: string;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  typingUsers: Record<string, string[]>; // convId -> userNames

  setActiveConversation: (id: string | null) => void;
  sendMessage: (params: {
    conversationId: string;
    content: string;
    type?: MessageType;
    mediaUrl?: string;
    fileName?: string;
    fileSizeBytes?: number;
    voiceDuration?: string;
    replyToMessage?: ChatMessage['replyToMessage'];
    scheduledFor?: string;
  }) => string;
  editMessage: (conversationId: string, messageId: string, newContent: string) => void;
  deleteMessage: (conversationId: string, messageId: string, mode: 'everyone' | 'me') => void;
  forwardMessage: (targetConversationId: string, message: ChatMessage) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string, userId?: string) => void;
  removeReaction: (conversationId: string, messageId: string, emoji: string, userId?: string) => void;
  pinMessage: (conversationId: string, messageId: string) => void;
  unpinMessage: (conversationId: string) => void;
  setTyping: (conversationId: string, userName: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string) => void;
  markAsDelivered: (conversationId: string, messageId: string) => void;
  createConversation: (data: Omit<Conversation, 'id' | 'unreadCount'>) => string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    type: 'direct',
    participants: [
      { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', isOnline: true },
      { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', isOnline: true },
    ],
    lastMessage: {
      content: 'Zero-copy TurboModules are ready for testing! 🚀',
      createdAt: '2m ago',
      senderName: 'Sarah Jenkins',
      type: 'text',
      status: 'read',
    },
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'conv_2',
    title: 'Core Mobile Architects 🛠️',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    type: 'group',
    description: 'Architecture & high-performance engineering discussions',
    participants: [
      { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', role: 'admin', isOnline: true },
      { id: 'usr_2', name: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', role: 'admin', isOnline: true },
      { id: 'usr_3', name: 'Elena Rostova', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', role: 'member', isOnline: false, lastSeen: '10m ago' },
      { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', role: 'member', isOnline: true },
    ],
    lastMessage: {
      content: 'Benchmarking MMKV vs SQLite with 1M ops ⚡',
      createdAt: '15m ago',
      senderName: 'David Chen',
      type: 'text',
      status: 'delivered',
    },
    unreadCount: 3,
    isPinned: true,
  },
  {
    id: 'conv_3',
    title: 'React Native 2026 Announcements 📢',
    avatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    type: 'channel',
    description: 'Official broadcast channel for new releases and benchmarks',
    participants: [
      { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
    ],
    lastMessage: {
      content: 'Fabric Native Component bindings released in v0.87 🎉',
      createdAt: '1h ago',
      senderName: 'Alex Rivera',
      type: 'text',
      status: 'read',
    },
    unreadCount: 0,
  },
  {
    id: 'conv_4',
    title: 'Deep Learning & Edge AI Community 🌐',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    type: 'community',
    description: 'Global community space for neural networks and on-device machine learning',
    participants: [
      { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: '', role: 'admin', isOnline: true },
    ],
    lastMessage: {
      content: 'Multi-modal INT8 quantized models achieved 4.2x faster inference!',
      createdAt: '3h ago',
      senderName: 'Sarah Jenkins',
      type: 'text',
      status: 'read',
    },
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      content: 'Hey Alex! Have you reviewed the new HLS & DASH adaptive streaming protocols?',
      type: 'text',
      createdAt: '10:14 AM',
      status: 'read',
      reactions: { '👍': ['usr_meta_998'] },
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'usr_meta_998',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      content: 'Yes, the zero-copy buffer configs and ExoPlayer/AVPlayer bindings look ultra fast!',
      type: 'text',
      createdAt: '10:16 AM',
      status: 'read',
      replyToMessage: {
        id: 'msg_1',
        senderName: 'Sarah Jenkins',
        content: 'Hey Alex! Have you reviewed the new HLS & DASH adaptive streaming protocols?',
      },
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      content: 'Check out this benchmark recording on Snapdragon 8 Gen 3:',
      type: 'video',
      mediaUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      createdAt: '10:18 AM',
      status: 'read',
      reactions: { '🔥': ['usr_meta_998'], '❤️': ['usr_meta_998'] },
    },
    {
      id: 'msg_4',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      content: 'Voice explanation attached below:',
      type: 'voice',
      mediaUrl: 'https://sample-audio.com/voice_sample_1.mp3',
      voiceDuration: '0:38',
      createdAt: '10:20 AM',
      status: 'read',
      isPinned: true,
    },
  ],
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: INITIAL_CONVERSATIONS,
      messages: INITIAL_MESSAGES,
      activeConversationId: null,
      typingUsers: {},

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
        if (id) {
          get().markAsRead(id);
        }
      },

      sendMessage: ({
        conversationId,
        content,
        type = 'text',
        mediaUrl,
        fileName,
        fileSizeBytes,
        voiceDuration,
        replyToMessage,
        scheduledFor,
      }) => {
        const id = `msg_${Date.now()}`;
        const newMsg: ChatMessage = {
          id,
          conversationId,
          senderId: 'usr_meta_998',
          senderName: 'Alex Rivera',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          content,
          type,
          mediaUrl,
          fileName,
          fileSizeBytes,
          voiceDuration,
          createdAt: 'Just now',
          status: 'sending',
          replyToMessage,
          scheduledFor,
        };

        set(
          produce((state: ChatState) => {
            if (!state.messages[conversationId]) {
              state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(newMsg);

            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
              conv.lastMessage = {
                content: type === 'text' ? content : `[${type.toUpperCase()}] ${content || ''}`,
                createdAt: 'Just now',
                senderName: 'Alex Rivera',
                type,
                status: 'sending',
              };
            }
          })
        );

        // Transition status: sending -> sent -> delivered
        setTimeout(() => {
          set(
            produce((state: ChatState) => {
              const msg = state.messages[conversationId]?.find((m) => m.id === id);
              if (msg) msg.status = 'sent';
              const conv = state.conversations.find((c) => c.id === conversationId);
              if (conv?.lastMessage) conv.lastMessage.status = 'sent';
            })
          );
        }, 300);

        setTimeout(() => {
          set(
            produce((state: ChatState) => {
              const msg = state.messages[conversationId]?.find((m) => m.id === id);
              if (msg) msg.status = 'delivered';
              const conv = state.conversations.find((c) => c.id === conversationId);
              if (conv?.lastMessage) conv.lastMessage.status = 'delivered';
            })
          );
        }, 900);

        offlineSyncQueue.enqueue({
          type: 'SEND_MESSAGE',
          endpoint: `/conversations/${conversationId}/messages`,
          method: 'POST',
          payload: newMsg,
        });

        eventBus.emit('CHAT:NEW_MESSAGE', {
          messageId: id,
          conversationId,
          senderId: 'usr_meta_998',
          content,
        });

        return id;
      },

      editMessage: (conversationId, messageId, newContent) => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              const msg = list.find((m) => m.id === messageId);
              if (msg) {
                msg.content = newContent;
                msg.isEdited = true;
              }
            }
          })
        );
      },

      deleteMessage: (conversationId, messageId, mode) => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              if (mode === 'everyone') {
                const msg = list.find((m) => m.id === messageId);
                if (msg) {
                  msg.isDeleted = true;
                  msg.content = '🚫 This message was deleted';
                  msg.mediaUrl = undefined;
                }
              } else {
                state.messages[conversationId] = list.filter((m) => m.id !== messageId);
              }
            }
          })
        );
      },

      forwardMessage: (targetConversationId, message) => {
        const id = `msg_fwd_${Date.now()}`;
        const forwardedMsg: ChatMessage = {
          ...message,
          id,
          conversationId: targetConversationId,
          senderId: 'usr_meta_998',
          senderName: 'Alex Rivera',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          createdAt: 'Just now',
          status: 'sent',
          forwardedFrom: message.senderName,
        };

        set(
          produce((state: ChatState) => {
            if (!state.messages[targetConversationId]) {
              state.messages[targetConversationId] = [];
            }
            state.messages[targetConversationId].push(forwardedMsg);

            const conv = state.conversations.find((c) => c.id === targetConversationId);
            if (conv) {
              conv.lastMessage = {
                content: `Forwarded: ${forwardedMsg.content}`,
                createdAt: 'Just now',
                senderName: 'Alex Rivera',
              };
            }
          })
        );
      },

      addReaction: (conversationId, messageId, emoji, userId = 'usr_meta_998') => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              const msg = list.find((m) => m.id === messageId);
              if (msg) {
                if (!msg.reactions) msg.reactions = {};
                if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
                if (!msg.reactions[emoji].includes(userId)) {
                  msg.reactions[emoji].push(userId);
                }
              }
            }
          })
        );
      },

      removeReaction: (conversationId, messageId, emoji, userId = 'usr_meta_998') => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              const msg = list.find((m) => m.id === messageId);
              if (msg?.reactions?.[emoji]) {
                msg.reactions[emoji] = msg.reactions[emoji].filter((u) => u !== userId);
                if (msg.reactions[emoji].length === 0) {
                  delete msg.reactions[emoji];
                }
              }
            }
          })
        );
      },

      pinMessage: (conversationId, messageId) => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              list.forEach((m) => {
                m.isPinned = m.id === messageId;
              });
            }
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
              conv.pinnedMessageId = messageId;
            }
          })
        );
      },

      unpinMessage: (conversationId) => {
        set(
          produce((state: ChatState) => {
            const list = state.messages[conversationId];
            if (list) {
              list.forEach((m) => {
                m.isPinned = false;
              });
            }
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
              conv.pinnedMessageId = undefined;
            }
          })
        );
      },

      setTyping: (conversationId, userName, isTyping) => {
        set(
          produce((state: ChatState) => {
            if (!state.typingUsers[conversationId]) {
              state.typingUsers[conversationId] = [];
            }
            const list = state.typingUsers[conversationId];
            if (isTyping && !list.includes(userName)) {
              list.push(userName);
            } else if (!isTyping) {
              state.typingUsers[conversationId] = list.filter((n) => n !== userName);
            }
          })
        );
      },

      markAsRead: (conversationId) => {
        set(
          produce((state: ChatState) => {
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) {
              conv.unreadCount = 0;
              if (conv.lastMessage) {
                conv.lastMessage.status = 'read';
              }
            }
            const list = state.messages[conversationId];
            if (list) {
              list.forEach((m) => {
                if (m.senderId !== 'usr_meta_998') {
                  m.status = 'read';
                }
              });
            }
          })
        );
      },

      markAsDelivered: (conversationId, messageId) => {
        set(
          produce((state: ChatState) => {
            const msg = state.messages[conversationId]?.find((m) => m.id === messageId);
            if (msg && msg.status !== 'read') {
              msg.status = 'delivered';
            }
          })
        );
      },

      createConversation: (data) => {
        const id = `conv_${Date.now()}`;
        const newConv: Conversation = {
          ...data,
          id,
          unreadCount: 0,
        };

        set(
          produce((state: ChatState) => {
            state.conversations.unshift(newConv);
            state.messages[id] = [];
          })
        );

        return id;
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
