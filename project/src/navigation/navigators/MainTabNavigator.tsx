/**
 * GoSeat Navigation System - Main Bottom Tab Navigator with GoSeat UI Styling
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../design-system/theme/ThemeContext';
import { useStyles } from '../../design-system/hooks/useStyles';
import { Theme } from '../../design-system/theme/types';
import { Text } from '../../design-system/components/Text';
import { Icon, IconName } from '../../design-system/components/Icon';
import { MainTabParamList } from '../types/main';
import { HomeScreen } from '../screens/main/HomeScreen';
import { SearchScreen } from '../screens/main/SearchScreen';
import { TicketsScreen } from '../screens/main/TicketsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { DesignSystemShowcase } from '../../design-system/showcase/DesignSystemShowcase';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIconMap: Record<keyof MainTabParamList, { active: IconName; label: string }> = {
  Home: { active: 'Home', label: 'Home' },
  Search: { active: 'Search', label: 'Search' },
  MyTickets: { active: 'Travel', label: 'Tickets' },
  Profile: { active: 'User', label: 'Profile' },
  Showcase: { active: 'Star', label: 'UI Kit' },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const routeName = route.name as keyof MainTabParamList;
        const config = tabIconMap[routeName];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const activeColor = isFocused ? theme.colors.primary : theme.colors.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon name={config.active} size={22} color={activeColor} />
            <Text
              variant="helper2"
              color={activeColor}
              weight={isFocused ? 'semibold' : 'regular'}
              style={styles.tabLabel}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyTickets" component={TicketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Showcase" component={DesignSystemShowcase} />
    </Tab.Navigator>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      height: theme.responsive.verticalScale(64),
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    tabItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabLabel: {
      marginTop: 2,
    },
  });
