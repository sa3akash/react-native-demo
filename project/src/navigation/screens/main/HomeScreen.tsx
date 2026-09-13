/**
 * GoSeat Navigation System - HomeScreen (Bus Search Dashboard)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Input } from '../../../design-system/components/Input';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { Divider } from '../../../design-system/components/Divider';
import { Icon } from '../../../design-system/components/Icon';
import { MainTabScreenProps } from '../../types';

interface FeaturedBusRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  time: string;
  price: number;
  seatsLeft: number;
  tag: string;
}

const FEATURED_ROUTES: FeaturedBusRoute[] = [
  {
    id: 'BUS-101',
    name: 'GreenLine Express',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    time: '08:00 AM',
    price: 45,
    seatsLeft: 12,
    tag: 'EXPRESS',
  },
  {
    id: 'BUS-102',
    name: 'Megabus Luxury',
    origin: 'Chicago, IL',
    destination: 'Detroit, MI',
    time: '10:30 AM',
    price: 38,
    seatsLeft: 8,
    tag: 'LUXURY',
  },
  {
    id: 'BUS-103',
    name: 'FlixBus Nightline',
    origin: 'Los Angeles, CA',
    destination: 'San Francisco, CA',
    time: '11:00 PM',
    price: 52,
    seatsLeft: 18,
    tag: 'OVERNIGHT',
  },
];

export const HomeScreen: React.FC<MainTabScreenProps<'Home'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const [origin, setOrigin] = useState('New York, NY');
  const [destination, setDestination] = useState('Boston, MA');

  const handleSearch = () => {
    navigation.navigate('Search', { origin, destination });
  };

  const handleSelectRoute = (route: FeaturedBusRoute) => {
    navigation.navigate('Booking', {
      screen: 'SeatSelection',
      params: {
        busId: route.id,
        busName: route.name,
        origin: route.origin,
        destination: route.destination,
        departureTime: route.time,
        pricePerSeat: route.price,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="helper1" color={theme.colors.primary} weight="semibold">
              GOOD DAY!
            </Text>
            <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
              Where to next?
            </Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Icon name="User" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Card */}
        <Card variant="elevated" elevation="medium" padding="xl" style={styles.searchCard}>
          <Input
            label="From"
            placeholder="Origin city"
            leftIcon="Location"
            value={origin}
            onChangeText={setOrigin}
          />

          <View style={styles.swapRow}>
            <Divider spacing="md" style={styles.dividerFlex} />
            <TouchableOpacity style={styles.swapCircle}>
              <Icon name="ArrowDown" size={16} color={theme.colors.raw.greyscale['0']} />
            </TouchableOpacity>
          </View>

          <Input
            label="To"
            placeholder="Destination city"
            leftIcon="Location"
            value={destination}
            onChangeText={setDestination}
          />

          <Button
            title="Search Available Buses"
            variant="primary"
            size="large"
            fullWidth
            leftIcon="Search"
            onPress={handleSearch}
            style={styles.searchBtn}
          />
        </Card>

        {/* Featured Express Routes */}
        <View style={styles.sectionHeader}>
          <Text variant="title1" color={theme.colors.textPrimary} weight="semibold">
            Featured Express Routes
          </Text>
          <Text variant="helper1" color={theme.colors.primary} weight="semibold">
            VIEW ALL
          </Text>
        </View>

        {FEATURED_ROUTES.map((route) => (
          <Card
            key={route.id}
            variant="elevated"
            elevation="small"
            padding="lg"
            style={styles.routeCard}
            onPress={() => handleSelectRoute(route)}
          >
            <View style={styles.cardHeader}>
              <Badge label={route.tag} variant="primary" icon="Travel" />
              <Text variant="h3" color={theme.colors.primary} weight="semibold">
                ${route.price}.00
              </Text>
            </View>

            <Text variant="h3" color={theme.colors.textPrimary} weight="semibold" style={styles.routeName}>
              {route.name}
            </Text>

            <View style={styles.routeDetails}>
              <Text variant="paragraph" color={theme.colors.textSecondary}>
                {route.origin} → {route.destination}
              </Text>
              <Badge label={`${route.seatsLeft} Seats Left`} variant="success" size="small" />
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
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    profileBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchCard: {
      marginBottom: theme.spacing.xl,
    },
    swapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.xs,
    },
    dividerFlex: {
      flex: 1,
    },
    swapCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    searchBtn: {
      marginTop: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    routeCard: {
      marginBottom: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    routeName: {
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    routeDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
