/**
 * GoSeat Navigation System - SearchScreen (Bus Search Results)
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
import { MainTabScreenProps } from '../../types';

export const SearchScreen: React.FC<MainTabScreenProps<'Search'>> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const origin = route.params?.origin || 'New York, NY';
  const destination = route.params?.destination || 'Boston, MA';

  const results = [
    {
      id: 'BUS-201',
      name: 'GoSeat Express',
      time: '07:30 AM',
      duration: '4h 15m',
      price: 42,
    },
    {
      id: 'BUS-202',
      name: 'Royal Coach',
      time: '09:15 AM',
      duration: '4h 30m',
      price: 49,
    },
    {
      id: 'BUS-203',
      name: 'City Shuttle',
      time: '01:00 PM',
      duration: '4h 45m',
      price: 39,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text variant="h2" color={theme.colors.textPrimary} weight="semibold" style={styles.title}>
          Search Results
        </Text>
        <Text variant="paragraph" color={theme.colors.textMuted} style={styles.subtitle}>
          {origin} → {destination}
        </Text>

        <View style={styles.filterRow}>
          <Badge label="Earliest" variant="primary" style={styles.filterTag} />
          <Badge label="Cheapest" variant="secondary" style={styles.filterTag} />
          <Badge label="Fastest" variant="neutral" style={styles.filterTag} />
        </View>

        {results.map((bus) => (
          <Card key={bus.id} variant="elevated" elevation="small" padding="lg" style={styles.busCard}>
            <View style={styles.cardHeader}>
              <Text variant="h3" color={theme.colors.textPrimary} weight="semibold">
                {bus.name}
              </Text>
              <Text variant="h3" color={theme.colors.primary} weight="semibold">
                ${bus.price}.00
              </Text>
            </View>

            <View style={styles.timeRow}>
              <Text variant="title1" color={theme.colors.textPrimary}>{bus.time}</Text>
              <Badge label={bus.duration} variant="neutral" size="small" />
            </View>

            <Button
              title="Select Seat"
              variant="outline"
              size="medium"
              fullWidth
              rightIcon="ArrowRight"
              style={styles.selectBtn}
              onPress={() =>
                navigation.navigate('Booking', {
                  screen: 'SeatSelection',
                  params: {
                    busId: bus.id,
                    busName: bus.name,
                    origin,
                    destination,
                    departureTime: bus.time,
                    pricePerSeat: bus.price,
                  },
                })
              }
            />
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
      marginBottom: theme.spacing.md,
    },
    filterRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    filterTag: {
      marginRight: 8,
    },
    busCard: {
      marginBottom: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: theme.spacing.sm,
    },
    selectBtn: {
      marginTop: theme.spacing.xs,
    },
  });
