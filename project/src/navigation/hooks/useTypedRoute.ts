/**
 * GoSeat Navigation System - Strongly-Typed Route Hook
 */

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/root';

export function useTypedRoute<RouteName extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, RouteName>>();
}
