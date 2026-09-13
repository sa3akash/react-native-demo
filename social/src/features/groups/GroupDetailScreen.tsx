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
import { useGroupStore, GroupModel, GroupPost } from '../../store/useGroupStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { GroupAdminManagementScreen } from './GroupAdminManagementScreen';

export interface GroupDetailScreenProps {
  groupId: string;
  onBack: () => void;
}

const DETAIL_TABS = [
  { id: 'discussion', label: 'Discussion 💬' },
  { id: 'rules', label: 'Rules 📜' },
  { id: 'members', label: 'Members 👥' },
];

const GroupDetailScreenComponent: React.FC<GroupDetailScreenProps> = ({
  groupId,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const joinGroup = useGroupStore((state) => state.joinGroup);
  const leaveGroup = useGroupStore((state) => state.leaveGroup);
  const createGroupPost = useGroupStore((state) => state.createGroupPost);
  const togglePinPost = useGroupStore((state) => state.togglePinPost);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('discussion');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const isRTL = I18nManager.isRTL;

  if (!group) return null;

  if (isAdminPanelOpen) {
    return <GroupAdminManagementScreen groupId={groupId} onBack={() => setIsAdminPanelOpen(false)} />;
  }

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    createGroupPost(groupId, newPostText.trim());
    setNewPostText('');
    showToast({ message: 'Post published to group! 🚀', type: 'success' });
  };

  const getPrivacyBadge = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return '🌐 Public Group';
      case 'private':
        return '🔒 Private Group';
      case 'secret':
        return '🕵️ Secret Group';
      default:
        return '🌐 Public Group';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: group.coverUrl }} style={styles.coverImage} resizeMode="cover" />
        <TouchableOpacity onPress={onBack} style={styles.floatingBackBtn}>
          <Typography variant="h3" color="#FFFFFF">
            {isRTL ? '➡️' : '⬅️'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Group Header Info */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.avatarRow}>
          <View style={styles.groupAvatar}>
            <Avatar uri={group.avatarUrl} name={group.name} size="lg" />
          </View>
          <View style={styles.headerInfoCol}>
            <Typography variant="h2" color={colors.text} bold>
              {group.name}
            </Typography>
            <View style={styles.metaBadgeRow}>
              <View style={[styles.privacyPill, { backgroundColor: colors.surfaceElevated }]}>
                <Typography variant="caption" color={colors.primary} bold>
                  {getPrivacyBadge(group.privacy)}
                </Typography>
              </View>
              <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 8 }}>
                {(group.membersCount / 1000).toFixed(1)}k members
              </Typography>
            </View>
          </View>
        </View>

        <Typography variant="body2" color={colors.textSecondary} style={styles.descriptionText}>
          {group.description}
        </Typography>

        {/* Action Button Row */}
        <View style={styles.actionRow}>
          {group.isMember ? (
            <View style={styles.memberActionGroup}>
              <Button
                label="Joined ✓"
                variant="ghost"
                size="md"
                onPress={() => {
                  leaveGroup(groupId);
                  showToast({ message: 'Left group', type: 'info' });
                }}
                style={{ flex: 1 }}
              />
              {group.userRole === 'admin' || group.userRole === 'moderator' ? (
                <Button
                  label="⚙️ Admin Tools"
                  variant="primary"
                  size="md"
                  onPress={() => setIsAdminPanelOpen(true)}
                  style={{ flex: 1 }}
                />
              ) : null}
            </View>
          ) : (
            <Button
              label={group.requiresApproval ? '+ Request to Join' : '+ Join Group'}
              variant="primary"
              size="lg"
              onPress={() => {
                joinGroup(groupId);
                showToast({
                  message: group.requiresApproval ? 'Membership request submitted ⏳' : 'Joined group! 🎉',
                  type: 'success',
                });
              }}
              fullWidth
            />
          )}
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

      {/* Tab: Discussion Feed */}
      {activeTab === 'discussion' && (
        <View style={styles.discussionContent}>
          {/* Create Post Card */}
          {group.isMember && (
            <View style={[styles.createPostCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
              <View style={styles.createPostInputRow}>
                <Avatar uri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" name="You" size="sm" />
                <TextInput
                  style={[styles.createPostInput, { color: colors.text }]}
                  placeholder="Share a thought, architecture question, or benchmark..."
                  placeholderTextColor={colors.textMuted}
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                />
              </View>
              {newPostText.trim().length > 0 && (
                <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                  <Button label="Publish Post" variant="primary" size="sm" onPress={handleCreatePost} />
                </View>
              )}
            </View>
          )}

          {/* Group Posts List */}
          {group.posts.map((post) => (
            <View
              key={post.id}
              style={[styles.postCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
            >
              <View style={styles.postAuthorRow}>
                <Avatar uri={post.authorAvatar} name={post.authorName} size="sm" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color={colors.text} bold>
                      {post.authorName}
                    </Typography>
                    {post.authorRole === 'admin' && (
                      <View style={[styles.roleTag, { backgroundColor: '#FF2D55' }]}>
                        <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                          ADMIN
                        </Typography>
                      </View>
                    )}
                    {post.authorRole === 'moderator' && (
                      <View style={[styles.roleTag, { backgroundColor: colors.primary }]}>
                        <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                          MOD
                        </Typography>
                      </View>
                    )}
                  </View>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {post.createdAt}
                  </Typography>
                </View>

                {group.userRole === 'admin' && (
                  <TouchableOpacity onPress={() => togglePinPost(groupId, post.id)}>
                    <Typography variant="caption" color={post.isPinned ? colors.primary : colors.textMuted} bold>
                      {post.isPinned ? '📌 Pinned' : 'Pin'}
                    </Typography>
                  </TouchableOpacity>
                )}
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
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tab: Rules */}
      {activeTab === 'rules' && (
        <View style={styles.rulesContent}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 8 }}>
            Community Rules & Guidelines ({group.rules.length})
          </Typography>
          {group.rules.map((rule, idx) => (
            <View
              key={rule.id}
              style={[styles.ruleCard, { backgroundColor: colors.surface, borderRadius: theme.radius.md, borderColor: colors.borderSubtle }]}
            >
              <Typography variant="subtitle2" color={colors.primary} bold>
                {idx + 1}. {rule.title}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                {rule.description}
              </Typography>
            </View>
          ))}
        </View>
      )}

      {/* Tab: Members */}
      {activeTab === 'members' && (
        <View style={styles.membersContent}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            Members ({group.members.length})
          </Typography>
          {group.members.map((mem) => (
            <View
              key={mem.id}
              style={[styles.memberRow, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
            >
              <Avatar uri={mem.avatarUrl} name={mem.name} size="md" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {mem.name}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Joined {mem.joinedAt}
                </Typography>
              </View>
              <View style={[styles.roleTag, { backgroundColor: mem.role === 'admin' ? '#FF2D55' : mem.role === 'moderator' ? colors.primary : colors.surfaceElevated }]}>
                <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                  {mem.role.toUpperCase()}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export const GroupDetailScreen = memo(GroupDetailScreenComponent);

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
  groupAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfoCol: {
    flex: 1,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  privacyPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  descriptionText: {
    marginTop: 12,
    lineHeight: 20,
  },
  actionRow: {
    marginTop: 16,
  },
  memberActionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  discussionContent: {
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
  roleTag: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
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
  rulesContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  ruleCard: {
    padding: 14,
    borderWidth: 1,
  },
  membersContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
