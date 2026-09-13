/**
 * GoSeat Navigation System - Composite Screen Props & Types Barrel Export
 */

import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './root';
import { AuthStackParamList } from './auth';
import { MainTabParamList } from './main';
import { BookingStackParamList } from './booking';

export * from './root';
export * from './auth';
export * from './main';
export * from './booking';

// Helper Type for Root Stack Screens
export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Helper Type for Auth Stack Screens
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Helper Type for Main Bottom Tab Screens
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Helper Type for Booking Stack Screens
export type BookingScreenProps<T extends keyof BookingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BookingStackParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
