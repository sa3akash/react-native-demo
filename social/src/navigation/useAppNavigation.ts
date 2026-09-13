import { useNavigation, useRoute } from '@react-navigation/native';
import type { AppNavigationProp, AppRouteProp, RootStackParamList } from './types';
import { NavigationShortcuts } from './NavigationShortcuts';

/**
 * Fully typed navigation hook for the root stack
 */
export function useAppNavigation(): AppNavigationProp {
  return useNavigation<AppNavigationProp>();
}

/**
 * Fully typed route hook for any screen in the root stack
 */
export function useAppRoute<RouteName extends keyof RootStackParamList>(): AppRouteProp<RouteName> {
  return useRoute<AppRouteProp<RouteName>>();
}

/**
 * Hook providing all domain-driven navigation shortcut actions directly
 */
export function useNavShortcuts() {
  return NavigationShortcuts;
}
