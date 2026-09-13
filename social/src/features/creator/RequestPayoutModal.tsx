import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button } from '../../shared/components';
import { useCreatorStore } from '../../store/useCreatorStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface RequestPayoutModalProps {
  visible: boolean;
  onClose: () => void;
}

const RequestPayoutModalComponent: React.FC<RequestPayoutModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const availableBalance = useCreatorStore((state) => state.revenue.availableBalance);
  const payoutMethod = useCreatorStore((state) => state.monetization.payoutMethod);
  const requestPayout = useCreatorStore((state) => state.requestPayout);
  const { showToast } = useToast();

  const [amount, setAmount] = useState(availableBalance.toString());

  const handleTransfer = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > availableBalance) {
      showToast({ message: 'Please enter a valid payout amount.', type: 'warning' });
      return;
    }

    requestPayout(num);
    showToast({
      message: `Payout of $${num.toLocaleString()} initiated! 💸`,
      type: 'success',
    });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Request Payout 💸">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Available Balance Box */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.lg }]}>
          <Typography variant="caption" color={colors.textSecondary} bold>
            AVAILABLE FOR PAYOUT
          </Typography>
          <Typography variant="h1" color={colors.primary} bold style={{ marginVertical: 4 }}>
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
          <Typography variant="caption" color={colors.textMuted}>
            Processed via Stripe Express • 0% Platform Fee
          </Typography>
        </View>

        {/* Amount Input */}
        <View style={{ marginTop: 8 }}>
          <Input
            label="Payout Amount ($ USD)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>

        {/* Payout Destination */}
        <View style={[styles.methodCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.md }]}>
          <Typography variant="caption" color={colors.textSecondary} bold>
            PAYOUT DESTINATION
          </Typography>
          <View style={styles.methodRow}>
            <Typography variant="body1">🏦</Typography>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                {payoutMethod.provider} (•••• {payoutMethod.accountLast4})
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Account Holder: {payoutMethod.accountHolder}
              </Typography>
            </View>
            <Typography variant="caption" color={colors.success} bold>
              ✓ Verified
            </Typography>
          </View>
        </View>

        <Button
          label={`Transfer $${parseFloat(amount || '0').toLocaleString()} to Bank`}
          variant="primary"
          size="lg"
          onPress={handleTransfer}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const RequestPayoutModal = memo(RequestPayoutModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 10,
  },
  balanceCard: {
    padding: 16,
    alignItems: 'center',
  },
  methodCard: {
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
