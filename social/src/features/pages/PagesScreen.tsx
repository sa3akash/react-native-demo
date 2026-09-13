import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button, SearchBar, SegmentedControl } from '../../shared/components';
import { usePageStore, PageModel } from '../../store/usePageStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { CreatePageModal } from './CreatePageModal';
import { PageDetailScreen } from './PageDetailScreen';

export interface PagesScreenProps {
  onSelectPage?: (pageId: string) => void;
}

const PAGE_TABS = [
  { id: 'following', label: 'Following 📑' },
  { id: 'discover', label: 'Discover 🔍' },
  { id: 'managed', label: 'Managed by You 👑' },
];

export const PagesScreenComponent: React.FC<PagesScreenProps> = () => {
  const { colors, theme } = useTheme();
  const pages = usePageStore((state) => state.pages);
  const toggleFollow = usePageStore((state) => state.toggleFollowPage);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  if (selectedPageId) {
    return <PageDetailScreen pageId={selectedPageId} onBack={() => setSelectedPageId(null)} />;
  }

  const filteredPages = pages.filter((p) => {
    if (activeTab === 'following' && !p.isFollowing) return false;
    if (activeTab === 'managed' && p.userRole !== 'owner' && p.userRole !== 'admin') return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getPageTypePill = (type: string) => {
    switch (type) {
      case 'business':
        return '💼 Business';
      case 'creator':
        return '🎨 Creator';
      case 'organization':
        return '🏛️ Org';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitleRow}>
          <Typography variant="h2" color={colors.text} bold>
            Pages
          </Typography>
          <Button
            label="+ Create Page"
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search business, creators, orgs..."
        />

        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={PAGE_TABS}
            activeId={activeTab}
            onSelect={setActiveTab}
            size="sm"
          />
        </View>
      </View>

      {/* Pages List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredPages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              🏢
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Pages Found
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              {activeTab === 'following'
                ? "You're not following any pages yet. Discover verified creators and tech organizations."
                : 'Create a new Page or search with different keywords.'}
            </Typography>
          </View>
        ) : (
          filteredPages.map((page) => (
            <TouchableOpacity
              key={page.id}
              activeOpacity={0.9}
              onPress={() => setSelectedPageId(page.id)}
              style={[styles.pageCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
            >
              {/* Cover Photo */}
              <Image source={{ uri: page.coverUrl }} style={styles.cardCover} resizeMode="cover" />

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Avatar uri={page.avatarUrl} name={page.name} size="md" />
                  <View style={styles.cardTitleCol}>
                    <View style={styles.titleRow}>
                      <Typography variant="subtitle1" color={colors.text} bold numberOfLines={1}>
                        {page.name}
                      </Typography>
                      {page.isVerified && (
                        <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
                          ☑️
                        </Typography>
                      )}
                    </View>
                    <View style={styles.metaRow}>
                      <View style={[styles.typePill, { backgroundColor: colors.surfaceElevated }]}>
                        <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 10 }}>
                          {getPageTypePill(page.pageType)}
                        </Typography>
                      </View>
                      <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 6 }}>
                        {formatFollowers(page.followersCount)} followers
                      </Typography>
                    </View>
                  </View>
                </View>

                <Typography variant="body2" color={colors.textSecondary} numberOfLines={2} style={styles.descriptionText}>
                  {page.description}
                </Typography>

                {/* Footer Actions */}
                <View style={styles.cardFooter}>
                  {page.userRole === 'owner' || page.userRole === 'admin' ? (
                    <Typography variant="caption" color={colors.primary} bold>
                      👑 Admin / Owner
                    </Typography>
                  ) : (
                    <Button
                      label={page.isFollowing ? 'Following ✓' : '+ Follow'}
                      variant={page.isFollowing ? 'ghost' : 'primary'}
                      size="sm"
                      onPress={() => {
                        toggleFollow(page.id);
                        showToast({ message: page.isFollowing ? 'Unfollowed' : 'Following page!', type: 'info' });
                      }}
                    />
                  )}
                  <Typography variant="caption" color={colors.primary} bold>
                    View Page →
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create Page Modal */}
      <CreatePageModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(id) => setSelectedPageId(id)}
      />
    </View>
  );
};

export const PagesScreen = memo(PagesScreenComponent);
export const EventsScreen: React.FC = () => <PagesScreen />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  pageCard: {
    overflow: 'hidden',
  },
  cardCover: {
    width: '100%',
    height: 110,
  },
  cardBody: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitleCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  descriptionText: {
    marginTop: 10,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
});
