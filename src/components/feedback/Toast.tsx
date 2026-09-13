import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { ToastNotice, useUiStore } from '../../app/store/uiStore';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export const ToastContainer: React.FC = () => {
  const toasts = useUiStore(state => state.toasts);
  const dismissToast = useUiStore(state => state.dismissToast);
  const { theme } = useTheme();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => {
        const getBgColor = (type: ToastNotice['type']) => {
          switch (type) {
            case 'success':
              return theme.colors.status.success;
            case 'error':
              return theme.colors.status.error;
            case 'warning':
              return theme.colors.status.warning;
            case 'info':
            default:
              return theme.colors.brand.primary;
          }
        };

        return (
          <Animated.View
            key={toast.id}
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[
              styles.toast,
              {
                backgroundColor: getBgColor(toast.type),
                borderRadius: theme.radius.md,
                ...theme.shadows.medium,
              },
            ]}>
            <Text size={14} weight="600" color={theme.colors.text.inverse} style={styles.text}>
              {toast.message}
            </Text>
            <Pressable onPress={() => dismissToast(toast.id)} style={styles.close}>
              <Text size={14} color={theme.colors.text.inverse}>
                ✕
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  text: {
    flex: 1,
  },
  close: {
    marginLeft: 12,
    padding: 4,
  },
});
