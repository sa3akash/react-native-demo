import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button, SearchBar, SegmentedControl } from '../../shared/components';
import { useGroupStore, GroupModel } from '../../store/useGroupStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupDetailScreen } from './GroupDetailScreen';

export interface GroupsScreenProps {
  onSelectGroup?: (groupId: string) => void;
}

const GROUP_TABS = [
  { id: 'my_groups', label: 'My Groups 👥' },
  { id: 'discover', label: 'Discover 🔍' },
  { id: 'managed', label: 'Managed by You 👑' },
];

export const GroupsScreenComponent: React.FC<GroupsScreenProps> = () => {
  const { colors, theme } = useTheme();
  const groups = useGroupStore((state) => state.groups);
  const joinGroup = useGroupStore((state) => state.joinGroup);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('my_groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const isRTL = I18nManager.isRTL;

  if (selectedGroupId) {
    return <GroupDetailScreen groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />;
  }

  const filteredGroups = groups.filter((g) => {
    if (activeTab === 'my_groups' && !g.isMember) return false;
    if (activeTab === 'managed' && g.userRole !== 'admin' && g.userRole !== 'moderator') return false;
    if (searchQuery.trim() && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getPrivacyBadge = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return '🌐 Public';
      case 'private':
        return '🔒 Private';
      case 'secret':
        return '🕵️ Secret';
      default:
        return '🌐 Public';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitleRow}>
          <Typography variant="h2" color={colors.text} bold>
            Community Groups
          </Typography>
          <Button
            label="+ Create Group"
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search groups, guilds, communities..."
        />

        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={GROUP_TABS}
            activeId={activeTab}
            onSelect={setActiveTab}
            size="sm"
          />
        </View>
      </View>

      {/* Groups List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              👥
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Groups Found
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              {activeTab === 'my_groups'
                ? "You haven't joined any groups yet. Explore trending groups in the Discover tab."
                : 'Create a new group or try searching with different keywords.'}
            </Typography>
          </View>
        ) : (
          filteredGroups.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => setSelectedGroupId(item.id)}
              style={[styles.groupCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
            >
              {/* Cover Banner */}
              <Image source={{ uri: item.coverUrl }} style={styles.cardCover} resizeMode="cover" />

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Avatar uri={item.avatarUrl} name={item.name} size="md" />
                  <View style={styles.cardTitleCol}>
                    <Typography variant="subtitle1" color={colors.text} bold numberOfLines={1}>
                      {item.name}
                    </Typography>
                    <View style={styles.metaRow}>
                      <View style={[styles.privacyPill, { backgroundColor: colors.surfaceElevated }]}>
                        <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 10 }}>
                          {getPrivacyBadge(item.privacy)}
                        </Typography>
                      </View>
                      <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 6 }}>
                        {(item.membersCount / 1000).toFixed(1)}k members
                      </Typography>
                    </View>
                  </View>
                </View>

                <Typography variant="body2" color={colors.textSecondary} numberOfLines={2} style={styles.descriptionText}>
                  {item.description}
                </Typography>

                {/* Footer Action */}
                <View style={styles.cardFooter}>
                  {item.isMember ? (
                    <Typography variant="caption" color={colors.primary} bold>
                      {item.userRole === 'admin' ? '👑 Admin of Group' : item.userRole === 'moderator' ? '🛡️ Moderator' : '✓ Joined Member'}
                    </Typography>
                  ) : (
                    <Button
                      label={item.requiresApproval ? 'Request to Join ⏳' : '+ Join Group'}
                      variant="primary"
                      size="sm"
                      onPress={() => {
                        joinGroup(item.id);
                        showToast({
                          message: item.requiresApproval ? 'Membership request submitted ⏳' : 'Joined group! 🎉',
                          type: 'success',
                        });
                      }}
                    />
                  )}
                  <Typography variant="caption" color={colors.primary} bold>
                    View Group →
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(id) => setSelectedGroupId(id)}
      />
    </View>
  );
};

export const GroupsScreen = memo(GroupsScreenComponent);

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
  groupCard: {
    overflow: 'hidden',
  },
  cardCover: {
    width: '100%',
    height: 120,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  privacyPill: {
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
