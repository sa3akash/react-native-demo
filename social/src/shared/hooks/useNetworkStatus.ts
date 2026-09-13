import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { eventBus } from '../../core/events/EventBus';
import { useOfflineStore } from '../../store/useOfflineStore';

/**
 * Hook to track real-time network connectivity and trigger offline queue sync.
 */
export function useNetworkStatus() {
  const { isOnline, isSyncing, queuedMutationsCount, syncNow, setIsOnline } = useOfflineStore();

  useEffect(() => {
    const unsubOnline = eventBus.on('NETWORK:ONLINE', () => {
      setIsOnline(true);
    });

    const unsubOffline = eventBus.on('NETWORK:OFFLINE', () => {
      setIsOnline(false);
    });

    return () => {
      unsubOnline();
      unsubOffline();
    };
  }, [setIsOnline]);

  return {
    isOnline,
    isSyncing,
    queuedMutationsCount,
    syncNow,
  };
}

/**
 * Hook to track App state (active, background, inactive) for lifecycle events.
 */
export function useAppState(onForeground?: () => void, onBackground?: () => void) {
  const [appState, setAppState] = useState<AppStateStatus>((AppState.currentState as AppStateStatus) || 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        onForeground?.();
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        onBackground?.();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, onForeground, onBackground]);

  return {
    appState,
    isForeground: appState === 'active',
    isBackground: appState === 'background',
  };
}
