import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, SegmentedControl, Button } from '../../shared/components';
import {
  useNotificationStore,
  AppNotification,
  NotificationCategory,
} from '../../store/useNotificationStore';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';

export interface NotificationScreenProps {
  onNotificationPress?: (notif: AppNotification) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All 🔔' },
  { id: 'mentions', label: '💬 Mentions' },
  { id: 'reactions', label: '❤️ Likes' },
  { id: 'comments', label: '💭 Comments' },
  { id: 'calls', label: '📞 Calls' },
];

export const NotificationCenterScreenComponent: React.FC<NotificationScreenProps> = ({
  onNotificationPress,
}) => {
  const { colors, theme } = useTheme();
  const {
    notifications,
    selectedCategory,
    setSelectedCategory,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
  } = useNotificationStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isRTL = I18nManager.isRTL;

  const filtered = notifications.filter((n) => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryIcon = (category: NotificationCategory): string => {
    switch (category) {
      case 'reactions':
        return '❤️';
      case 'comments':
        return '💬';
      case 'mentions':
        return '🏷️';
      case 'calls':
        return '📞';
      case 'security':
        return '🛡️';
      default:
        return '🔔';
    }
  };

  if (isSettingsOpen) {
    return <NotificationSettingsScreen onBack={() => setIsSettingsOpen(false)} />;
  }

  const renderItem = ({ item }: { item: AppNotification }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          markAsRead(item.id);
          onNotificationPress?.(item);
        }}
        style={[
          styles.notifItem,
          {
            backgroundColor: item.isRead ? colors.surface : colors.surfaceElevated,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {/* Avatar with Icon Overlay */}
        <View style={styles.avatarWrapper}>
          <Avatar uri={item.avatarUrl} name={item.title} size="md" />
          <View style={[styles.categoryIconBadge, { backgroundColor: colors.surface }]}>
            <Typography variant="caption" style={{ fontSize: 10 }}>
              {getCategoryIcon(item.category)}
            </Typography>
          </View>
        </View>

        {/* Content Column */}
        <View style={styles.contentCol}>
          <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
            {item.title}
          </Typography>
          <Typography variant="caption" color={colors.textSecondary} numberOfLines={2} style={{ marginTop: 2 }}>
            {item.body}
          </Typography>
          <View style={styles.footerRow}>
            <Typography variant="caption" color={colors.textMuted} style={{ fontSize: 11 }}>
              {item.createdAt}
            </Typography>
            <Typography variant="caption" color={colors.primary} bold style={{ marginLeft: 8, fontSize: 10 }}>
              via {item.channel.toUpperCase()}
            </Typography>
          </View>
        </View>

        {/* Unread indicator dot & Delete */}
        <View style={styles.actionCol}>
          {!item.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
          <TouchableOpacity
            onPress={() => deleteNotification(item.id)}
            style={styles.deleteBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete notification"
          >
            <Typography variant="caption" color={colors.textMuted}>
              ✕
            </Typography>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
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
        <View style={{ flex: 1 }}>
          <Typography variant="h2" color={colors.text} bold>
            Notification Center
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color={colors.primary} bold>
              {unreadCount} unread updates
            </Typography>
          )}
        </View>

        <View style={styles.headerBtnGroup}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.textBtn}>
              <Typography variant="caption" color={colors.primary} bold>
                Mark all read
              </Typography>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            style={styles.settingsBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
          >
            <Typography variant="body1">⚙️</Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs Filter */}
      <View style={styles.tabSection}>
        <SegmentedControl
          segments={CATEGORY_TABS}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as NotificationCategory)}
          size="sm"
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              🔔
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Notifications
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              You're all caught up! Updates about likes, comments, and mentions will appear here.
            </Typography>
          </View>
        }
      />
    </View>
  );
};

export const NotificationCenterScreen = memo(NotificationCenterScreenComponent);
export const NotificationScreen = NotificationCenterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textBtn: {
    paddingVertical: 4,
  },
  settingsBtn: {
    padding: 4,
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  notifItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  categoryIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  contentCol: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
});
