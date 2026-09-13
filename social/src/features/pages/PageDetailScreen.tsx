import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button, SegmentedControl } from '../../shared/components';
import { usePageStore, PageModel } from '../../store/usePageStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { PageAnalyticsScreen } from './PageAnalyticsScreen';

export interface PageDetailScreenProps {
  pageId: string;
  onBack: () => void;
}

const DETAIL_TABS = [
  { id: 'posts', label: 'Posts 📝' },
  { id: 'about', label: 'About & Contact ℹ️' },
];

const PageDetailScreenComponent: React.FC<PageDetailScreenProps> = ({
  pageId,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const page = usePageStore((state) => state.pages.find((p) => p.id === pageId));
  const toggleFollow = usePageStore((state) => state.toggleFollowPage);
  const createPagePost = usePageStore((state) => state.createPagePost);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('posts');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const isRTL = I18nManager.isRTL;

  if (!page) return null;

  if (isAnalyticsOpen) {
    return <PageAnalyticsScreen pageId={pageId} onBack={() => setIsAnalyticsOpen(false)} />;
  }

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    createPagePost(pageId, newPostText.trim());
    setNewPostText('');
    showToast({ message: 'Update published to page followers! 🚀', type: 'success' });
  };

  const getPageTypePill = (type: string) => {
    switch (type) {
      case 'business':
        return '💼 Business Page';
      case 'creator':
        return '🎨 Creator Page';
      case 'organization':
        return '🏛️ Organization';
      default:
        return '💼 Page';
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cover Banner */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: page.coverUrl }} style={styles.coverImage} resizeMode="cover" />
        <TouchableOpacity onPress={onBack} style={styles.floatingBackBtn}>
          <Typography variant="h3" color="#FFFFFF">
            {isRTL ? '➡️' : '⬅️'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Page Profile Header */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={page.avatarUrl} name={page.name} size="lg" />
          </View>
          <View style={styles.headerInfoCol}>
            <View style={styles.titleRow}>
              <Typography variant="h2" color={colors.text} bold numberOfLines={1}>
                {page.name}
              </Typography>
              {page.isVerified && (
                <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
                  ☑️
                </Typography>
              )}
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              @{page.username} • {formatFollowers(page.followersCount)} followers
            </Typography>
            <View style={styles.typePillRow}>
              <View style={[styles.typePill, { backgroundColor: colors.surfaceElevated }]}>
                <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 10 }}>
                  {getPageTypePill(page.pageType)}
                </Typography>
              </View>
              <Typography variant="caption" color={colors.textMuted} style={{ marginLeft: 6 }}>
                {page.category}
              </Typography>
            </View>
          </View>
        </View>

        <Typography variant="body2" color={colors.textSecondary} style={styles.descriptionText}>
          {page.description}
        </Typography>

        {/* Action Button Row */}
        <View style={styles.actionBtnRow}>
          <Button
            label={page.isFollowing ? 'Following ✓' : '+ Follow Page'}
            variant={page.isFollowing ? 'ghost' : 'primary'}
            size="md"
            onPress={() => {
              toggleFollow(page.id);
              showToast({ message: page.isFollowing ? 'Unfollowed' : 'Following page!', type: 'info' });
            }}
            style={{ flex: 1 }}
          />

          {page.userRole === 'admin' || page.userRole === 'owner' ? (
            <Button
              label="📊 Analytics"
              variant="primary"
              size="md"
              onPress={() => setIsAnalyticsOpen(true)}
              style={{ flex: 1 }}
            />
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabSection}>
        <SegmentedControl
          segments={DETAIL_TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
          size="sm"
        />
      </View>

      {/* Tab: Posts */}
      {activeTab === 'posts' && (
        <View style={styles.postsSection}>
          {/* Create Post (for Page Admin/Owner) */}
          {(page.userRole === 'admin' || page.userRole === 'owner') && (
            <View style={[styles.createPostCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
              <View style={styles.createPostInputRow}>
                <Avatar uri={page.avatarUrl} name={page.name} size="sm" />
                <TextInput
                  style={[styles.createPostInput, { color: colors.text }]}
                  placeholder={`Publish a post as ${page.name}...`}
                  placeholderTextColor={colors.textMuted}
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                />
              </View>
              {newPostText.trim().length > 0 && (
                <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                  <Button label="Publish" variant="primary" size="sm" onPress={handleCreatePost} />
                </View>
              )}
            </View>
          )}

          {/* Posts List */}
          {page.posts.map((post) => (
            <View
              key={post.id}
              style={[styles.postCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
            >
              <View style={styles.postAuthorRow}>
                <Avatar uri={post.authorAvatar} name={post.authorName} size="sm" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {post.authorName}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {post.createdAt}
                  </Typography>
                </View>
              </View>

              <Typography variant="body2" color={colors.text} style={styles.postContentText}>
                {post.content}
              </Typography>

              {post.mediaUrl && (
                <Image source={{ uri: post.mediaUrl }} style={[styles.postMediaImage, { borderRadius: theme.radius.md }]} resizeMode="cover" />
              )}

              <View style={styles.postStatsRow}>
                <Typography variant="caption" color={colors.textSecondary}>
                  ❤️ {post.likesCount}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 16 }}>
                  💬 {post.commentsCount}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 16 }}>
                  🔄 {post.sharesCount}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tab: About & Contact */}
      {activeTab === 'about' && (
        <View style={styles.aboutSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
              Contact & Business Details
            </Typography>

            {page.website && (
              <View style={styles.infoRow}>
                <Typography variant="body1">🌐</Typography>
                <Typography variant="body2" color={colors.primary} bold style={{ marginLeft: 10 }}>
                  {page.website}
                </Typography>
              </View>
            )}

            {page.email && (
              <View style={styles.infoRow}>
                <Typography variant="body1">✉️</Typography>
                <Typography variant="body2" color={colors.text} style={{ marginLeft: 10 }}>
                  {page.email}
                </Typography>
              </View>
            )}

            {page.address && (
              <View style={styles.infoRow}>
                <Typography variant="body1">📍</Typography>
                <Typography variant="body2" color={colors.text} style={{ marginLeft: 10 }}>
                  {page.address}
                </Typography>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export const PageDetailScreen = memo(PageDetailScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  headerCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 30,
  },
  headerInfoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  descriptionText: {
    marginTop: 12,
    lineHeight: 20,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postsSection: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  createPostCard: {
    padding: 14,
  },
  createPostInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  createPostInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
  },
  postCard: {
    padding: 14,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postContentText: {
    lineHeight: 20,
    marginBottom: 8,
  },
  postMediaImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  postStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutSection: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
