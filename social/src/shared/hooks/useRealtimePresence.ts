import { useState, useEffect, useCallback } from 'react';
import { webSocketManager } from '../../core/realtime/WebSocketManager';

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastActive: string;
}

export function useRealtimePresence(userIds: string[] = []) {
  const [presenceMap, setPresenceMap] = useState<Record<string, UserPresence>>({});

  useEffect(() => {
    // Subscribe to presence updates
    const unsub = webSocketManager.subscribe('presence:update', (update: UserPresence) => {
      setPresenceMap((prev) => ({
        ...prev,
        [update.userId]: update,
      }));
    });

    // Request presence for target users
    if (userIds.length > 0) {
      webSocketManager.send('presence:query', { userIds });
    }

    return () => {
      unsub();
    };
  }, [userIds.join(',')]);

  const isUserOnline = useCallback(
    (userId: string): boolean => {
      return presenceMap[userId]?.isOnline ?? true; // Default fallback to online for active chat demo
    },
    [presenceMap]
  );

  const getLastActiveText = useCallback(
    (userId: string): string => {
      if (presenceMap[userId]?.isOnline) return 'Online';
      return presenceMap[userId]?.lastActive || 'Active recently';
    },
    [presenceMap]
  );

  return {
    presenceMap,
    isUserOnline,
    getLastActiveText,
  };
}
