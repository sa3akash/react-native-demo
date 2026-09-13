import { useCallback } from 'react';
import { Vibration, Platform } from 'react-native';

export type HapticFeedbackType = 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError';

export function useHaptics() {
  const trigger = useCallback((type: HapticFeedbackType = 'selection') => {
    if (Platform.OS === 'android') {
      switch (type) {
        case 'impactLight':
        case 'selection':
          Vibration.vibrate(10);
          break;
        case 'impactMedium':
          Vibration.vibrate(25);
          break;
        case 'impactHeavy':
        case 'notificationError':
          Vibration.vibrate(50);
          break;
        case 'notificationSuccess':
          Vibration.vibrate([0, 20, 50, 20]);
          break;
        default:
          Vibration.vibrate(15);
      }
    } else {
      // iOS Vibration fallback pattern
      Vibration.vibrate();
    }
  }, []);

  return {
    trigger,
    light: () => trigger('impactLight'),
    medium: () => trigger('impactMedium'),
    heavy: () => trigger('impactHeavy'),
    success: () => trigger('notificationSuccess'),
    error: () => trigger('notificationError'),
    selection: () => trigger('selection'),
  };
}
