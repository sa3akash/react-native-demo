import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Avatar, SearchBar, Button } from '../../shared/components';
import { useEventStore } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface InviteFriendsModalProps {
  visible: boolean;
  eventId: string;
  onClose: () => void;
}

interface FriendItem {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

const MOCK_FRIENDS: FriendItem[] = [
  { id: 'usr_1', name: 'Sarah Jenkins', username: 'sarah.jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { id: 'usr_2', name: 'David Chen', username: 'david.chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'usr_3', name: 'Elena Rostova', username: 'elena.rostova', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
  { id: 'usr_4', name: 'Michael Zhang', username: 'michael.zhang', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
  { id: 'usr_5', name: 'Priya Sharma', username: 'priya.sharma', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
];

const InviteFriendsModalComponent: React.FC<InviteFriendsModalProps> = ({
  visible,
  eventId,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const inviteFriends = useEventStore((state) => state.inviteFriends);
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isRTL = I18nManager.isRTL;

  const filteredFriends = MOCK_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.username.toLowerCase().includes(query.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === MOCK_FRIENDS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(MOCK_FRIENDS.map((f) => f.id));
    }
  };

  const handleSendInvites = () => {
    if (selectedIds.length === 0) return;
    inviteFriends(eventId, selectedIds);
    showToast({
      message: `Invited ${selectedIds.length} friend${selectedIds.length > 1 ? 's' : ''} to event! ✉️`,
      type: 'success',
    });
    setSelectedIds([]);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Invite Friends ✉️">
      <View style={styles.content}>
        {/* Search */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search friends to invite..."
        />

        {/* Select All Row */}
        <View
          style={[
            styles.selectHeader,
            {
              borderBottomColor: colors.borderSubtle,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          <Typography variant="caption" color={colors.textSecondary}>
            {selectedIds.length} of {MOCK_FRIENDS.length} selected
          </Typography>
          <TouchableOpacity onPress={handleSelectAll}>
            <Typography variant="caption" color={colors.primary} bold>
              {selectedIds.length === MOCK_FRIENDS.length ? 'Deselect All' : 'Select All'}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
          {filteredFriends.map((friend) => {
            const isSelected = selectedIds.includes(friend.id);

            return (
              <TouchableOpacity
                key={friend.id}
                activeOpacity={0.8}
                onPress={() => toggleSelect(friend.id)}
                style={[
                  styles.friendRow,
                  {
                    borderBottomColor: colors.borderSubtle,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <Avatar uri={friend.avatarUrl} name={friend.name} size="md" />
                <View style={styles.nameCol}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {friend.name}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    @{friend.username}
                  </Typography>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && (
                    <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 10 }}>
                      ✓
                    </Typography>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Button
          label={`Send Invites (${selectedIds.length})`}
          variant="primary"
          size="lg"
          onPress={handleSendInvites}
          disabled={selectedIds.length === 0}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </View>
    </Modal>
  );
};

export const InviteFriendsModal = memo(InviteFriendsModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 6,
    gap: 8,
  },
  selectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  friendsList: {
    maxHeight: 280,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
