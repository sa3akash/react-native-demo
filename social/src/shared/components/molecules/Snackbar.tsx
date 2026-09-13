import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
  variant?: 'default' | 'success' | 'danger' | 'info';
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 4000,
  variant = 'default',
}) => {
  const { colors, theme } = useTheme();
  const translateY = useRef(new Animated.Value(80)).current;
  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, {
        toValue: 80,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration, onDismiss, translateY]);

  if (!visible) return null;

  let bgColor = colors.text;
  let textColor = colors.textInverse;
  let actionColor = colors.primary;

  if (variant === 'success') {
    bgColor = colors.success;
    textColor = '#FFFFFF';
    actionColor = '#FFFFFF';
  } else if (variant === 'danger') {
    bgColor = colors.danger;
    textColor = '#FFFFFF';
    actionColor = '#FFFFFF';
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          backgroundColor: bgColor,
          borderRadius: theme.radius.md,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Typography variant="body2" color={textColor} style={styles.message}>
        {message}
      </Typography>

      {actionLabel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            onAction?.();
            onDismiss();
          }}
          style={styles.actionBtn}
          accessible={true}
          accessibilityRole="button"
        >
          <Typography variant="buttonSmall" color={actionColor} bold>
            {actionLabel}
          </Typography>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export const Snackbar = memo(SnackbarComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    marginRight: 10,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
