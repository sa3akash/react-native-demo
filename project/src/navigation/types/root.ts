/**
 * GoSeat Navigation System - Root Stack Types & Global Declaration
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from './auth';
import { MainTabParamList } from './main';
import { BookingStackParamList } from './booking';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Booking: NavigatorScreenParams<BookingStackParamList>;
  DesignSystemShowcase: undefined;
};

// Global TypeScript Declaration for automatic autocomplete across the entire application
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
