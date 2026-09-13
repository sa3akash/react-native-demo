import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar } from '../../shared/components';
import { useNotificationStore, AppNotification } from '../../store/useNotificationStore';

export interface InAppNotificationBannerProps {
  onPressNotification?: (notification: AppNotification) => void;
}

const InAppNotificationBannerComponent: React.FC<InAppNotificationBannerProps> = ({
  onPressNotification,
}) => {
  const { colors, theme } = useTheme();
  const activeInAppBanner = useNotificationStore((state) => state.activeInAppBanner);
  const dismissInAppBanner = useNotificationStore((state) => state.dismissInAppBanner);

  const translateY = useRef(new Animated.Value(-120)).current;
  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    if (activeInAppBanner) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6,
      }).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [activeInAppBanner]);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      dismissInAppBanner();
    });
  };

  if (!activeInAppBanner) return null;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          onPressNotification?.(activeInAppBanner);
          handleDismiss();
        }}
        style={[
          styles.bannerCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.borderSubtle,
            borderRadius: theme.radius.lg,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Avatar
          uri={activeInAppBanner.avatarUrl}
          name={activeInAppBanner.title}
          size="md"
        />

        <View style={styles.textCol}>
          <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
            {activeInAppBanner.title}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary} numberOfLines={2}>
            {activeInAppBanner.body}
          </Typography>
        </View>

        <TouchableOpacity onPress={handleDismiss} style={styles.dismissBtn}>
          <Typography variant="caption" color={colors.textMuted}>
            ✕
          </Typography>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const InAppNotificationBanner = memo(InAppNotificationBannerComponent);

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bannerCard: {
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  textCol: {
    flex: 1,
  },
  dismissBtn: {
    padding: 6,
  },
});
