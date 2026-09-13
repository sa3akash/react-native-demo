import { useState, useEffect, useCallback } from 'react';
import { pushNotificationManager, PushNotificationPayload } from '../../core/realtime/PushNotificationManager';
import { usePermissions } from './usePermissions';

export function usePushNotifications() {
  const [deviceToken, setDeviceToken] = useState<string | null>(pushNotificationManager.getDeviceToken());
  const [lastNotification, setLastNotification] = useState<PushNotificationPayload | null>(null);
  const { requestPermission, hasNotifications } = usePermissions();

  const register = useCallback(async (): Promise<string | null> => {
    const status = await requestPermission('notifications', {
      title: 'Notification Permission',
      message: 'Enable notifications to receive instant message alerts, calls, and post reactions.',
    });

    if (status === 'granted') {
      const token = await pushNotificationManager.registerForPushNotifications();
      setDeviceToken(token);
      return token;
    }
    return null;
  }, [requestPermission]);

  useEffect(() => {
    const unsubscribe = pushNotificationManager.subscribe((notification) => {
      setLastNotification(notification);
    });

    return unsubscribe;
  }, []);

  return {
    deviceToken,
    hasPermission: hasNotifications,
    lastNotification,
    register,
    routeAction: pushNotificationManager.routeNotificationAction.bind(pushNotificationManager),
  };
}
