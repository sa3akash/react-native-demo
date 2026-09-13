import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Avatar,
  Card,
  MentionHashtagText,
  ReactionPicker,
  ReactionType,
  REACTIONS,
  VideoPlayerStub,
} from '../../shared/components';
import { PostModel, useFeedStore } from '../../store/useFeedStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface PostCardProps {
  post: PostModel;
  onCommentPress: (postId: string) => void;
  onSharePress: (post: PostModel) => void;
  onAuthorPress?: (authorId: string) => void;
  onMediaPress?: (mediaUrl: string) => void;
}

const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  onCommentPress,
  onSharePress,
  onAuthorPress,
  onMediaPress,
}) => {
  const { colors, theme } = useTheme();

  // Granular store action selectors (stable references)
  const reactToPost = useFeedStore((state) => state.reactToPost);
  const toggleBookmark = useFeedStore((state) => state.toggleBookmark);
  const votePoll = useFeedStore((state) => state.votePoll);

  const [pickerVisible, setPickerVisible] = useState(false);

  // React Native Reanimated Shared Values for Fluid Physics Interactions
  const likeScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  const bookmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bookmarkScale.value }],
    };
  });

  const totalReactions = useMemo(() => {
    return Object.values(post.reactionsCount).reduce((a, b) => a + b, 0);
  }, [post.reactionsCount]);

  const currentReactionConfig = useMemo(() => {
    return REACTIONS.find((r) => r.type === post.userReaction);
  }, [post.userReaction]);

  const triggerLikeSpring = useCallback(() => {
    likeScale.value = withSequence(
      withTiming(0.75, { duration: 80 }),
      withSpring(1.35, { damping: 4, stiffness: 220 }),
      withSpring(1, { damping: 6, stiffness: 120 })
    );
  }, [likeScale]);

  const triggerBookmarkSpring = useCallback(() => {
    bookmarkScale.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 6, stiffness: 120 })
    );
  }, [bookmarkScale]);

  const handleLikePress = useCallback(() => {
    triggerLikeSpring();
    reactToPost(post.id, post.userReaction ? post.userReaction : 'like');
  }, [triggerLikeSpring, reactToPost, post.id, post.userReaction]);

  const handleReactionSelect = useCallback(
    (reaction: ReactionType) => {
      triggerLikeSpring();
      reactToPost(post.id, reaction);
      setPickerVisible(false);
    },
    [triggerLikeSpring, reactToPost, post.id]
  );

  const handleBookmarkPress = useCallback(() => {
    triggerBookmarkSpring();
    toggleBookmark(post.id);
  }, [triggerBookmarkSpring, toggleBookmark, post.id]);

  const handleCommentPress = useCallback(() => {
    onCommentPress(post.id);
  }, [onCommentPress, post.id]);

  const handleSharePress = useCallback(() => {
    onSharePress(post);
  }, [onSharePress, post]);

  return (
    <Card variant="flat" padding={0} style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAuthorPress?.(post.authorId)}
          style={styles.authorInfoRow}
        >
          <Avatar uri={post.authorAvatar} name={post.authorName} size="md" />
          <View style={styles.authorTextCol}>
            <View style={styles.nameRow}>
              <Typography variant="subtitle1" color={colors.text} bold>
                {post.authorName}
              </Typography>
              {post.isVerified && (
                <Typography variant="caption" color={colors.primary} style={styles.verifiedBadge}>
                  ✓
                </Typography>
              )}
            </View>
            {post.authorHeadline && (
              <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
                {post.authorHeadline}
              </Typography>
            )}
            <View style={styles.metaRow}>
              <Typography variant="caption" color={colors.textMuted}>
                {post.createdAt}
              </Typography>
              <Typography variant="caption" color={colors.textMuted} style={styles.bullet}>
                •
              </Typography>
              <Typography variant="caption" color={colors.textMuted}>
                {post.privacy === 'public' ? '🌍 Public' : '👥 Friends'}
              </Typography>
              {post.location && (
                <>
                  <Typography variant="caption" color={colors.textMuted} style={styles.bullet}>
                    •
                  </Typography>
                  <Typography variant="caption" color={colors.textMuted} numberOfLines={1}>
                    📍 {post.location}
                  </Typography>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSharePress}
          style={styles.moreBtn}
        >
          <Typography variant="body1" color={colors.textSecondary} bold>
            •••
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentBody}>
        <MentionHashtagText content={post.content} />
      </View>

      {/* Poll Component */}
      {post.poll && (
        <View style={[styles.pollContainer, { backgroundColor: colors.inputBg, borderRadius: theme.radius.md }]}>
          <Typography variant="subtitle2" color={colors.text} bold style={styles.pollQuestion}>
            {post.poll.question}
          </Typography>
          {post.poll.options.map((opt) => {
            const pct = post.poll!.totalVotes > 0 ? Math.round((opt.votes / post.poll!.totalVotes) * 100) : 0;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => votePoll(post.id, opt.id)}
                style={[
                  styles.pollOption,
                  {
                    borderColor: opt.userVoted ? colors.primary : colors.border,
                    backgroundColor: colors.surface,
                    borderRadius: theme.radius.sm,
                  },
                ]}
              >
                <View
                  style={[
                    styles.pollBarFill,
                    {
                      width: `${pct}%`,
                      backgroundColor: opt.userVoted ? colors.primaryLight : colors.surfaceElevated,
                    },
                  ]}
                />
                <View style={styles.pollOptionContent}>
                  <Typography
                    variant="body2"
                    color={opt.userVoted ? colors.primary : colors.text}
                    bold={opt.userVoted}
                  >
                    {opt.text} {opt.userVoted ? '✓' : ''}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} bold>
                    {pct}%
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
          <Typography variant="caption" color={colors.textMuted} style={styles.pollFooter}>
            {post.poll.totalVotes} total votes
          </Typography>
        </View>
      )}

      {/* Video Player */}
      {post.videoUrl && (
        <View style={styles.mediaContainer}>
          <VideoPlayerStub
            videoUrl={post.videoUrl}
            thumbnailUrl={post.mediaUrls?.[0]}
            duration={post.videoDuration}
          />
        </View>
      )}

      {/* Media Images Gallery */}
      {!post.videoUrl && post.mediaUrls && post.mediaUrls.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.mediaUrls.length === 1 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onMediaPress?.(post.mediaUrls![0])}
            >
              <Image source={{ uri: post.mediaUrls[0] }} style={styles.singleImage} resizeMode="cover" />
            </TouchableOpacity>
          ) : (
            <View style={styles.multiImageGrid}>
              {post.mediaUrls.slice(0, 2).map((uri, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.9}
                  onPress={() => onMediaPress?.(uri)}
                  style={styles.gridHalf}
                >
                  <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Stats Summary Bar */}
      <View style={[styles.statsRow, { borderBottomColor: colors.divider }]}>
        <View style={styles.reactionsSummary}>
          <Typography variant="caption" style={styles.topReactionEmojis}>
            👍❤️🥰
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {totalReactions}
          </Typography>
        </View>
        <View style={styles.rightStats}>
          <Typography variant="caption" color={colors.textSecondary}>
            {post.commentsCount} comments
          </Typography>
          <Typography variant="caption" color={colors.textMuted} style={styles.bullet}>
            •
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {post.sharesCount} shares
          </Typography>
        </View>
      </View>

      {/* Action Buttons Bar */}
      <View style={styles.actionsBar}>
        {/* Reaction Trigger with Reanimated Spring */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLikePress}
          onLongPress={() => setPickerVisible(true)}
          style={styles.actionBtn}
        >
          <Animated.View style={[styles.actionEmojiContainer, likeAnimatedStyle]}>
            <Typography variant="body1" style={styles.actionEmoji}>
              {currentReactionConfig ? currentReactionConfig.emoji : '👍'}
            </Typography>
          </Animated.View>
          <Typography
            variant="buttonSmall"
            color={currentReactionConfig ? currentReactionConfig.color : colors.textSecondary}
            bold={Boolean(currentReactionConfig)}
          >
            {currentReactionConfig ? currentReactionConfig.label : 'Like'}
          </Typography>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCommentPress}
          style={styles.actionBtn}
        >
          <Typography variant="body1" style={styles.actionEmoji}>
            💬
          </Typography>
          <Typography variant="buttonSmall" color={colors.textSecondary}>
            Comment
          </Typography>
        </TouchableOpacity>

        {/* Repost / Share */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSharePress}
          style={styles.actionBtn}
        >
          <Typography variant="body1" style={styles.actionEmoji}>
            🔄
          </Typography>
          <Typography variant="buttonSmall" color={colors.textSecondary}>
            Repost
          </Typography>
        </TouchableOpacity>

        {/* Bookmark with Reanimated Spring */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBookmarkPress}
          style={styles.actionBtn}
        >
          <Animated.View style={[styles.actionEmojiContainer, bookmarkAnimatedStyle]}>
            <Typography variant="body1" style={styles.actionEmoji}>
              {post.isBookmarked ? '🔖' : '📑'}
            </Typography>
          </Animated.View>
          <Typography
            variant="buttonSmall"
            color={post.isBookmarked ? colors.primary : colors.textSecondary}
            bold={post.isBookmarked}
          >
            {post.isBookmarked ? 'Saved' : 'Save'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* 7-Reaction Picker Modal */}
      <ReactionPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleReactionSelect}
      />
    </Card>
  );
};

