/**
 * GoSeat Navigation System - Top-Level Imperative Navigation Ref Container
 * Allows triggering navigation actions outside React components (e.g. API interceptors, notification handlers).
 */

import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/root';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Imperatively navigate to any screen from anywhere in the app codebase.
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}
