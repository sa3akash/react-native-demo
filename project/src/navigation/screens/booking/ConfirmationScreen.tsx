/**
 * GoSeat Navigation System - ConfirmationScreen (Digital Boarding Pass)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { Button } from '../../../design-system/components/Button';
import { Divider } from '../../../design-system/components/Divider';
import { Icon } from '../../../design-system/components/Icon';
import { BookingScreenProps } from '../../types';

export const ConfirmationScreen: React.FC<BookingScreenProps<'Confirmation'>> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);
  const { bookingId, busName, seats, totalAmount, passengerName } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.successHeader}>
          <View style={styles.checkBadge}>
            <Icon name="Check" size={32} color={theme.colors.raw.greyscale['0']} />
          </View>
          <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
            Booking Confirmed!
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted} align="center">
            Your bus ticket has been issued successfully.
          </Text>
        </View>

        <Card variant="elevated" elevation="large" padding="xl" style={styles.passCard}>
          <View style={styles.passHeader}>
            <Badge label="BOARDING PASS" variant="primary" icon="Travel" />
            <Text variant="title2" color={theme.colors.primary} weight="semibold">
              #{bookingId}
            </Text>
          </View>

          <Text variant="h3" color={theme.colors.textPrimary} weight="semibold" style={styles.busTitle}>
            {busName}
          </Text>

          <Divider spacing="md" />

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text variant="helper1" color={theme.colors.textMuted}>PASSENGER</Text>
              <Text variant="title2" color={theme.colors.textPrimary} weight="semibold">{passengerName}</Text>
            </View>
            <View style={[styles.infoCol, styles.alignRight]}>
              <Text variant="helper1" color={theme.colors.textMuted}>SEATS</Text>
              <Text variant="title2" color={theme.colors.primary} weight="semibold">{seats.join(', ')}</Text>
            </View>
          </View>

          <Divider spacing="md" />

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text variant="helper1" color={theme.colors.textMuted}>TOTAL FARE PAID</Text>
              <Text variant="title1" color={theme.colors.textPrimary} weight="semibold">${totalAmount}.00</Text>
            </View>
            <View style={[styles.infoCol, styles.alignRight]}>
              <Text variant="helper1" color={theme.colors.textMuted}>STATUS</Text>
              <Badge label="PAID & CONFIRMED" variant="success" size="small" />
            </View>
          </View>

          <Divider spacing="lg" />

          {/* Simulated Boarding QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <Icon name="Scan" size={64} color={theme.colors.textPrimary} />
            </View>
            <Text variant="helper1" color={theme.colors.textMuted} style={styles.qrText}>
              Scan at boarding gate
            </Text>
          </View>
        </Card>

        <Button
          title="View My Boarding Passes"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => navigation.navigate('Main', { screen: 'MyTickets' } as any)}
          style={styles.doneBtn}
        />

        <Button
          title="Back to Home Dashboard"
          variant="ghost"
          size="medium"
          fullWidth
          onPress={() => navigation.navigate('Main', { screen: 'Home' } as any)}
        />
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
    successHeader: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    checkBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    passCard: {
      marginBottom: theme.spacing.xl,
    },
    passHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    busTitle: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    infoGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoCol: {
      flex: 1,
    },
    alignRight: {
      alignItems: 'flex-end',
    },
    qrContainer: {
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    qrBox: {
      width: 100,
      height: 100,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSecondary,
    },
    qrText: {
      marginTop: 8,
    },
    doneBtn: {
      marginBottom: theme.spacing.sm,
    },
  });
