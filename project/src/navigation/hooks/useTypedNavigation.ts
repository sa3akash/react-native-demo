/**
 * GoSeat Navigation System - Strongly-Typed Navigation Hook
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/root';

export function useTypedNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
