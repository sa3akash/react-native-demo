import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, BottomSheet, SearchBar } from '../../shared/components';
import { useChatStore, ChatMessage } from '../../store/useChatStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ForwardMessageModalProps {
  visible: boolean;
  message: ChatMessage | null;
  onClose: () => void;
}

const ForwardMessageModalComponent: React.FC<ForwardMessageModalProps> = ({
  visible,
  message,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const conversations = useChatStore((state) => state.conversations);
  const forwardMessage = useChatStore((state) => state.forwardMessage);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const isRTL = I18nManager.isRTL;

  const filtered = search.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  const handleForward = (convId: string, convTitle: string) => {
    if (!message) return;
    forwardMessage(convId, message);
    showToast({ message: `Message forwarded to ${convTitle}! ↗️`, type: 'success' });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Forward Message" maxHeight="75%">
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats, groups, channels..."
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleForward(item.id, item.title)}
              style={[
                styles.convRow,
                {
                  borderBottomColor: colors.borderSubtle,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
            >
              <Avatar uri={item.avatarUrl} name={item.title} size="md" />
              <View style={styles.convTextCol}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {item.title}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {item.type === 'direct' ? 'Direct Message' : item.type.toUpperCase()}
                </Typography>
              </View>
              <Typography variant="caption" color={colors.primary} bold>
                Send ↗️
              </Typography>
            </TouchableOpacity>
          )}
        />
      </View>
    </BottomSheet>
  );
};

export const ForwardMessageModal = memo(ForwardMessageModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    height: 420,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  convRow: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  convTextCol: {
    flex: 1,
  },
});
