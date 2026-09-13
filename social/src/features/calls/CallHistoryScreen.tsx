import React, { memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button } from '../../shared/components';
import { useCallStore, CallHistoryItem } from '../../store/useCallStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CallHistoryScreenProps {
  onStartNewCall?: () => void;
}

const CallHistoryScreenComponent: React.FC<CallHistoryScreenProps> = ({
  onStartNewCall,
}) => {
  const { colors, theme } = useTheme();
  const callHistory = useCallStore((state) => state.callHistory);
  const startCall = useCallStore((state) => state.startCall);
  const { showToast } = useToast();

  const isRTL = I18nManager.isRTL;

  const formatDuration = (secs: number): string => {
    if (secs === 0) return 'Missed';
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}m ${remaining}s`;
  };

  const handleCallBack = (item: CallHistoryItem) => {
    startCall({
      callType: item.callType,
      title: item.participants[0]?.name || 'Call',
      participants: item.participants,
    });
  };

  const renderItem = ({ item }: { item: CallHistoryItem }) => {
    const isMissed = item.direction === 'missed';
    const participant = item.participants[0];

    return (
      <View
        style={[
          styles.historyRow,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Avatar uri={participant?.avatarUrl} name={participant?.name || 'Contact'} size="md" />

        <View style={styles.historyInfoCol}>
          <Typography
            variant="subtitle2"
            color={isMissed ? '#FF3B30' : colors.text}
            bold
          >
            {participant?.name || 'Unknown Contact'}
          </Typography>

          <View style={styles.historyMetaRow}>
            <Typography variant="caption" color={isMissed ? '#FF3B30' : colors.textSecondary}>
              {item.direction === 'incoming' ? '↙️ Incoming' : item.direction === 'outgoing' ? '↗️ Outgoing' : '🚫 Missed'} • {item.callType.toUpperCase()}
            </Typography>
            <Typography variant="caption" color={colors.textMuted} style={{ marginLeft: 6 }}>
              {formatDuration(item.durationSeconds)} • {item.createdAt}
            </Typography>
          </View>

          {item.recordingUrl && (
            <TouchableOpacity
              onPress={() => showToast({ message: 'Playing call recording ⏺️', type: 'info' })}
              style={styles.recordingPlayPill}
            >
              <Typography variant="caption" color="#0A84FF" bold>
                ▶ Play Recording ({item.durationSeconds}s)
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* Callback Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleCallBack(item)}
          style={[styles.callBackBtn, { backgroundColor: colors.primaryLight }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Call ${participant?.name}`}
        >
          <Typography variant="body1" color={colors.primary}>
            {item.callType === 'video' ? '📹' : '📞'}
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              📞
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Call History
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Make your first high-definition audio or video call with friends.
            </Typography>
          </View>
        }
      />
    </View>
  );
};

export const CallHistoryScreen = memo(CallHistoryScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  historyRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  historyInfoCol: {
    flex: 1,
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  recordingPlayPill: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  callBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
});
