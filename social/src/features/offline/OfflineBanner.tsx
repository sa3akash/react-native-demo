import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button } from '../../shared/components';
import { useOfflineStore } from '../../store/useOfflineStore';

export interface OfflineBannerProps {
  onPressQueue?: () => void;
}

const OfflineBannerComponent: React.FC<OfflineBannerProps> = ({ onPressQueue }) => {
  const { colors, theme } = useTheme();
  const isOnline = useOfflineStore((state) => state.isOnline);
  const isSyncing = useOfflineStore((state) => state.isSyncing);
  const queuedMutations = useOfflineStore((state) => state.queuedMutations);
  const syncNow = useOfflineStore((state) => state.syncNow);

  const isRTL = I18nManager.isRTL;

  if (isOnline && queuedMutations.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.bannerContainer,
        {
          backgroundColor: !isOnline ? '#FF9500' : colors.primary,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <View style={styles.textCol}>
        <Typography variant="caption" color="#FFFFFF" bold>
          {!isOnline ? '⚡ OFFLINE MODE ACTIVE' : '🔄 SYNCING QUEUED MUTATIONS'}
        </Typography>
        <Typography variant="caption" color="#FFFFFF" style={{ fontSize: 11 }}>
          {queuedMutations.length > 0
            ? `${queuedMutations.length} pending items (posts, comments, DMs) queued`
            : 'Changes will sync automatically once network returns'}
        </Typography>
      </View>

      <View style={styles.btnRow}>
        {queuedMutations.length > 0 && isOnline && (
          <TouchableOpacity
            onPress={() => syncNow()}
            disabled={isSyncing}
            style={styles.syncBtn}
          >
            <Typography variant="caption" color="#FFFFFF" bold>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Typography>
          </TouchableOpacity>
        )}

        {onPressQueue && (
          <TouchableOpacity onPress={onPressQueue} style={styles.queueBtn}>
            <Typography variant="caption" color="#FFFFFF" bold>
              Queue ({queuedMutations.length})
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const OfflineBanner = memo(OfflineBannerComponent);

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  queueBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
});
