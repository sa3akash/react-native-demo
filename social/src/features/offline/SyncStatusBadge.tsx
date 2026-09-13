import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Typography } from '../../shared/components';

export type SyncStatus = 'pending' | 'syncing' | 'completed' | 'failed';

export interface SyncStatusBadgeProps {
  status: SyncStatus;
  onRetry?: () => void;
}

const SyncStatusBadgeComponent: React.FC<SyncStatusBadgeProps> = ({
  status,
  onRetry,
}) => {
  if (status === 'completed') {
    return (
      <View style={[styles.badge, { backgroundColor: '#34C75920' }]}>
        <Typography variant="caption" color="#34C759" bold style={{ fontSize: 9 }}>
          ✓ SYNCED
        </Typography>
      </View>
    );
  }

  if (status === 'syncing') {
    return (
      <View style={[styles.badge, { backgroundColor: '#0A84FF20' }]}>
        <Typography variant="caption" color="#0A84FF" bold style={{ fontSize: 9 }}>
          🔄 SYNCING...
        </Typography>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRetry}
        style={[styles.badge, { backgroundColor: '#FF3B3020' }]}
      >
        <Typography variant="caption" color="#FF3B30" bold style={{ fontSize: 9 }}>
          ✕ FAILED (RETRY 🔄)
        </Typography>
      </TouchableOpacity>
    );
  }

  // Pending
  return (
    <View style={[styles.badge, { backgroundColor: '#FF950020' }]}>
      <Typography variant="caption" color="#FF9500" bold style={{ fontSize: 9 }}>
        ⏳ PENDING SYNC
      </Typography>
    </View>
  );
};

export const SyncStatusBadge = memo(SyncStatusBadgeComponent);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});
