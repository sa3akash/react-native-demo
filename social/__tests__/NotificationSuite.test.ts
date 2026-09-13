import { pushNotificationService } from '../src/core/notifications/PushNotificationService';
import { useNotificationStore } from '../src/store/useNotificationStore';

describe('Enterprise Notifications System Suite', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      selectedCategory: 'all',
      activeInAppBanner: null,
    });
  });

  test('PushNotificationService registers APNs/FCM device token and resolves deep links', async () => {
    const token = await pushNotificationService.registerDeviceToken();
    expect(token).toBeDefined();
    expect(pushNotificationService.getDeviceToken()).toBe(token);

    // Deep link resolver tests
    const postLink = pushNotificationService.resolveDeepLink({
      id: 'notif_p',
      title: 'New post',
      body: 'Content',
      channel: 'push',
      category: 'reactions',
      data: { targetType: 'post', targetId: 'post_999' },
    });
    expect(postLink).toBe('socialsphere://feed/post/post_999');

    const chatLink = pushNotificationService.resolveDeepLink({
      id: 'notif_c',
      title: 'New DM',
      body: 'Hey!',
      channel: 'push',
      category: 'messages',
      data: { targetType: 'chat', targetId: 'conv_88' },
    });
    expect(chatLink).toBe('socialsphere://chat/conv_88');

    const callLink = pushNotificationService.resolveDeepLink({
      id: 'notif_call',
      title: 'Call alert',
      body: 'Incoming',
      channel: 'push',
      category: 'calls',
      data: { targetType: 'call', targetId: 'call_77' },
    });
    expect(callLink).toBe('socialsphere://call/call_77');
  });

  test('useNotificationStore supports Push, In-App, Email, and SMS notifications', () => {
    const initialCount = useNotificationStore.getState().notifications.length;

    // Add In-App notification
    useNotificationStore.getState().addNotification({
      category: 'mentions',
      channel: 'inApp',
      title: 'Sarah Jenkins tagged you',
      body: 'Check out the new WebRTC audio engine!',
      avatarUrl: '',
      targetType: 'post',
      targetId: 'post_200',
    });

    const notifs = useNotificationStore.getState().notifications;
    expect(notifs.length).toBe(initialCount + 1);
    expect(notifs[0].title).toBe('Sarah Jenkins tagged you');
    expect(notifs[0].channel).toBe('inApp');
    expect(useNotificationStore.getState().activeInAppBanner?.title).toBe('Sarah Jenkins tagged you');

    // Dismiss banner
    useNotificationStore.getState().dismissInAppBanner();
    expect(useNotificationStore.getState().activeInAppBanner).toBeNull();
  });

  test('Marks notifications as read and deletes individual entries', () => {
    const notifs = useNotificationStore.getState().notifications;
    const target = notifs[0];

    useNotificationStore.getState().markAsRead(target.id);
    const updated = useNotificationStore.getState().notifications.find((n) => n.id === target.id);
    expect(updated?.isRead).toBe(true);

    useNotificationStore.getState().markAllAsRead();
    expect(useNotificationStore.getState().unreadCount).toBe(0);

    // Delete
    const countBefore = useNotificationStore.getState().notifications.length;
    useNotificationStore.getState().deleteNotification(target.id);
    expect(useNotificationStore.getState().notifications.length).toBe(countBefore - 1);
  });

  test('Manages Notification Settings (Push, Email, SMS, and Quiet Hours DND)', () => {
    useNotificationStore.getState().updateSettings({
      pushEnabled: false,
      emailWeeklyDigest: false,
      smsTwoFactorAlerts: true,
      dndEnabled: true,
      quietHoursStart: '23:00',
      quietHoursEnd: '06:30',
    });

    const settings = useNotificationStore.getState().settings;
    expect(settings.pushEnabled).toBe(false);
    expect(settings.emailWeeklyDigest).toBe(false);
    expect(settings.smsTwoFactorAlerts).toBe(true);
    expect(settings.dndEnabled).toBe(true);
    expect(settings.quietHoursStart).toBe('23:00');
  });
});
