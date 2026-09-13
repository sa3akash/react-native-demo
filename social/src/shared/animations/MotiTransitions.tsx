import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

export interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 350,
  style,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
      transition={
        {
          type: 'timing',
          duration,
          delay,
        } as any
      }
      style={style}
    >
      {children}
    </MotiView>
  );
};

export interface ScalePopViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export const ScalePopView: React.FC<ScalePopViewProps> = ({
  children,
  delay = 0,
  style,
}) => {
  return (
    <MotiView
      from={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={
        {
          type: 'spring',
          damping: 15,
          stiffness: 150,
          delay,
        } as any
      }
      style={style}
    >
      {children}
    </MotiView>
  );
};

export { MotiView, AnimatePresence };
