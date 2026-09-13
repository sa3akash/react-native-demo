/**
 * GoSeat Navigation System - TicketsScreen (Digital Boarding Passes)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { Divider } from '../../../design-system/components/Divider';
import { Icon } from '../../../design-system/components/Icon';
import { MainTabScreenProps } from '../../types';

export const TicketsScreen: React.FC<MainTabScreenProps<'MyTickets'>> = () => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const activeTickets = [
    {
      id: 'GS-88421',
      busName: 'GreenLine Express',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      date: 'Aug 15, 2026',
      time: '08:00 AM',
      seats: ['B2', 'B3'],
      status: 'CONFIRMED',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text variant="h2" color={theme.colors.textPrimary} weight="semibold" style={styles.title}>
          My Boarding Passes
        </Text>
        <Text variant="paragraph" color={theme.colors.textMuted} style={styles.subtitle}>
          Active upcoming bus journeys
        </Text>

        {activeTickets.map((ticket) => (
          <Card key={ticket.id} variant="elevated" elevation="medium" padding="xl" style={styles.ticketCard}>
            <View style={styles.cardHeader}>
              <Badge label={ticket.status} variant="success" icon="Check" />
              <Text variant="helper1" color={theme.colors.textMuted} weight="semibold">
                TICKET #{ticket.id}
              </Text>
            </View>

            <Text variant="h3" color={theme.colors.textPrimary} weight="semibold" style={styles.busName}>
              {ticket.busName}
            </Text>

            <View style={styles.routeRow}>
              <View style={styles.flex1}>
                <Text variant="h4" color={theme.colors.textPrimary} weight="semibold">{ticket.time}</Text>
                <Text variant="title2" color={theme.colors.textSecondary}>{ticket.origin}</Text>
              </View>
              <Icon name="ArrowRight" size={20} color={theme.colors.primary} />
              <View style={[styles.flex1, styles.alignRight]}>
                <Text variant="h4" color={theme.colors.textPrimary} weight="semibold">12:30 PM</Text>
                <Text variant="title2" color={theme.colors.textSecondary}>{ticket.destination}</Text>
              </View>
            </View>

            <Divider spacing="lg" />

            <View style={styles.footerRow}>
              <View>
                <Text variant="helper1" color={theme.colors.textMuted}>DEPARTURE DATE</Text>
                <Text variant="title2" color={theme.colors.textPrimary} weight="semibold">{ticket.date}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text variant="helper1" color={theme.colors.textMuted}>SEAT NUMBERS</Text>
                <Text variant="title2" color={theme.colors.primary} weight="semibold">{ticket.seats.join(', ')}</Text>
              </View>
            </View>
          </Card>
        ))}
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
    ticketCard: {
      marginBottom: theme.spacing.lg,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    busName: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flex1: {
      flex: 1,
    },
    alignRight: {
      alignItems: 'flex-end',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
