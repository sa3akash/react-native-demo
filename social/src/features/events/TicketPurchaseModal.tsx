import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Button } from '../../shared/components';
import { useEventStore, EventModel, UserTicketPass } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface TicketPurchaseModalProps {
  visible: boolean;
  event: EventModel;
  onClose: () => void;
  onSuccess?: (pass: UserTicketPass) => void;
}

const TicketPurchaseModalComponent: React.FC<TicketPurchaseModalProps> = ({
  visible,
  event,
  onClose,
  onSuccess,
}) => {
  const { colors, theme } = useTheme();
  const purchaseTicket = useEventStore((state) => state.purchaseTicket);
  const { showToast } = useToast();

  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.tickets[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);

  const selectedTier = event.tickets.find((t) => t.id === selectedTierId) || event.tickets[0];
  const totalPrice = (selectedTier?.price || 0) * quantity;

  const handleCheckout = () => {
    if (!selectedTier) return;
    const pass = purchaseTicket(event.id, selectedTier.id, quantity);
    showToast({
      message: `Ticket confirmed! Digital QR Pass added to your wallet 🎟️`,
      type: 'success',
    });
    onClose();
    onSuccess?.(pass);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Select Ticket Pass 🎟️">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Ticket Tiers */}
        {event.tickets.map((tier) => {
          const isSelected = selectedTierId === tier.id;

          return (
            <TouchableOpacity
              key={tier.id}
              activeOpacity={0.9}
              onPress={() => setSelectedTierId(tier.id)}
              style={[
                styles.tierCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.primary : colors.borderSubtle,
                  borderRadius: theme.radius.lg,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View style={styles.tierHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    {tier.name}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {tier.availableQuantity} spots remaining
                  </Typography>
                </View>
                <Typography variant="h3" color={colors.primary} bold>
                  {tier.price === 0 ? 'FREE' : `${tier.currency}${tier.price}`}
                </Typography>
              </View>

              {/* Perks */}
              <View style={styles.perksList}>
                {tier.perks.map((perk, idx) => (
                  <View key={idx} style={styles.perkRow}>
                    <Typography variant="caption" color={colors.primary} bold>
                      ✓
                    </Typography>
                    <Typography variant="caption" color={colors.text} style={{ marginLeft: 6 }}>
                      {perk}
                    </Typography>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Quantity Controls */}
        <View style={[styles.qtyRow, { borderTopColor: colors.borderSubtle, borderBottomColor: colors.borderSubtle }]}>
          <Typography variant="subtitle2" color={colors.text} bold>
            Quantity
          </Typography>
          <View style={styles.qtyBtnGroup}>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={[styles.qtyBtn, { backgroundColor: colors.surfaceElevated }]}
            >
              <Typography variant="body1" color={colors.text}>-</Typography>
            </TouchableOpacity>
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginHorizontal: 12 }}>
              {quantity}
            </Typography>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.min(10, q + 1))}
              style={[styles.qtyBtn, { backgroundColor: colors.surfaceElevated }]}
            >
              <Typography variant="body1" color={colors.text}>+</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Summary */}
        <View style={styles.summaryRow}>
          <Typography variant="subtitle1" color={colors.text} bold>
            Total Due:
          </Typography>
          <Typography variant="h2" color={colors.primary} bold>
            {totalPrice === 0 ? 'FREE' : `$${totalPrice.toLocaleString()}`}
          </Typography>
        </View>

        <Button
          label={totalPrice === 0 ? 'Claim Free Pass' : `Checkout $${totalPrice}`}
          variant="primary"
          size="lg"
          onPress={handleCheckout}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const TicketPurchaseModal = memo(TicketPurchaseModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 12,
  },
  tierCard: {
    padding: 14,
    gap: 8,
  },
  tierHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perksList: {
    marginTop: 4,
    gap: 4,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  qtyBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
