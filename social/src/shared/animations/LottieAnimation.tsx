import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LottieView, { LottieViewProps } from 'lottie-react-native';

export type LottieAnimationType = 'likeBurst' | 'liveHeart' | 'loading' | 'successConfetti' | 'rocket';

const SAMPLE_ANIMATION_JSONS: Record<LottieAnimationType, any> = {
  likeBurst: {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: 'Heart Burst',
    ddd: 0,
    assets: [],
    layers: [],
  },
  liveHeart: {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 45,
    w: 80,
    h: 80,
    nm: 'Live Floating Heart',
    ddd: 0,
    assets: [],
    layers: [],
  },
  loading: {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 90,
    w: 60,
    h: 60,
    nm: 'Spinner',
    ddd: 0,
    assets: [],
    layers: [],
  },
  successConfetti: {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: 'Confetti',
    ddd: 0,
    assets: [],
    layers: [],
  },
  rocket: {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 75,
    w: 120,
    h: 120,
    nm: 'Rocket Launch',
    ddd: 0,
    assets: [],
    layers: [],
  },
};

export interface AppLottieProps extends Partial<LottieViewProps> {
  type?: LottieAnimationType;
  autoPlay?: boolean;
  loop?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
  onAnimationFinish?: () => void;
}

export const LottieAnimation: React.FC<AppLottieProps> = ({
  type = 'likeBurst',
  autoPlay = true,
  loop = false,
  size = 60,
  style,
  onAnimationFinish,
  ...rest
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay) {
      animationRef.current?.play();
    }
  }, [autoPlay]);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LottieView
        ref={animationRef}
        source={SAMPLE_ANIMATION_JSONS[type]}
        autoPlay={autoPlay}
        loop={loop}
        onAnimationFinish={onAnimationFinish}
        style={styles.lottie}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
  },
});
