import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Tabs, Skeleton } from '../../shared/components';
import { StoryBar, StoryUser } from './StoryBar';
import { PostCard } from './PostCard';
import { CommentsModal } from './CommentsModal';
import { RepostModal } from './RepostModal';
import { ShareSheetModal } from './ShareSheetModal';
import { useFeedStore, PostModel, FeedType } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';

export interface HomeScreenProps {
  onNavigateToStory: (storyUser: StoryUser, index: number) => void;
  onNavigateToCreatePost: () => void;
  onNavigateToChat: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToProfile: (userId?: string) => void;
  onMediaPress?: (url: string) => void;
}

const HomeScreenComponent: React.FC<HomeScreenProps> = ({
  onNavigateToStory,
  onNavigateToCreatePost,
  onNavigateToChat,
  onNavigateToNotifications,
  onNavigateToProfile,
  onMediaPress,
}) => {
  const { colors, theme } = useTheme();

  // Granular atomic selectors
  const user = useAuthStore((state) => state.user);
  const posts = useFeedStore((state) => state.posts);
  const activeFeedType = useFeedStore((state) => state.activeFeedType);
  const setActiveFeedType = useFeedStore((state) => state.setActiveFeedType);
  const isLoadingMore = useFeedStore((state) => state.isLoadingMore);
  const isRefreshing = useFeedStore((state) => state.isRefreshing);
  const fetchNextPage = useFeedStore((state) => state.fetchNextPage);
  const refreshFeed = useFeedStore((state) => state.refreshFeed);

  // Active interaction modals
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<PostModel | null>(null);
  const [repostPostTarget, setRepostPostTarget] = useState<PostModel | null>(null);

  // 6 Core Feed Types
  const feedTabs = useMemo(
    () => [
      { id: 'home', label: '🏠 For You' },
      { id: 'following', label: '👥 Following' },
      { id: 'friends', label: '🌟 Friends' },
      { id: 'trending', label: '🔥 Trending' },
      { id: 'local', label: '📍 Local' },
      { id: 'video', label: '🎬 Watch' },
    ],
    []
  );

  const onRefresh = useCallback(() => {
    refreshFeed();
  }, [refreshFeed]);

  const onEndReached = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handleCommentPress = useCallback((postId: string) => {
    setActiveCommentPostId(postId);
  }, []);

  const handleSharePress = useCallback((post: PostModel) => {
    setSharePost(post);
  }, []);

  const handleOpenRepostModal = useCallback((post: PostModel) => {
    setRepostPostTarget(post);
  }, []);

  const handleAuthorPress = useCallback(
    (authorId: string) => {
      onNavigateToProfile(authorId);
    },
    [onNavigateToProfile]
  );

  const renderPostItem = useCallback(
    ({ item }: ListRenderItemInfo<PostModel>) => {
      return (
        <PostCard
          post={item}
          onCommentPress={handleCommentPress}
          onSharePress={handleSharePress}
          onAuthorPress={handleAuthorPress}
          onMediaPress={onMediaPress}
        />
      );
    },
    [handleCommentPress, handleSharePress, handleAuthorPress, onMediaPress]
  );

  const keyExtractor = useCallback((item: PostModel) => item.id, []);

  const listHeader = useMemo(() => {
    return (
      <View>
        {/* Story Bar */}
        <StoryBar
          onStoryPress={onNavigateToStory}
          onAddStoryPress={onNavigateToCreatePost}
        />

        {/* Quick Post Prompt */}
        <View style={[styles.createPostCard, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigateToProfile(user?.id)}
          >
            <Avatar uri={user?.avatarUrl} name={user?.name} size="md" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToCreatePost}
            style={[styles.postInputPrompt, { backgroundColor: colors.inputBg, borderRadius: theme.radius.full }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Create post"
          >
            <Typography variant="body2" color={colors.textSecondary}>
              What's on your mind, {user?.name.split(' ')[0]}?
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNavigateToCreatePost}
            style={styles.mediaQuickBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add photo or video"
          >
            <Typography variant="h4">🖼️</Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [colors, theme, user, onNavigateToStory, onNavigateToCreatePost, onNavigateToProfile]);

  const listFooter = useMemo(() => {
    if (!isLoadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footerLoader}>
        <Skeleton height={140} borderRadius={12} style={{ marginBottom: 12 }} />
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Header */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <Typography variant="h2" color={colors.primary} bold style={styles.brandTitle}>
          SocialSphere
        </Typography>

        <View style={styles.headerActionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNavigateToNotifications}
            style={[styles.headerIconBtn, { backgroundColor: colors.surfaceElevated }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Typography variant="body1">🔔</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNavigateToChat}
            style={[styles.headerIconBtn, { backgroundColor: colors.surfaceElevated }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Direct messages"
          >
            <Typography variant="body1">💬</Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* 6-Feed Sub-tabs */}
      <View style={{ backgroundColor: colors.surface }}>
        <Tabs
          tabs={feedTabs}
          activeTab={activeFeedType}
          onTabChange={(tabId) => setActiveFeedType(tabId as FeedType)}
          scrollable
        />
      </View>

      {/* High-Performance Virtualized FlatList */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Hierarchical Comments Modal */}
      <CommentsModal
        visible={Boolean(activeCommentPostId)}
        postId={activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
      />

      {/* Share Sheet Modal */}
      <ShareSheetModal
        visible={Boolean(sharePost)}
        post={sharePost}
        onClose={() => setSharePost(null)}
        onRepostPress={() => {
          if (sharePost) handleOpenRepostModal(sharePost);
        }}
      />

      {/* Repost Modal */}
      <RepostModal
        visible={Boolean(repostPostTarget)}
        post={repostPostTarget}
        onClose={() => setRepostPostTarget(null)}
      />
    </View>
  );
};

export const HomeScreen = memo(HomeScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandTitle: {
    letterSpacing: -0.5,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  postInputPrompt: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  mediaQuickBtn: {
    padding: 6,
  },
  listContent: {
    paddingBottom: 80,
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
});
