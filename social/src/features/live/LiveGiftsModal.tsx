import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, Button } from '../../shared/components';
import { useLiveStreamStore, VIRTUAL_GIFT_CATALOG, VirtualGift } from '../../store/useLiveStreamStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface LiveGiftsModalProps {
  visible: boolean;
  onClose: () => void;
}

const LiveGiftsModalComponent: React.FC<LiveGiftsModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const sendGift = useLiveStreamStore((state) => state.sendGift);
  const totalCoins = useLiveStreamStore((state) => state.totalCoins);
  const { showToast } = useToast();

  const handleSendGift = (gift: VirtualGift) => {
    sendGift(gift.id);
    showToast({
      message: `Sent ${gift.emoji} ${gift.name} (${gift.coinPrice} coins) to host! 🎁`,
      type: 'success',
    });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Send Virtual Gift 🎁">
      <View style={styles.content}>
        {/* Coin Balance Bar */}
        <View style={[styles.balanceBar, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
          <View style={styles.coinInfo}>
            <Typography variant="body1">🪙</Typography>
            <Typography variant="subtitle2" color={colors.text} bold style={{ marginLeft: 6 }}>
              {totalCoins.toLocaleString()} Coins Available
            </Typography>
          </View>
          <Button
            label="+ Top Up"
            variant="primary"
            size="sm"
            onPress={() => showToast({ message: 'Coin recharge modal', type: 'info' })}
          />
        </View>

        {/* Gift Grid */}
        <View style={styles.giftGrid}>
          {VIRTUAL_GIFT_CATALOG.map((gift) => (
            <TouchableOpacity
              key={gift.id}
              activeOpacity={0.8}
              onPress={() => handleSendGift(gift)}
              style={[styles.giftCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.lg }]}
            >
              <Typography variant="h1" style={{ fontSize: 36, marginBottom: 4 }}>
                {gift.emoji}
              </Typography>
              <Typography variant="caption" color={colors.text} bold>
                {gift.name}
              </Typography>
              <Typography variant="caption" color={colors.primary} bold style={{ marginTop: 2 }}>
                🪙 {gift.coinPrice}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export const LiveGiftsModal = memo(LiveGiftsModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 14,
  },
  balanceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  giftCard: {
    width: '31%',
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});
