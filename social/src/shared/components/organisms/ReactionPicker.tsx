import React, { useRef, useEffect, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface ReactionConfig {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}

export const REACTIONS: ReactionConfig[] = [
  { type: 'like', emoji: '👍', label: 'Like', color: '#1877F2' },
  { type: 'love', emoji: '❤️', label: 'Love', color: '#F33E58' },
  { type: 'care', emoji: '🥰', label: 'Care', color: '#F7B125' },
  { type: 'haha', emoji: '😆', label: 'Haha', color: '#F7B125' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: '#F7B125' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: '#F7B125' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: '#E9573F' },
];

export interface ReactionPickerProps {
  visible: boolean;
  onSelect: (reaction: ReactionType) => void;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
}

const ReactionPickerComponent: React.FC<ReactionPickerProps> = ({
  visible,
  onSelect,
  onClose,
  anchorPosition,
}) => {
  const { colors, theme } = useTheme();
  const scaleAnims = useRef(REACTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      const animations = scaleAnims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          delay: i * 35,
          useNativeDriver: true,
        })
      );
      Animated.stagger(30, animations).start();
    } else {
      scaleAnims.forEach((anim) => anim.setValue(0));
    }
  }, [visible, scaleAnims]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radius.full,
                top: anchorPosition ? Math.max(anchorPosition.y - 65, 40) : '45%',
              },
            ]}
          >
            {REACTIONS.map((item, index) => {
              return (
                <Animated.View
                  key={item.type}
                  style={[
                    styles.reactionButton,
                    {
                      transform: [{ scale: scaleAnims[index] }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      onSelect(item.type);
                      onClose();
                    }}
                    style={styles.touchArea}
                  >
                    <Typography variant="h2" style={styles.emoji}>
                      {item.emoji}
                    </Typography>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const ReactionPicker = memo(ReactionPickerComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    position: 'absolute',
  },
  reactionButton: {
    paddingHorizontal: 4,
  },
  touchArea: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});
