import React, { useState, useCallback, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Share,
  SafeAreaView,
} from 'react-native';
import { Typography, Avatar, VideoPlayer } from '../../shared/components';
import { useTheme } from '../../theme/ThemeContext';
import { useToast } from '../../shared/components/molecules/Toast';
import { useReelsStore, ReelModel } from '../../store/useReelsStore';
import { ReelCommentsModal } from './ReelCommentsModal';
import { ReelRemixModal } from './ReelRemixModal';
import { CreateReelScreen } from './CreateReelScreen';
import { ReelsVideoPlayer } from './ReelsVideoPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const REEL_HEIGHT = SCREEN_HEIGHT - 65;

export interface ReelsScreenProps {
  onNavigateToProfile?: (userId: string) => void;
  onProfilePress?: (userId?: string) => void;
  onNavigateToAudio?: (audioTitle: string) => void;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export const ReelsScreenComponent: React.FC<ReelsScreenProps> = ({
  onNavigateToProfile,
  onProfilePress,
  onNavigateToAudio,
}) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { reels, likeReel, saveReel, shareReel, toggleFollowCreator } = useReelsStore();

  const handleProfileNav = onNavigateToProfile || onProfilePress;

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [commentReelId, setCommentReelId] = useState<string | null>(null);
  const [remixReelTarget, setRemixReelTarget] = useState<ReelModel | null>(null);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);

  // Viewability config for Auto-play & Smart Preload
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        const newIndex = viewableItems[0].index;
        setActiveReelIndex(newIndex);

        // Smart Preload adjacent video thumbnail
        const nextReel = reels[newIndex + 1];
        if (nextReel?.videoThumbnail) {
          Image.prefetch(nextReel.videoThumbnail).catch(() => {});
        }
      }
    }
  ).current;

  const handleDoubleTapLike = useCallback(
    (reelId: string) => {
      likeReel(reelId);
      showToast({ message: '❤️ Liked reel!', type: 'info' });
    },
    [likeReel, showToast]
  );

  const handleShare = useCallback(
    async (reel: ReelModel) => {
      shareReel(reel.id);
      try {
        await Share.share({
          message: `Watch this reel by @${reel.creatorName} on SocialSphere: https://socialsphere.io/reel/${reel.id}`,
          title: reel.description,
        });
      } catch {
        // Ignored
      }
    },
    [shareReel]
  );

  const keyExtractor = useCallback((item: ReelModel) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: REEL_HEIGHT,
      offset: REEL_HEIGHT * index,
      index,
    }),
    []
  );

  const renderReelItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ReelModel>) => {
      const isCurrentActive = index === activeReelIndex;

      return (
        <View style={styles.reelContainer}>
          {/* Main Full-Screen Adaptive Reels Video Background */}
          <ReelsVideoPlayer
            videoUrl={item.videoUrl}
            thumbnailUrl={item.videoThumbnail}
            isActive={isCurrentActive}
            onDoubleTapLike={() => handleDoubleTapLike(item.id)}
          />

          {/* Overlay Filter Tag */}
          {item.filter && item.filter !== 'normal' && (
            <View style={styles.filterPill}>
              <Typography variant="caption" color="#FFFFFF" bold>
                🎨 {item.filter.toUpperCase()}
              </Typography>
            </View>
          )}

          {/* Subtitles / Captions Overlay */}
          {item.captions && item.captions.length > 0 && (
            <View style={styles.captionsContainer}>
              <Typography variant="subtitle2" color="#FFFFFF" bold style={styles.captionSubText}>
                💬 {item.captions[0].text}
              </Typography>
            </View>
          )}

          {/* Bottom Left Creator & Sound Info */}
          <View style={styles.bottomInfoOverlay}>
            <View style={styles.creatorRow}>
              <TouchableOpacity
                onPress={() => handleProfileNav?.(item.creatorId)}
                style={styles.creatorProfileBtn}
              >
                <Avatar uri={item.creatorAvatar} name={item.creatorName} size="md" />
                <Typography variant="subtitle1" color="#FFFFFF" bold style={{ marginLeft: 8 }}>
                  @{item.creatorName}
                </Typography>
                {item.isVerified && (
                  <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
                    ☑️
                  </Typography>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleFollowCreator(item.creatorId)}
                style={[
                  styles.followBtn,
                  item.isFollowing ? styles.followingBtn : styles.unfollowingBtn,
                ]}
              >
                <Typography
                  variant="caption"
                  color={item.isFollowing ? '#FFFFFF' : '#000000'}
                  bold
                >
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Typography variant="body2" color="#FFFFFF" numberOfLines={2} style={styles.descriptionText}>
              {item.description}
            </Typography>

            {/* Audio Track Ticker */}
            <TouchableOpacity
              onPress={() => onNavigateToAudio?.(item.songTitle)}
              style={styles.audioTickerRow}
            >
              <Typography variant="caption" color="#FFFFFF">
                🎵
              </Typography>
              <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1} style={{ flex: 1, marginLeft: 6 }}>
                {item.songTitle} • {item.songArtist}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Right Side Vertical Action Buttons */}
          <View style={styles.rightActionsColumn}>
            {/* Like */}
            <TouchableOpacity
              onPress={() => likeReel(item.id)}
              style={styles.actionBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Like reel"
            >
              <Typography variant="h2" color={item.isLiked ? '#FF2D55' : '#FFFFFF'}>
                {item.isLiked ? '❤️' : '🤍'}
              </Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                {formatCount(item.likesCount)}
              </Typography>
            </TouchableOpacity>

            {/* Comments */}
            <TouchableOpacity
              onPress={() => setCommentReelId(item.id)}
              style={styles.actionBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View comments"
            >
              <Typography variant="h2">💬</Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                {formatCount(item.commentsCount)}
              </Typography>
            </TouchableOpacity>

            {/* Remix / Duet */}
            <TouchableOpacity
              onPress={() => setRemixReelTarget(item)}
              style={styles.actionBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Remix reel"
            >
              <Typography variant="h2">🔁</Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                Remix
              </Typography>
            </TouchableOpacity>

            {/* Bookmark / Save */}
            <TouchableOpacity
              onPress={() => saveReel(item.id)}
              style={styles.actionBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Save reel"
            >
              <Typography variant="h2">
                {item.isSaved ? '🔖' : '📑'}
              </Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                {item.isSaved ? 'Saved' : 'Save'}
              </Typography>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              onPress={() => handleShare(item)}
              style={styles.actionBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Share reel"
            >
              <Typography variant="h2">📤</Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                {formatCount(item.sharesCount)}
              </Typography>
            </TouchableOpacity>

            {/* Spinning Audio Album Cover */}
            <TouchableOpacity
              onPress={() => onNavigateToAudio?.(item.songTitle)}
              style={styles.discWrapper}
            >
              <Image source={{ uri: item.songCoverUrl }} style={styles.discImg} />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [activeReelIndex, handleDoubleTapLike, handleProfileNav, toggleFollowCreator, onNavigateToAudio, likeReel, saveReel, handleShare]
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Floating App Header with Create Button */}
      <View style={styles.floatingHeader}>
        <Typography variant="h3" color="#FFFFFF" bold>
          Reels
        </Typography>

        <TouchableOpacity
          onPress={() => setIsCreateReelOpen(true)}
          style={styles.createReelBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Create reel"
        >
          <Typography variant="subtitle2" color="#FFFFFF" bold>
            📷 Create
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Vertical Paging Snapping List */}
      <FlatList
        data={reels}
        renderItem={renderReelItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        pagingEnabled
        snapToInterval={REEL_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Reel Comments Modal */}
      <ReelCommentsModal
        visible={Boolean(commentReelId)}
        reelId={commentReelId}
        onClose={() => setCommentReelId(null)}
      />

      {/* Reel Remix / Duet Modal */}
      <ReelRemixModal
        visible={Boolean(remixReelTarget)}
        reel={remixReelTarget}
        onClose={() => setRemixReelTarget(null)}
      />

      {/* Create Reel Studio Screen */}
      {isCreateReelOpen && (
        <CreateReelScreen onClose={() => setIsCreateReelOpen(false)} />
      )}
    </SafeAreaView>
  );
};

export const ReelsScreen = memo(ReelsScreenComponent);

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  floatingHeader: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createReelBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: REEL_HEIGHT,
    position: 'relative',
    backgroundColor: '#000000',
  },
  thumbnailBackground: {
    ...StyleSheet.absoluteFill,
  },
  doubleTapZone: {
    ...StyleSheet.absoluteFill,
  },
  filterPill: {
    position: 'absolute',
    top: 80,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  captionsContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  captionSubText: {
    textAlign: 'center',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 84,
    zIndex: 10,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  unfollowingBtn: {
    backgroundColor: '#FFFFFF',
  },
  followingBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  descriptionText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  audioTickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  rightActionsColumn: {
    position: 'absolute',
    bottom: 30,
    right: 12,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 2,
  },
  discWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 4,
  },
  discImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
