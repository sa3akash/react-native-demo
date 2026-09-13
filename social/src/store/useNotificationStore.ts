import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { eventBus } from '../core/events/EventBus';
import { zustandMMKVStorage } from '../core/storage/StorageService';

export type NotificationCategory =
  | 'all'
  | 'mentions'
  | 'reactions'
  | 'comments'
  | 'calls'
  | 'messages'
  | 'security'
  | 'marketplace'
  | 'system';

export type NotificationChannel = 'push' | 'inApp' | 'email' | 'sms';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  title: string;
  body: string;
  avatarUrl?: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'chat' | 'call' | 'product' | 'profile' | 'security';
  createdAt: string;
  isRead: boolean;
}

export interface NotificationSettings {
  // Push Notifications
  pushEnabled: boolean;
  pushLikesAndReactions: boolean;
  pushCommentsAndReplies: boolean;
  pushMentionsAndTags: boolean;
  pushDirectMessages: boolean;
  pushCallAlerts: boolean;
  pushStoriesAndReels: boolean;

  // In-App Notifications
  inAppEnabled: boolean;
  inAppSound: boolean;
  inAppVibration: boolean;
  inAppBannerDurationSec: number;

  // Email Notifications
  emailEnabled: boolean;
  emailWeeklyDigest: boolean;
  emailSecurityAlerts: boolean;
  emailProductUpdates: boolean;

  // SMS Notifications
  smsEnabled: boolean;
  smsTwoFactorAlerts: boolean;
  smsSecurityAlerts: boolean;

  // Quiet Hours / Do Not Disturb
  dndEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "07:00"
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  pushLikesAndReactions: true,
  pushCommentsAndReplies: true,
  pushMentionsAndTags: true,
  pushDirectMessages: true,
  pushCallAlerts: true,
  pushStoriesAndReels: true,

  inAppEnabled: true,
  inAppSound: true,
  inAppVibration: true,
  inAppBannerDurationSec: 4,

  emailEnabled: true,
  emailWeeklyDigest: true,
  emailSecurityAlerts: true,
  emailProductUpdates: false,

  smsEnabled: true,
  smsTwoFactorAlerts: true,
  smsSecurityAlerts: true,

  dndEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

interface NotificationState {
  notifications: AppNotification[];
  selectedCategory: NotificationCategory;
  unreadCount: number;
  settings: NotificationSettings;
  activeInAppBanner: AppNotification | null;

  setSelectedCategory: (category: NotificationCategory) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  updateSettings: (partial: Partial<NotificationSettings>) => void;
  dismissInAppBanner: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    category: 'reactions',
    channel: 'push',
    title: 'Sarah Jenkins loved your post',
    body: '"Excited to announce our breakthrough on multi-modal neural..."',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    targetId: 'post_101',
    targetType: 'post',
    createdAt: '10m ago',
    isRead: false,
  },
  {
    id: 'notif_2',
    category: 'comments',
    channel: 'push',
    title: 'David Chen commented on your post',
    body: '"TanStack Query + Zustand is the unmatched gold standard."',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    targetId: 'post_102',
    targetType: 'post',
    createdAt: '45m ago',
    isRead: false,
  },
  {
    id: 'notif_3',
    category: 'mentions',
    channel: 'inApp',
    title: 'Elena Rostova mentioned you in a comment',
    body: '@alex.rivera check out the new 60 FPS glassmorphic reel interactions!',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    targetId: 'post_103',
    targetType: 'post',
    createdAt: '2h ago',
    isRead: false,
  },
  {
    id: 'notif_4',
    category: 'calls',
    channel: 'push',
    title: 'Missed Call from Sarah Jenkins',
    body: 'Incoming HD Video call at 10:30 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    targetId: 'call_101',
    targetType: 'call',
    createdAt: '3h ago',
    isRead: true,
  },
  {
    id: 'notif_5',
    category: 'security',
    channel: 'sms',
    title: 'New Device Login Alert',
    body: 'Login detected from iPhone 16 Pro Max in San Francisco, CA',
    targetId: 'sec_101',
    targetType: 'security',
    createdAt: '1d ago',
    isRead: true,
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      selectedCategory: 'all',
      unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.isRead).length,
      settings: DEFAULT_NOTIFICATION_SETTINGS,
      activeInAppBanner: null,

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      markAsRead: (id) => {
        set(
          produce((state: NotificationState) => {
            const notif = state.notifications.find((n) => n.id === id);
            if (notif && !notif.isRead) {
              notif.isRead = true;
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          })
        );
      },

      markAllAsRead: () => {
        set(
          produce((state: NotificationState) => {
            state.notifications.forEach((n) => {
              n.isRead = true;
            });
            state.unreadCount = 0;
          })
        );
      },

      deleteNotification: (id) => {
        set(
          produce((state: NotificationState) => {
            const index = state.notifications.findIndex((n) => n.id === id);
            if (index > -1) {
              if (!state.notifications[index].isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
              state.notifications.splice(index, 1);
            }
          })
        );
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      addNotification: (notification) => {
        const id = `notif_${Date.now()}`;
        const newNotif: AppNotification = {
          ...notification,
          id,
          createdAt: 'Just now',
          isRead: false,
        };

        set(
          produce((state: NotificationState) => {
            state.notifications.unshift(newNotif);
            state.unreadCount += 1;
            if (state.settings.inAppEnabled && newNotif.channel === 'inApp') {
              state.activeInAppBanner = newNotif;
            }
          })
        );

        eventBus.emit('NOTIFICATION:RECEIVED', {
          id,
          title: newNotif.title,
          body: newNotif.body,
          type: newNotif.category,
        });
      },

      updateSettings: (partial) => {
        set(
          produce((state: NotificationState) => {
            state.settings = { ...state.settings, ...partial };
          })
        );
      },

      dismissInAppBanner: () => {
        set({ activeInAppBanner: null });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
      }),
    }
  )
);
