/**
 * GoSeat Navigation System - Root Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/root';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { BookingNavigator } from './BookingNavigator';
import { DesignSystemShowcase } from '../../design-system/showcase/DesignSystemShowcase';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Booking" component={BookingNavigator} />
      <Stack.Screen name="DesignSystemShowcase" component={DesignSystemShowcase} />
    </Stack.Navigator>
  );
};
