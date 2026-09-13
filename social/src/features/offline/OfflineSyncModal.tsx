import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Button } from '../../shared/components';
import { useOfflineStore } from '../../store/useOfflineStore';
import { SyncStatusBadge } from './SyncStatusBadge';
import { useToast } from '../../shared/components/molecules/Toast';

export interface OfflineSyncModalProps {
  visible: boolean;
  onClose: () => void;
}

const OfflineSyncModalComponent: React.FC<OfflineSyncModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const queuedMutations = useOfflineStore((state) => state.queuedMutations);
  const isSyncing = useOfflineStore((state) => state.isSyncing);
  const isOnline = useOfflineStore((state) => state.isOnline);
  const syncNow = useOfflineStore((state) => state.syncNow);
  const retryMutation = useOfflineStore((state) => state.retryMutation);
  const clearQueue = useOfflineStore((state) => state.clearQueue);
  const { showToast } = useToast();

  const handleSyncAll = async () => {
    const report = await syncNow();
    showToast({
      message: `Sync completed: ${report.successCount} succeeded, ${report.failedCount} failed`,
      type: report.failedCount === 0 ? 'success' : 'warning',
    });
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Offline Sync Queue 🔄">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Bar */}
        <View style={[styles.statusBar, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
          <View style={{ flex: 1 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              {isOnline ? '🌐 Connected Online' : '⚡ Disconnected (Offline)'}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              {queuedMutations.length} pending mutations awaiting sync
            </Typography>
          </View>

          {queuedMutations.length > 0 && (
            <Button
              label={isSyncing ? 'Syncing...' : 'Sync All'}
              variant="primary"
              size="sm"
              onPress={handleSyncAll}
              disabled={isSyncing || !isOnline}
            />
          )}
        </View>

        {/* Mutations List */}
        {queuedMutations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              ✓
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              Sync Queue Empty
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              All posts, comments, reactions, and direct messages are synced with cloud servers.
            </Typography>
          </View>
        ) : (
          queuedMutations.map((item) => (
            <View
              key={item.id}
              style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.md }]}
            >
              <View style={styles.itemHeader}>
                <Typography variant="subtitle2" color={colors.primary} bold>
                  {item.type}
                </Typography>
                <SyncStatusBadge
                  status={item.status}
                  onRetry={() => retryMutation(item.id)}
                />
              </View>

              <Typography variant="caption" color={colors.textSecondary} numberOfLines={2} style={{ marginTop: 4 }}>
                Payload: {JSON.stringify(item.payload)}
              </Typography>

              <View style={styles.itemFooter}>
                <Typography variant="caption" color={colors.textMuted} style={{ fontSize: 10 }}>
                  Retries: {item.retryCount}/{item.maxRetries} • {item.endpoint}
                </Typography>
              </View>
            </View>
          ))
        )}

        {queuedMutations.length > 0 && (
          <Button
            label="Clear Offline Queue"
            variant="ghost"
            size="sm"
            onPress={() => {
              clearQueue();
              showToast({ message: 'Sync queue cleared', type: 'info' });
            }}
            fullWidth
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>
    </Modal>
  );
};

export const OfflineSyncModal = memo(OfflineSyncModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 10,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  itemCard: {
    padding: 12,
    borderWidth: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemFooter: {
    marginTop: 4,
  },
});
