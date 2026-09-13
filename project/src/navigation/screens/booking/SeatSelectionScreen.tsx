/**
 * GoSeat Navigation System - SeatSelectionScreen (Interactive Seat Layout)
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Icon } from '../../../design-system/components/Icon';
import { BookingScreenProps } from '../../types';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEAT_COLS = [1, 2, 3, 4];
const BOOKED_SEATS = ['A1', 'B4', 'C2', 'D1'];

export const SeatSelectionScreen: React.FC<BookingScreenProps<'SeatSelection'>> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);
  const { busId, busName, origin, destination, pricePerSeat } = route.params;

  const [selectedSeats, setSelectedSeats] = useState<string[]>(['B2']);

  const toggleSeat = (seatId: string) => {
    if (BOOKED_SEATS.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalAmount = selectedSeats.length * pricePerSeat;

  const handleNext = () => {
    if (selectedSeats.length === 0) return;
    navigation.navigate('PassengerInfo', {
      busId,
      busName,
      selectedSeats,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Route Header */}
        <View style={styles.headerInfo}>
          <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
            {busName}
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted}>
            {origin} → {destination} (${pricePerSeat}/seat)
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, styles.availableSquare]} />
            <Text variant="helper1" color={theme.colors.textSecondary}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, styles.selectedSquare]} />
            <Text variant="helper1" color={theme.colors.textSecondary}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, styles.bookedSquare]} />
            <Text variant="helper1" color={theme.colors.textSecondary}>Booked</Text>
          </View>
        </View>

        {/* Bus Layout Container */}
        <Card variant="outlined" padding="lg" style={styles.busLayoutCard}>
          {/* Driver Cabin */}
          <View style={styles.driverCabin}>
            <Icon name="Travel" size={24} color={theme.colors.textMuted} />
            <Text variant="helper2" color={theme.colors.textMuted}>DRIVER CABIN</Text>
          </View>

          {/* Seat Rows */}
          {SEAT_ROWS.map((row) => (
            <View key={row} style={styles.seatRow}>
              {SEAT_COLS.map((col, idx) => {
                const seatId = `${row}${col}`;
                const isBooked = BOOKED_SEATS.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <React.Fragment key={seatId}>
                    {idx === 2 && <View style={styles.aisleSpacer} />}
                    <TouchableOpacity
                      disabled={isBooked}
                      onPress={() => toggleSeat(seatId)}
                      style={[
                        styles.seatBox,
                        isBooked && styles.seatBooked,
                        isSelected && styles.seatSelected,
                      ]}
                    >
                      <Text
                        variant="helper1"
                        color={
                          isSelected
                            ? theme.colors.raw.greyscale['0']
                            : isBooked
                            ? theme.colors.textDisabled
                            : theme.colors.textPrimary
                        }
                        weight="semibold"
                      >
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          ))}
        </Card>

        {/* Footer Summary */}
        <Card variant="elevated" elevation="medium" padding="lg" style={styles.footerCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text variant="helper1" color={theme.colors.textMuted}>SELECTED SEATS</Text>
              <Text variant="title1" color={theme.colors.primary} weight="semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text variant="helper1" color={theme.colors.textMuted}>TOTAL FARE</Text>
              <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
                ${totalAmount}.00
              </Text>
            </View>
          </View>

          <Button
            title="Continue to Passenger Details"
            variant="primary"
            size="large"
            fullWidth
            disabled={selectedSeats.length === 0}
            rightIcon="ArrowRight"
            onPress={handleNext}
            style={styles.nextBtn}
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
    headerInfo: {
      marginBottom: theme.spacing.md,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.lg,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendSquare: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginRight: 6,
    },
    availableSquare: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedSquare: {
      backgroundColor: theme.colors.primary,
    },
    bookedSquare: {
      backgroundColor: theme.colors.textDisabled,
    },
    busLayoutCard: {
      marginBottom: theme.spacing.lg,
    },
    driverCabin: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    seatRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    seatBox: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 6,
    },
    seatSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    seatBooked: {
      backgroundColor: theme.colors.border,
      borderColor: theme.colors.border,
    },
    aisleSpacer: {
      width: 32,
    },
    footerCard: {
      marginTop: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    alignRight: {
      alignItems: 'flex-end',
    },
    nextBtn: {
      marginTop: theme.spacing.xs,
    },
  });
