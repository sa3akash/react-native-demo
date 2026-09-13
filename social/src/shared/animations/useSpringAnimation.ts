import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

/**
 * Hook to produce a fluid physics spring pop animation on press (e.g. like button, reaction bounce)
 */
export function useBounceAnimation(initialScale = 1) {
  const scale = useSharedValue(initialScale);

  const bounce = useCallback(() => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 6, stiffness: 100 })
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return {
    bounce,
    animatedStyle,
    scale,
  };
}

/**
 * Hook to produce a smooth fade/slide animation
 */
export function useFadeSlideAnimation(initialVisible = true, offsetY = 20) {
  const opacity = useSharedValue(initialVisible ? 1 : 0);
  const translateY = useSharedValue(initialVisible ? 0 : offsetY);

  const show = useCallback(() => {
    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withSpring(0, { damping: 12 });
  }, [opacity, translateY]);

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(offsetY, { duration: 200 });
  }, [opacity, translateY, offsetY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return {
    show,
    hide,
    animatedStyle,
  };
}
