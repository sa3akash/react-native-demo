import React, { useState, useMemo, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Avatar,
  SegmentedControl,
  SearchBar,
  EmptyState,
} from '../../shared/components';
import { useAuthStore, ModeratedUser } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ModerationManagementScreenProps {
  onBack: () => void;
}

const ModerationManagementScreenComponent: React.FC<ModerationManagementScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const {
    blockedUsers,
    mutedUsers,
    restrictedUsers,
    unblockUser,
    unmuteUser,
    unrestrictUser,
  } = useAuthStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'blocked' | 'muted' | 'restricted'>('blocked');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = useMemo(() => {
    let list: ModeratedUser[] = [];
    if (activeTab === 'blocked') list = blockedUsers;
    else if (activeTab === 'muted') list = mutedUsers;
    else if (activeTab === 'restricted') list = restrictedUsers;

    if (!searchQuery.trim()) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, blockedUsers, mutedUsers, restrictedUsers, searchQuery]);

  const handleAction = (user: ModeratedUser) => {
    if (activeTab === 'blocked') {
      unblockUser(user.id);
      showToast({ message: `Unblocked @${user.username}`, type: 'info' });
    } else if (activeTab === 'muted') {
      unmuteUser(user.id);
      showToast({ message: `Unmuted @${user.username}`, type: 'info' });
    } else if (activeTab === 'restricted') {
      unrestrictUser(user.id);
      showToast({ message: `Removed restrictions for @${user.username}`, type: 'info' });
    }
  };

  const getActionLabel = () => {
    if (activeTab === 'blocked') return 'Unblock';
    if (activeTab === 'muted') return 'Unmute';
    return 'Unrestrict';
  };

  const getTabExplanation = () => {
    if (activeTab === 'blocked') {
      return 'Blocked users cannot see your profile, posts, or message you.';
    }
    if (activeTab === 'muted') {
      return 'Muted users posts and stories are hidden from your feed without them knowing.';
    }
    return 'Restricted users cannot see when you are online or read receipts, and comments require approval.';
  };

  const tabs = [
    { id: 'blocked', label: `Blocked (${blockedUsers.length})` },
    { id: 'muted', label: `Muted (${mutedUsers.length})` },
    { id: 'restricted', label: `Restricted (${restrictedUsers.length})` },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} accessible={true} accessibilityRole="button">
          <Typography variant="h3" color={colors.text}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Blocked & Restricted
        </Typography>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        <SegmentedControl
          segments={tabs}
          activeId={activeTab}
          onSelect={(id) => {
            setActiveTab(id as any);
            setSearchQuery('');
          }}
        />
        <Typography variant="caption" color={colors.textSecondary} style={styles.explanationText}>
          {getTabExplanation()}
        </Typography>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${activeTab} accounts...`}
        />
      </View>

      {/* List */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.userRow, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
            <Avatar uri={item.avatarUrl} name={item.name} size="md" />
            <View style={styles.userInfoCol}>
              <Typography variant="subtitle2" color={colors.text} bold>
                {item.name}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                @{item.username} • {item.date}
              </Typography>
              {item.reason && (
                <Typography variant="caption" color={colors.textMuted} numberOfLines={1}>
                  Note: {item.reason}
                </Typography>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleAction(item)}
              style={[styles.actionBtn, { borderColor: colors.borderSubtle }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${getActionLabel()} ${item.name}`}
            >
              <Typography variant="buttonSmall" color={colors.primary} bold>
                {getActionLabel()}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🛡️"
            title={`No ${activeTab} accounts`}
            description={`You haven't ${activeTab} any users on SocialSphere.`}
          />
        }
      />
    </SafeAreaView>
  );
};

export const ModerationManagementScreen = memo(ModerationManagementScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 6,
  },
  tabsWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  explanationText: {
    marginTop: 6,
    marginBottom: 4,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfoCol: {
    marginLeft: 12,
    flex: 1,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
