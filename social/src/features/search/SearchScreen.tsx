import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, SearchBar, SegmentedControl, Button } from '../../shared/components';
import {
  useSearchStore,
  SearchCategory,
  AnySearchResult,
  UserSearchResult,
  PostSearchResult,
  VideoSearchResult,
  ReelSearchResult,
  GroupSearchResult,
  PageSearchResult,
  EventSearchResult,
} from '../../store/useSearchStore';
import { SearchFiltersModal } from './SearchFiltersModal';

export interface SearchScreenProps {
  onNavigateToProfile?: (userId: string) => void;
  onNavigateToPost?: (postId: string) => void;
  onNavigateToGroup?: (groupId: string) => void;
  onSelectUser?: (userId?: string) => void;
  onSelectGroup?: (groupId?: string) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All 🔍' },
  { id: 'users', label: '👤 People' },
  { id: 'posts', label: '📝 Posts' },
  { id: 'videos', label: '🎥 Videos' },
  { id: 'reels', label: '⚡ Reels' },
  { id: 'groups', label: '👥 Groups' },
  { id: 'pages', label: '🏢 Pages' },
  { id: 'events', label: '📅 Events' },
];

export const SearchScreenComponent: React.FC<SearchScreenProps> = ({
  onNavigateToProfile,
  onNavigateToPost,
  onNavigateToGroup,
}) => {
  const { colors, theme } = useTheme();
  const {
    query,
    selectedCategory,
    searchHistory,
    trendingSuggestions,
    setQuery,
    setSelectedCategory,
    addHistory,
    removeHistory,
    clearHistory,
    toggleFollowUser,
    toggleJoinGroup,
    toggleFollowPage,
    toggleAttendEvent,
    getFilteredResults,
  } = useSearchStore();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isRTL = I18nManager.isRTL;

  const results = getFilteredResults();
  const hasQuery = query.trim().length > 0;

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addHistory(query.trim());
    }
  };

  const renderUserItem = (item: UserSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNavigateToProfile?.(item.id)}
      style={[styles.resultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <Avatar uri={item.avatarUrl} name={item.name} size="md" />
      <View style={styles.cardContentCol}>
        <View style={styles.cardHeaderRow}>
          <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
            {item.name}
          </Typography>
          {item.isVerified && (
            <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
              ☑️
            </Typography>
          )}
        </View>
        <Typography variant="caption" color={colors.textSecondary}>
          @{item.username} • {(item.followersCount / 1000).toFixed(1)}k followers
        </Typography>
        <Typography variant="caption" color={colors.text} numberOfLines={1} style={{ marginTop: 2 }}>
          {item.bio}
        </Typography>
      </View>
      <TouchableOpacity
        onPress={() => toggleFollowUser(item.id)}
        style={[
          styles.actionPillBtn,
          {
            backgroundColor: item.isFollowing ? colors.surfaceElevated : colors.primary,
            borderColor: item.isFollowing ? colors.borderSubtle : colors.primary,
          },
        ]}
      >
        <Typography variant="caption" color={item.isFollowing ? colors.text : '#FFFFFF'} bold>
          {item.isFollowing ? 'Following' : '+ Follow'}
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPostItem = (item: PostSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNavigateToPost?.(item.id)}
      style={[styles.postResultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <View style={styles.postHeaderRow}>
        <Avatar uri={item.authorAvatar} name={item.authorName} size="sm" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Typography variant="subtitle2" color={colors.text} bold>
            {item.authorName}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            @{item.authorUsername} • {item.createdAt}
          </Typography>
        </View>
      </View>
      <Typography variant="body2" color={colors.text} numberOfLines={3} style={styles.postBodyText}>
        {item.content}
      </Typography>
      {item.mediaUrl && (
        <Image source={{ uri: item.mediaUrl }} style={[styles.postMediaImage, { borderRadius: theme.radius.md }]} resizeMode="cover" />
      )}
      <View style={styles.postStatsRow}>
        <Typography variant="caption" color={colors.textSecondary}>
          ❤️ {item.likesCount}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 16 }}>
          💬 {item.commentsCount}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderVideoItem = (item: VideoSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.videoResultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <View style={styles.videoThumbContainer}>
        <Image source={{ uri: item.thumbnailUrl }} style={[styles.videoThumbnail, { borderRadius: theme.radius.md }]} resizeMode="cover" />
        <View style={styles.durationBadge}>
          <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 10 }}>
            {item.duration}
          </Typography>
        </View>
      </View>
      <View style={styles.cardContentCol}>
        <Typography variant="subtitle2" color={colors.text} bold numberOfLines={2}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          {item.channelName} • {(item.viewsCount / 1000).toFixed(1)}k views
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderReelItem = (item: ReelSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.reelResultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={[styles.reelThumbnail, { borderRadius: theme.radius.md }]} resizeMode="cover" />
      <View style={styles.cardContentCol}>
        <Typography variant="subtitle2" color={colors.text} bold numberOfLines={2}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={colors.primary} style={{ marginTop: 2 }}>
          🎵 {item.songTitle}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
          By @{item.creatorName} • ❤️ {(item.likesCount / 1000).toFixed(1)}k
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderGroupItem = (item: GroupSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNavigateToGroup?.(item.id)}
      style={[styles.resultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <Avatar uri={item.avatarUrl} name={item.title} size="md" />
      <View style={styles.cardContentCol}>
        <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary}>
          {item.category} • {(item.membersCount / 1000).toFixed(1)}k members • {item.privacy}
        </Typography>
      </View>
      <TouchableOpacity
        onPress={() => toggleJoinGroup(item.id)}
        style={[
          styles.actionPillBtn,
          {
            backgroundColor: item.isJoined ? colors.surfaceElevated : colors.primary,
            borderColor: item.isJoined ? colors.borderSubtle : colors.primary,
          },
        ]}
      >
        <Typography variant="caption" color={item.isJoined ? colors.text : '#FFFFFF'} bold>
          {item.isJoined ? 'Joined' : '+ Join'}
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPageItem = (item: PageSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.resultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <Avatar uri={item.avatarUrl} name={item.title} size="md" />
      <View style={styles.cardContentCol}>
        <View style={styles.cardHeaderRow}>
          <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
            {item.title}
          </Typography>
          {item.isVerified && (
            <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
              ☑️
            </Typography>
          )}
        </View>
        <Typography variant="caption" color={colors.textSecondary}>
          {item.category} • {(item.followersCount / 1000000).toFixed(1)}M followers
        </Typography>
      </View>
      <TouchableOpacity
        onPress={() => toggleFollowPage(item.id)}
        style={[
          styles.actionPillBtn,
          {
            backgroundColor: item.isFollowing ? colors.surfaceElevated : colors.primary,
            borderColor: item.isFollowing ? colors.borderSubtle : colors.primary,
          },
        ]}
      >
        <Typography variant="caption" color={item.isFollowing ? colors.text : '#FFFFFF'} bold>
          {item.isFollowing ? 'Following' : '+ Follow'}
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEventItem = (item: EventSearchResult) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.resultCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
    >
      <Image source={{ uri: item.coverUrl }} style={[styles.eventThumb, { borderRadius: theme.radius.sm }]} resizeMode="cover" />
      <View style={styles.cardContentCol}>
        <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={colors.primary} bold>
          📅 {item.date}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
          📍 {item.location} • {item.attendeesCount} attending
        </Typography>
      </View>
      <TouchableOpacity
        onPress={() => toggleAttendEvent(item.id)}
        style={[
          styles.actionPillBtn,
          {
            backgroundColor: item.isAttending ? colors.primaryLight : colors.primary,
            borderColor: colors.primary,
          },
        ]}
      >
        <Typography variant="caption" color={item.isAttending ? colors.primary : '#FFFFFF'} bold>
          {item.isAttending ? 'Attending' : '+ RSVP'}
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderResultItem = ({ item }: { item: AnySearchResult }) => {
    switch (item.type) {
      case 'user':
        return renderUserItem(item as UserSearchResult);
      case 'post':
        return renderPostItem(item as PostSearchResult);
      case 'video':
        return renderVideoItem(item as VideoSearchResult);
      case 'reel':
        return renderReelItem(item as ReelSearchResult);
      case 'group':
        return renderGroupItem(item as GroupSearchResult);
      case 'page':
        return renderPageItem(item as PageSearchResult);
      case 'event':
        return renderEventItem(item as EventSearchResult);
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Search Bar & Filter Button */}
      <View style={styles.topSearchSection}>
        <View style={styles.searchBarRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search people, posts, videos, reels..."
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsFilterModalOpen(true)}
            style={[styles.filterIconBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Open search filters"
          >
            <Typography variant="body1">⚙️</Typography>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={CATEGORY_TABS}
            activeId={selectedCategory}
            onSelect={(id) => setSelectedCategory(id as SearchCategory)}
            size="sm"
          />
        </View>
      </View>

      {/* Main Content Area */}
      {!hasQuery && searchHistory.length > 0 ? (
        // Search History & Trending Suggestions View
        <ScrollView contentContainerStyle={styles.historySection}>
          <View style={styles.historyHeader}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Recent Searches
            </Typography>
            <TouchableOpacity onPress={clearHistory}>
              <Typography variant="caption" color={colors.primary} bold>
                Clear all
              </Typography>
            </TouchableOpacity>
          </View>

          {searchHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setQuery(item.query)}
              style={[styles.historyRow, { borderBottomColor: colors.borderSubtle }]}
            >
              <Typography variant="body2" color={colors.textMuted}>
                🕒
              </Typography>
              <Typography variant="body2" color={colors.text} style={{ flex: 1, marginHorizontal: 10 }}>
                {item.query}
              </Typography>
              <TouchableOpacity onPress={() => removeHistory(item.id)} style={styles.removeHistoryBtn}>
                <Typography variant="caption" color={colors.textMuted}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Trending Suggestions */}
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 24, marginBottom: 8 }}>
            🔥 Trending Topics & Creators
          </Typography>
          <View style={styles.trendingWrap}>
            {trendingSuggestions.map((tag) => (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.8}
                onPress={() => setQuery(tag)}
                style={[styles.trendingTag, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}
              >
                <Typography variant="caption" color={colors.primary} bold>
                  {tag}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Results FlatList
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResultItem}
          contentContainerStyle={styles.resultsListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="h1" style={{ marginBottom: 12 }}>
                🔍
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                No Results for "{query}"
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4, textAlign: 'center' }}>
                Try searching for different keywords, hashtags, or reset your filters.
              </Typography>
            </View>
          }
        />
      )}

      {/* Search Filters Modal */}
      <SearchFiltersModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </View>
  );
};

export const SearchScreen = memo(SearchScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSearchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  historySection: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  removeHistoryBtn: {
    padding: 6,
  },
  trendingWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  resultsListContent: {
    paddingBottom: 40,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  cardContentCol: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionPillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  postResultCard: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postBodyText: {
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
  videoResultCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  videoThumbContainer: {
    position: 'relative',
    width: 120,
    height: 75,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  reelResultCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  reelThumbnail: {
    width: 80,
    height: 110,
  },
  eventThumb: {
    width: 60,
    height: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
});
