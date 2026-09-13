import React, { useCallback, memo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';

export interface StoryUser {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isSeen?: boolean;
  stories: Array<{
    id: string;
    mediaUrl: string;
    type: 'image' | 'video';
    caption?: string;
    createdAt: string;
  }>;
}

export const MOCK_STORIES: StoryUser[] = [
  {
    id: 'story_usr_1',
    userId: 'usr_1',
    userName: 'Sarah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    isSeen: false,
    stories: [
      {
        id: 's_1',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        type: 'image',
        caption: 'Late night coding at the AI Lab 🔬✨',
        createdAt: '1h ago',
      },
    ],
  },
  {
    id: 'story_usr_2',
    userId: 'usr_2',
    userName: 'David',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isSeen: false,
    stories: [
      {
        id: 's_2',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        type: 'image',
        caption: 'CloudPulse 2.0 deployment success!',
        createdAt: '2h ago',
      },
    ],
  },
  {
    id: 'story_usr_3',
    userId: 'usr_3',
    userName: 'Elena',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    isSeen: true,
    stories: [
      {
        id: 's_3',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        type: 'image',
        caption: 'New design system tokens preview ✨',
        createdAt: '4h ago',
      },
    ],
  },
  {
    id: 'story_usr_4',
    userId: 'usr_4',
    userName: 'Marcus',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    isSeen: true,
    stories: [
      {
        id: 's_4',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        type: 'image',
        caption: 'Exploring Web3 security protocols 🛡️',
        createdAt: '6h ago',
      },
    ],
  },
];

const AnimatedStoryCircle = memo<{
  storyUser: StoryUser;
  index: number;
  onPress: (storyUser: StoryUser, index: number) => void;
  textColor: string;
}>(({ storyUser, index, onPress, textColor }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 10 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10 });
  }, [scale]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(storyUser, index)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.storyItem}
    >
      <Animated.View style={animatedStyle}>
        <Avatar
          uri={storyUser.userAvatar}
          name={storyUser.userName}
          size="lg"
          hasStory
          isStorySeen={storyUser.isSeen}
        />
      </Animated.View>
      <Typography
        variant="caption"
        color={textColor}
        numberOfLines={1}
        style={styles.userName}
      >
        {storyUser.userName}
      </Typography>
    </TouchableOpacity>
  );
});

export const StoryBar: React.FC<{
  onStoryPress: (storyUser: StoryUser, index: number) => void;
  onAddStoryPress?: () => void;
}> = ({ onStoryPress, onAddStoryPress }) => {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Current User Story Add */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAddStoryPress}
          style={styles.storyItem}
        >
          <View style={styles.addAvatarWrapper}>
            <Avatar uri={user?.avatarUrl} size="lg" />
            <View
              style={[
                styles.addBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.surface,
                },
              ]}
            >
              <Typography variant="body1" color="#FFFFFF" bold style={styles.plusIcon}>
                +
              </Typography>
            </View>
          </View>
          <Typography
            variant="caption"
            color={colors.text}
            numberOfLines={1}
            style={styles.userName}
          >
            Your Story
          </Typography>
        </TouchableOpacity>

        {/* Friends Stories */}
        {MOCK_STORIES.map((storyUser, index) => (
          <AnimatedStoryCircle
            key={storyUser.id}
            storyUser={storyUser}
            index={index}
            onPress={onStoryPress}
            textColor={colors.text}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  scrollList: {
    paddingHorizontal: 12,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
  },
  addAvatarWrapper: {
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 14,
    lineHeight: 16,
    marginTop: -1,
  },
  userName: {
    marginTop: 6,
    textAlign: 'center',
  },
});
