import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  variant?: 'rect' | 'circle' | 'text';
  style?: StyleProp<ViewStyle>;
}

const SkeletonComponent: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius,
  variant = 'rect',
  style,
}) => {
  const { colors, theme } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  let resolvedRadius = borderRadius !== undefined ? borderRadius : theme.radius.md;
  let resolvedWidth = width;
  let resolvedHeight = height;

  if (variant === 'circle') {
    const size = typeof height === 'number' ? height : 40;
    resolvedWidth = size;
    resolvedHeight = size;
    resolvedRadius = size / 2;
  } else if (variant === 'text') {
    resolvedHeight = 14;
    resolvedRadius = theme.radius.xs;
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: resolvedWidth,
          height: resolvedHeight,
          borderRadius: resolvedRadius,
          backgroundColor: colors.surfaceElevated,
          opacity: opacityAnim,
        },
        style,
      ]}
      accessible={true}
      accessibilityLabel="Loading content"
      accessibilityRole="progressbar"
    />
  );
};

export const Skeleton = memo(SkeletonComponent);

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
