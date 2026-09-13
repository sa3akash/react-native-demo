import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Button } from '../../shared/components';
import { UserTicketPass } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface UserTicketPassModalProps {
  visible: boolean;
  pass: UserTicketPass | null;
  onClose: () => void;
}

const UserTicketPassModalComponent: React.FC<UserTicketPassModalProps> = ({
  visible,
  pass,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const { showToast } = useToast();

  if (!pass) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="Digital Event Pass 🎟️">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pass Card */}
        <View style={[styles.passContainer, { backgroundColor: colors.surface, borderRadius: theme.radius.xl, borderColor: colors.borderSubtle }]}>
          {/* Header */}
          <View style={[styles.passHeader, { backgroundColor: colors.primary }]}>
            <Typography variant="caption" color="#FFFFFF" bold style={{ letterSpacing: 1.2 }}>
              OFFICIAL ADMISSION PASS
            </Typography>
            <Typography variant="subtitle1" color="#FFFFFF" bold style={{ marginTop: 4, textAlign: 'center' }}>
              {pass.eventTitle}
            </Typography>
          </View>

          {/* Pass Body */}
          <View style={styles.passBody}>
            {/* QR Code Container */}
            <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF', borderRadius: theme.radius.md }]}>
              {/* ASCII simulated QR Box */}
              <View style={styles.simulatedQR}>
                <Typography variant="h1" style={{ fontSize: 72 }}>
                  🏁
                </Typography>
                <Typography variant="caption" color="#000000" bold style={{ fontSize: 9, marginTop: 4 }}>
                  {pass.qrCode}
                </Typography>
              </View>
            </View>

            {/* Attendee Details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCol}>
                <Typography variant="caption" color={colors.textSecondary}>
                  ATTENDEE
                </Typography>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {pass.attendeeName}
                </Typography>
              </View>

              <View style={styles.detailCol}>
                <Typography variant="caption" color={colors.textSecondary}>
                  TIER
                </Typography>
                <Typography variant="subtitle2" color={colors.primary} bold>
                  {pass.ticketTier}
                </Typography>
              </View>
            </View>

            <View style={[styles.venueBox, { backgroundColor: colors.inputBg, borderRadius: theme.radius.md }]}>
              <Typography variant="caption" color={colors.textSecondary}>
                LOCATION / LINK
              </Typography>
              <Typography variant="caption" color={colors.text} bold style={{ marginTop: 2 }}>
                📍 {pass.venueOrLink}
              </Typography>
            </View>
          </View>
        </View>

        {/* Apple / Google Wallet Action */}
        <Button
          label="Add to Apple / Google Wallet 📲"
          variant="ghost"
          size="md"
          onPress={() => showToast({ message: 'Pass added to Wallet! 💳', type: 'success' })}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const UserTicketPassModal = memo(UserTicketPassModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  passContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  passHeader: {
    padding: 16,
    alignItems: 'center',
  },
  passBody: {
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  qrContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  simulatedQR: {
    alignItems: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  detailCol: {
    flex: 1,
  },
  venueBox: {
    width: '100%',
    padding: 12,
  },
});
