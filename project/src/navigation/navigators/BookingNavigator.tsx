/**
 * GoSeat Navigation System - Booking Flow Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../design-system/theme/ThemeContext';
import { BookingStackParamList } from '../types/booking';
import { SeatSelectionScreen } from '../screens/booking/SeatSelectionScreen';
import { PassengerInfoScreen } from '../screens/booking/PassengerInfoScreen';
import { ConfirmationScreen } from '../screens/booking/ConfirmationScreen';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export const BookingNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="SeatSelection"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="SeatSelection"
        component={SeatSelectionScreen}
        options={{ title: 'Select Seats' }}
      />
      <Stack.Screen
        name="PassengerInfo"
        component={PassengerInfoScreen}
        options={{ title: 'Passenger Info' }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ title: 'Boarding Pass', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
};
