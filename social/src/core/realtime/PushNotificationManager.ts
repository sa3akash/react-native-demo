import { eventBus } from '../events/EventBus';
import { storageService } from '../storage/StorageService';
import { NavigationShortcuts } from '../../navigation/NavigationShortcuts';

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  category: 'message' | 'call' | 'post' | 'like' | 'comment' | 'system';
  data?: {
    conversationId?: string;
    callId?: string;
    postId?: string;
    userId?: string;
    channelId?: string;
    url?: string;
  };
  badge?: number;
  timestamp: number;
}

export type NotificationHandler = (notification: PushNotificationPayload) => void;

class PushNotificationManager {
  private deviceToken: string | null = null;
  private listeners: Set<NotificationHandler> = new Set();

  constructor() {
    this.deviceToken = storageService.getItem<string>('push_device_token');
  }

  /**
   * Register device for Remote Push Notifications (FCM / APNs)
   */
  public async registerForPushNotifications(): Promise<string> {
    // Generate simulated high-entropy APNs / FCM push token
    const token = 'fcm_tok_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    this.deviceToken = token;
    storageService.setItem('push_device_token', token);

    eventBus.emit('NOTIFICATION:TOKEN_REGISTERED' as any, { token });
    return token;
  }

  /**
   * Get current device push token
   */
  public getDeviceToken(): string | null {
    return this.deviceToken;
  }

  /**
   * Handle incoming push payload (foreground or background tap)
   */
  public handleIncomingNotification(notification: PushNotificationPayload, isAppInForeground = true): void {
    // Notify all active in-app listeners
    this.listeners.forEach((handler) => {
      try {
        handler(notification);
      } catch (err) {
        console.warn('[PushNotificationManager] Handler error:', err);
      }
    });

    // Update notification unread badges
    eventBus.emit('NOTIFICATION:RECEIVED' as any, notification);

    // If tapped from background/killed state, execute smart deep link routing
    if (!isAppInForeground && notification.data) {
      this.routeNotificationAction(notification);
    }
  }

  /**
   * Smart routing based on notification payload category
   */
  public routeNotificationAction(notification: PushNotificationPayload): void {
    const { category, data } = notification;

    if (!data) {
      NavigationShortcuts.openNotifications();
      return;
    }

    switch (category) {
      case 'message':
        if (data.conversationId) {
          NavigationShortcuts.openChat(data.conversationId);
        }
        break;
      case 'call':
        if (data.callId && data.userId) {
          NavigationShortcuts.startVideoCall(data.userId);
        }
        break;
      case 'post':
      case 'like':
      case 'comment':
        if (data.postId) {
          NavigationShortcuts.openPost(data.postId);
        }
        break;
      default:
        NavigationShortcuts.openNotifications();
        break;
    }
  }

  /**
   * Subscribe to incoming notifications
   */
  public subscribe(handler: NotificationHandler): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }
}

export const pushNotificationManager = new PushNotificationManager();
