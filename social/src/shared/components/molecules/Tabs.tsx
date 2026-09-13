import React, { memo } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';
import { Badge } from '../atoms/Avatar';

export interface TabItem {
  id: string;
  label: string;
  badgeCount?: number;
  icon?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  scrollable = false,
  style,
}) => {
  const { colors } = useTheme();

  const content = (
    <View
      style={[styles.tabBar, { borderBottomColor: colors.borderSubtle }, style]}
      accessible={true}
      accessibilityRole="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onTabChange(tab.id)}
            style={[
              styles.tabItem,
              isActive && { borderBottomColor: colors.primary, borderBottomWidth: 3 },
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View style={styles.tabContentRow}>
              {tab.icon && (
                <Typography variant="body1" style={styles.tabIcon}>
                  {tab.icon}
                </Typography>
              )}
              <Typography
                variant="subtitle2"
                color={isActive ? colors.primary : colors.textSecondary}
                bold={isActive}
              >
                {tab.label}
              </Typography>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <View style={styles.badgeWrapper}>
                  <Badge count={tab.badgeCount} variant="danger" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {content}
      </ScrollView>
    );
  }

  return content;
};

export const Tabs = memo(TabsComponent);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  badgeWrapper: {
    marginLeft: 6,
  },
});
