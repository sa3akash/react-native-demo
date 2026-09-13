/**
 * GoSeat Navigation System - PassengerInfoScreen
 */

import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Input } from '../../../design-system/components/Input';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { BookingScreenProps } from '../../types';

export const PassengerInfoScreen: React.FC<BookingScreenProps<'PassengerInfo'>> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);
  const { busName, selectedSeats, totalAmount } = route.params;

  const [passengerName, setPassengerName] = useState('John Doe');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Confirmation', {
        bookingId: `GS-${Math.floor(10000 + Math.random() * 90000)}`,
        busName,
        seats: selectedSeats,
        totalAmount,
        passengerName,
        qrCodeData: `GOSEAT-PASS-${Date.now()}`,
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
        <Text variant="h2" color={theme.colors.textPrimary} weight="semibold" style={styles.title}>
          Passenger Details
        </Text>
        <Text variant="paragraph" color={theme.colors.textMuted} style={styles.subtitle}>
          Booking {selectedSeats.length} seat(s): {selectedSeats.join(', ')} (${totalAmount}.00)
        </Text>

        <Card variant="elevated" elevation="medium" padding="xl">
          <Input
            label="Primary Passenger Name"
            placeholder="Full Name"
            leftIcon="User"
            value={passengerName}
            onChangeText={setPassengerName}
          />

          <Input
            label="Phone Number (for SMS Alerts)"
            placeholder="+1 555-000-0000"
            leftIcon="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title="Pay & Confirm Booking"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onPress={handleConfirmBooking}
            style={styles.payBtn}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollBody: {
      padding: theme.spacing.lg,
    },
    title: {
      marginBottom: 2,
    },
    subtitle: {
      marginBottom: theme.spacing.xl,
    },
    payBtn: {
      marginTop: theme.spacing.md,
    },
  });
