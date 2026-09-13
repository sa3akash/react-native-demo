import React, { memo } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  hasStory?: boolean;
  isStorySeen?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
  isOnline?: boolean;
  onPress?: () => void;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 34,
  md: 44,
  lg: 60,
  xl: 96,
};

const AvatarComponent: React.FC<AvatarProps> = ({
  uri,
  name = 'User',
  size = 'md',
  hasStory = false,
  isStorySeen = false,
  status,
  isOnline,
  onPress,
}) => {
  const resolvedStatus = status || (isOnline ? 'online' : undefined);
  const { colors, theme } = useTheme();
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const storyBorderColor = hasStory
    ? isStorySeen
      ? colors.border
      : colors.primary
    : 'transparent';

  const avatarElement = (
    <View
      style={[
        styles.ringWrapper,
        {
          width: dimension + (hasStory ? 6 : 0),
          height: dimension + (hasStory ? 6 : 0),
          borderRadius: theme.radius.full,
          borderColor: storyBorderColor,
          borderWidth: hasStory ? 2.5 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            width: dimension,
            height: dimension,
            borderRadius: theme.radius.full,
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.surface,
            borderWidth: hasStory ? 1.5 : 0,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          />
        ) : (
          <View
            style={[
              styles.fallback,
              {
                backgroundColor: colors.primaryLight,
                width: dimension,
                height: dimension,
                borderRadius: dimension / 2,
              },
            ]}
          >
            <Typography
              variant={size === 'xs' || size === 'sm' ? 'caption' : 'subtitle2'}
              color={colors.primary}
              bold
            >
              {initials}
            </Typography>
          </View>
        )}
      </View>

      {resolvedStatus && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                resolvedStatus === 'online'
                  ? colors.success
                  : resolvedStatus === 'busy'
                  ? colors.danger
                  : colors.textMuted,
              borderColor: colors.surface,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {avatarElement}
      </TouchableOpacity>
    );
  }

  return avatarElement;
};

export const Avatar = memo(AvatarComponent);

const BadgeComponent: React.FC<{
  count?: number;
  label?: string;
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'info';
  dot?: boolean;
}> = ({ count, label, variant = 'danger', dot = false }) => {
  const { colors, theme } = useTheme();

  let bgColor = colors.danger;
  let textColor = '#FFFFFF';

  if (variant === 'primary') bgColor = colors.primary;
  if (variant === 'success') bgColor = colors.success;
  if (variant === 'warning') bgColor = colors.warning;
  if (variant === 'info') bgColor = colors.info;

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: bgColor,
            borderColor: colors.surface,
          },
        ]}
      />
    );
  }

  const displayText = count !== undefined ? (count > 99 ? '99+' : `${count}`) : label;

  if (!displayText) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderRadius: theme.radius.full,
          borderColor: colors.surface,
        },
      ]}
    >
      <Typography variant="overline" color={textColor} bold style={styles.badgeText}>
        {displayText}
      </Typography>
    </View>
  );
};

export const Badge = memo(BadgeComponent);

const styles = StyleSheet.create({
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  inner: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
  },
});
