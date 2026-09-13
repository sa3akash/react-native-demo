import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Badge, SearchBar, SegmentedControl } from '../../shared/components';
import { useChatStore, Conversation, ConversationType } from '../../store/useChatStore';
import { CreateChatModal } from './CreateChatModal';

export interface ChatListScreenProps {
  onSelectConversation: (conversationId: string) => void;
  onNewMessagePress?: () => void;
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'direct', label: '👤 Direct' },
  { id: 'group', label: '👥 Groups' },
  { id: 'channel', label: '📢 Channels' },
  { id: 'community', label: '🌐 Spaces' },
];

export const ChatListScreenComponent: React.FC<ChatListScreenProps> = ({
  onSelectConversation,
}) => {
  const { colors, theme } = useTheme();
  const { conversations } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isRTL = I18nManager.isRTL;

  const filteredConversations = conversations.filter((c) => {
    if (activeTab !== 'all' && c.type !== activeTab) return false;
    if (searchQuery.trim() && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const renderItem = ({ item }: { item: Conversation }) => {
    const isOnline = item.participants.some((p) => p.isOnline && p.id !== 'usr_meta_998');

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelectConversation(item.id)}
        style={[
          styles.convItem,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={styles.avatarWrapper}>
          <Avatar
            uri={item.avatarUrl}
            name={item.title}
            size="md"
            status={isOnline ? 'online' : undefined}
          />
          {item.type !== 'direct' && (
            <View style={[styles.typeBadgeOverlay, { backgroundColor: colors.primary }]}>
              <Typography variant="caption" color="#FFFFFF" style={{ fontSize: 9 }}>
                {item.type === 'group' ? '👥' : item.type === 'channel' ? '📢' : '🌐'}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.convTextCol}>
          <View style={styles.titleRow}>
            <Typography variant="subtitle1" color={colors.text} bold numberOfLines={1} style={{ flex: 1 }}>
              {item.title}
            </Typography>
            {item.isPinned && (
              <Typography variant="caption" color={colors.primary} style={{ marginRight: 4 }}>
                📌
              </Typography>
            )}
            {item.lastMessage && (
              <Typography variant="caption" color={colors.textMuted}>
                {item.lastMessage.createdAt}
              </Typography>
            )}
          </View>

          <View style={styles.messageRow}>
            <Typography
              variant="body2"
              color={item.unreadCount > 0 ? colors.text : colors.textSecondary}
              bold={item.unreadCount > 0}
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {item.lastMessage
                ? `${item.type !== 'direct' ? `${item.lastMessage.senderName}: ` : ''}${item.lastMessage.content}`
                : 'No messages yet'}
            </Typography>

            {/* Delivery status indicator for own last messages */}
            {item.lastMessage?.status && (
              <Typography variant="caption" color={item.lastMessage.status === 'read' ? '#0A84FF' : colors.textMuted} style={{ marginLeft: 4 }}>
                {item.lastMessage.status === 'sending' ? '🕒' : item.lastMessage.status === 'sent' ? '✓' : item.lastMessage.status === 'delivered' ? '✓✓' : '✓✓'}
              </Typography>
            )}

            {item.unreadCount > 0 && (
              <View style={{ marginLeft: 8 }}>
                <Badge count={item.unreadCount} variant="primary" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Search & Filter Bar */}
      <View style={styles.headerSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search chats, groups, channels..."
        />

        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={FILTER_TABS}
            activeId={activeTab}
            onSelect={setActiveTab}
            size="sm"
          />
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h2" color={colors.textMuted} style={{ marginBottom: 8 }}>
              💬
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No conversations found
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Tap the button below to start a new chat, group, or channel.
            </Typography>
          </View>
        }
      />

      {/* Floating Action Button for New Chat */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsCreateModalOpen(true)}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Create new conversation"
      >
        <Typography variant="h2" color="#FFFFFF">
          ✍️
        </Typography>
      </TouchableOpacity>

      {/* Create Chat Modal */}
      <CreateChatModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(convId) => onSelectConversation(convId)}
      />
    </View>
  );
};

export const ChatListScreen = memo(ChatListScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  convItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  typeBadgeOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
