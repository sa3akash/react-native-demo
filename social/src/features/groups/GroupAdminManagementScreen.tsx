import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  I18nManager,
  FlatList,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Avatar,
  SegmentedControl,
  Button,
  Input,
  Badge,
} from '../../shared/components';
import {
  useGroupStore,
  GroupModel,
  GroupMemberRole,
  GroupPrivacy,
  GroupRule,
} from '../../store/useGroupStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface GroupAdminManagementScreenProps {
  groupId: string;
  onBack: () => void;
}

const ADMIN_TABS = [
  { id: 'approvals', label: 'Approvals 📝' },
  { id: 'members', label: 'Members 👥' },
  { id: 'rules', label: 'Rules 📜' },
  { id: 'settings', label: 'Settings ⚙️' },
];

const PRIVACY_OPTIONS = [
  { id: 'public', label: '🌐 Public' },
  { id: 'private', label: '🔒 Private' },
  { id: 'secret', label: '🕵️ Secret' },
];

const GroupAdminManagementScreenComponent: React.FC<GroupAdminManagementScreenProps> = ({
  groupId,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const group = useGroupStore((state) => state.groups.find((g) => g.id === groupId));
  const approveRequest = useGroupStore((state) => state.approveMembershipRequest);
  const declineRequest = useGroupStore((state) => state.declineMembershipRequest);
  const assignRole = useGroupStore((state) => state.assignMemberRole);
  const removeMember = useGroupStore((state) => state.removeMember);
  const muteMember = useGroupStore((state) => state.muteMember);
  const updateGroupRules = useGroupStore((state) => state.updateGroupRules);
  const updateGroupSettings = useGroupStore((state) => state.updateGroupSettings);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('approvals');
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const isRTL = I18nManager.isRTL;

  if (!group) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Typography variant="subtitle1" color={colors.text}>
          Group not found
        </Typography>
        <Button label="Back" variant="primary" onPress={onBack} style={{ marginTop: 12 }} />
      </View>
    );
  }

  const handleAddRule = () => {
    if (!newRuleTitle.trim()) {
      showToast({ message: 'Enter a rule title.', type: 'warning' });
      return;
    }
    const newRule: GroupRule = {
      id: `r_${Date.now()}`,
      order: group.rules.length + 1,
      title: newRuleTitle.trim(),
      description: newRuleDesc.trim(),
    };
    updateGroupRules(groupId, [...group.rules, newRule]);
    setNewRuleTitle('');
    setNewRuleDesc('');
    showToast({ message: 'Rule added successfully!', type: 'success' });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = group.rules.filter((r) => r.id !== ruleId);
    updateGroupRules(groupId, updated);
    showToast({ message: 'Rule removed', type: 'info' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Typography variant="h3" color={colors.text}>
            {isRTL ? '➡️' : '⬅️'}
          </Typography>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Typography variant="h3" color={colors.text} bold numberOfLines={1}>
            Admin Governance
          </Typography>
          <Typography variant="caption" color={colors.primary} bold>
            {group.name}
          </Typography>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <SegmentedControl
          segments={ADMIN_TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
          size="sm"
        />
      </View>

      {/* Tab 1: Membership Approvals */}
      {activeTab === 'approvals' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="subtitle1" color={colors.text} bold>
              Pending Requests ({group.pendingRequests.length})
            </Typography>
          </View>

          {group.pendingRequests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Typography variant="h2" style={{ marginBottom: 8 }}>
                ✅
              </Typography>
              <Typography variant="subtitle2" color={colors.text} bold>
                No Pending Requests
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                All applicant requests have been reviewed and approved.
              </Typography>
            </View>
          ) : (
            group.pendingRequests.map((req) => (
              <View
                key={req.id}
                style={[styles.requestCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.lg }]}
              >
                <View style={styles.applicantRow}>
                  <Avatar uri={req.userAvatar} name={req.userName} size="md" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Typography variant="subtitle2" color={colors.text} bold>
                      {req.userName}
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      Applied {req.appliedAt}
                    </Typography>
                  </View>
                </View>

                {req.userBio && (
                  <Typography variant="body2" color={colors.text} style={styles.bioText}>
                    "{req.userBio}"
                  </Typography>
                )}

                {req.answers && Object.entries(req.answers).map(([q, a]) => (
                  <View key={q} style={[styles.answerBox, { backgroundColor: colors.inputBg, borderRadius: theme.radius.sm }]}>
                    <Typography variant="caption" color={colors.primary} bold>
                      Q: {q}
                    </Typography>
                    <Typography variant="caption" color={colors.text} style={{ marginTop: 2 }}>
                      A: {a}
                    </Typography>
                  </View>
                ))}

                {/* Actions: Approve & Decline */}
                <View style={styles.actionBtnRow}>
                  <Button
                    label="Decline"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      declineRequest(groupId, req.id);
                      showToast({ message: 'Request declined', type: 'info' });
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="Approve Member"
                    variant="primary"
                    size="sm"
                    onPress={() => {
                      approveRequest(groupId, req.id);
                      showToast({ message: `${req.userName} approved! 🎉`, type: 'success' });
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Tab 2: Members & Roles Management */}
      {activeTab === 'members' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            Manage Members ({group.members.length})
          </Typography>

          {group.members.map((mem) => (
            <View
              key={mem.id}
              style={[styles.memberRow, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
            >
              <Avatar uri={mem.avatarUrl} name={mem.name} size="md" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {mem.name}
                  </Typography>
                  <View
                    style={[
                      styles.rolePill,
                      {
                        backgroundColor:
                          mem.role === 'admin'
                            ? '#FF2D55'
                            : mem.role === 'moderator'
                            ? colors.primary
                            : colors.surfaceElevated,
                      },
                    ]}
                  >
                    <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                      {mem.role.toUpperCase()}
                    </Typography>
                  </View>
                </View>
                <Typography variant="caption" color={colors.textSecondary}>
                  Joined {mem.joinedAt} {mem.isMuted ? '• 🔇 Muted' : ''}
                </Typography>
              </View>

              {/* Role Action Controls */}
              <View style={styles.roleActionGroup}>
                {mem.role === 'member' && (
                  <TouchableOpacity
                    onPress={() => {
                      assignRole(groupId, mem.id, 'moderator');
                      showToast({ message: `${mem.name} promoted to Moderator! 🛡️`, type: 'info' });
                    }}
                    style={[styles.smallBtn, { backgroundColor: colors.primaryLight }]}
                  >
                    <Typography variant="caption" color={colors.primary} bold>
                      + Mod
                    </Typography>
                  </TouchableOpacity>
                )}

                {mem.role === 'moderator' && (
                  <TouchableOpacity
                    onPress={() => {
                      assignRole(groupId, mem.id, 'member');
                      showToast({ message: 'Role changed to Member', type: 'info' });
                    }}
                    style={[styles.smallBtn, { backgroundColor: colors.surfaceElevated }]}
                  >
                    <Typography variant="caption" color={colors.text}>
                      Demote
                    </Typography>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    muteMember(groupId, mem.id, !mem.isMuted);
                    showToast({ message: mem.isMuted ? 'Unmuted' : 'Muted for 24h', type: 'info' });
                  }}
                  style={styles.iconActionBtn}
                >
                  <Typography variant="body2">{mem.isMuted ? '🔊' : '🔇'}</Typography>
                </TouchableOpacity>

                {mem.role !== 'admin' && (
                  <TouchableOpacity
                    onPress={() => {
                      removeMember(groupId, mem.id);
                      showToast({ message: `${mem.name} removed from group`, type: 'warning' });
                    }}
                    style={styles.iconActionBtn}
                  >
                    <Typography variant="body2">🚫</Typography>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Tab 3: Group Rules Editor */}
      {activeTab === 'rules' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 8 }}>
            Community Guidelines & Rules
          </Typography>

          {group.rules.map((rule, idx) => (
            <View
              key={rule.id}
              style={[styles.ruleCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.md }]}
            >
              <View style={styles.ruleCardHeader}>
                <Typography variant="subtitle2" color={colors.primary} bold>
                  Rule {idx + 1}: {rule.title}
                </Typography>
                <TouchableOpacity onPress={() => handleDeleteRule(rule.id)}>
                  <Typography variant="caption" color="#FF3B30" bold>
                    Delete
                  </Typography>
                </TouchableOpacity>
              </View>
              <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                {rule.description}
              </Typography>
            </View>
          ))}

          {/* Add New Rule Box */}
          <View style={[styles.addRuleBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.lg }]}>
            <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 6 }}>
              + Add New Group Rule
            </Typography>
            <Input
              label="Rule Title"
              placeholder="e.g. No Harassment or Hate Speech"
              value={newRuleTitle}
              onChangeText={setNewRuleTitle}
            />
            <Input
              label="Rule Description / Consequences"
              placeholder="Explain what behavior is prohibited and consequences..."
              value={newRuleDesc}
              onChangeText={setNewRuleDesc}
              multiline
            />
            <Button
              label="Save Rule"
              variant="primary"
              size="md"
              onPress={handleAddRule}
              fullWidth
              style={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>
      )}

      {/* Tab 4: Privacy & Settings */}
      {activeTab === 'settings' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            Group Privacy & Permissions
          </Typography>

          {/* Privacy Selector */}
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
            <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 8 }}>
              Privacy Level
            </Typography>
            <SegmentedControl
              segments={PRIVACY_OPTIONS}
              activeId={group.privacy}
              onSelect={(id) => {
                updateGroupSettings(groupId, { privacy: id as GroupPrivacy });
                showToast({ message: `Privacy updated to ${id.toUpperCase()}`, type: 'info' });
              }}
              size="sm"
            />
          </View>

          {/* Requires Approval */}
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg, marginTop: 12 }]}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  Require Membership Approval
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Review answers before granting group membership access
                </Typography>
              </View>
              <Switch
                value={group.requiresApproval}
                onValueChange={(val) => {
                  updateGroupSettings(groupId, { requiresApproval: val });
                  showToast({ message: 'Approval settings updated', type: 'info' });
                }}
                trackColor={{ false: colors.borderSubtle, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export const GroupAdminManagementScreen = memo(GroupAdminManagementScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionHeaderRow: {
    marginBottom: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  requestCard: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bioText: {
    fontStyle: 'italic',
  },
  answerBox: {
    padding: 10,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rolePill: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  iconActionBtn: {
    padding: 4,
  },
  ruleCard: {
    padding: 14,
    borderWidth: 1,
  },
  ruleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addRuleBox: {
    padding: 16,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  settingsCard: {
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
