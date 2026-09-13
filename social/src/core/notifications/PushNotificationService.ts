import { eventBus } from '../events/EventBus';

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  channel: 'push' | 'inApp' | 'email' | 'sms';
  category: 'reactions' | 'comments' | 'mentions' | 'calls' | 'messages' | 'security' | 'system';
  data?: {
    targetType?: 'post' | 'comment' | 'chat' | 'call' | 'profile' | 'security';
    targetId?: string;
    deepLink?: string;
  };
  badgeCount?: number;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private fcmToken: string | null = null;
  private isRegistered: boolean = false;

  private constructor() {}

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Register device for Apple Push Notifications (APNs) and Firebase Cloud Messaging (FCM)
   */
  public async registerDeviceToken(): Promise<string> {
    const mockToken = `fcm_device_token_${Date.now()}_secure_enterprise_hash`;
    this.fcmToken = mockToken;
    this.isRegistered = true;
    return mockToken;
  }

  public getDeviceToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Resolve deep link destination from push notification payload
   */
  public resolveDeepLink(payload: PushNotificationPayload): string {
    if (payload.data?.deepLink) return payload.data.deepLink;

    const { targetType, targetId } = payload.data || {};
    switch (targetType) {
      case 'post':
        return `socialsphere://feed/post/${targetId || 'latest'}`;
      case 'chat':
        return `socialsphere://chat/${targetId || 'direct'}`;
      case 'call':
        return `socialsphere://call/${targetId || 'active'}`;
      case 'profile':
        return `socialsphere://profile/${targetId || 'me'}`;
      case 'security':
        return `socialsphere://settings/security`;
      default:
        return `socialsphere://notifications`;
    }
  }

  /**
   * Simulate handling of incoming remote push notification
   */
  public handleRemotePush(payload: PushNotificationPayload): void {
    eventBus.emit('NOTIFICATION:RECEIVED', {
      id: payload.id,
      title: payload.title,
      body: payload.body,
      type: payload.category,
      data: payload.data,
    });

    if (payload.badgeCount !== undefined) {
      eventBus.emit('NOTIFICATION:BADGE_UPDATED', {
        unreadCount: payload.badgeCount,
      });
    }
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