export const PostCard = React.memo(PostCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.userReaction === nextProps.post.userReaction &&
    prevProps.post.isBookmarked === nextProps.post.isBookmarked &&
    prevProps.post.commentsCount === nextProps.post.commentsCount &&
    prevProps.post.sharesCount === nextProps.post.sharesCount &&
    prevProps.post.poll?.totalVotes === nextProps.post.poll?.totalVotes &&
    prevProps.post.reactionsCount === nextProps.post.reactionsCount
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  authorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    marginLeft: 4,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bullet: {
    marginHorizontal: 4,
  },
  moreBtn: {
    padding: 6,
  },
  contentBody: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  pollContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
  },
  pollQuestion: {
    marginBottom: 10,
  },
  pollOption: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 4,
    overflow: 'hidden',
  },
  pollBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 2,
  },
  pollFooter: {
    marginTop: 6,
    textAlign: 'right',
  },
  mediaContainer: {
    marginTop: 8,
    width: '100%',
  },
  singleImage: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  multiImageGrid: {
    flexDirection: 'row',
    height: 220,
    gap: 2,
  },
  gridHalf: {
    flex: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reactionsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topReactionEmojis: {
    marginRight: 6,
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionEmojiContainer: {
    marginRight: 6,
  },
  actionEmoji: {
    fontSize: 16,
  },
});
