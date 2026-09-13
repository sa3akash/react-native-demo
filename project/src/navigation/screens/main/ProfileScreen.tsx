/**
 * GoSeat Navigation System - ProfileScreen (Theme & Account Settings)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { Button } from '../../../design-system/components/Button';
import { Divider } from '../../../design-system/components/Divider';
import { Icon } from '../../../design-system/components/Icon';
import { MainTabScreenProps } from '../../types';

export const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = ({ navigation }) => {
  const { theme, mode, setMode } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <Card variant="elevated" elevation="small" padding="xl" style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Icon name="User" size={32} color={theme.colors.raw.greyscale['0']} />
          </View>
          <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
            John Doe
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted}>
            user@goseat.com
          </Text>
          <Badge label="VERIFIED PASSENGER" variant="success" size="small" style={styles.verifiedBadge} />
        </Card>

        {/* Theme Settings Section */}
        <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.sectionTitle}>
          Appearance & Theme Mode
        </Text>

        <Card variant="outlined" padding="lg" style={styles.themeCard}>
          {[
            { id: 'system', label: 'System Default', subtitle: 'Sync with device settings', icon: 'Theme' as const },
            { id: 'light', label: 'Light Theme', subtitle: 'Clean & crisp bright UI', icon: 'Lightmode' as const },
            { id: 'dark', label: 'Dark Theme', subtitle: 'Sleek night mode UI', icon: 'Darkmode' as const },
          ].map((item, idx, arr) => {
            const isSelected = mode === item.id;
            return (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.themeOptionRow}
                  onPress={() => setMode(item.id as any)}
                >
                  <Icon name={item.icon} size={20} color={isSelected ? theme.colors.primary : theme.colors.textMuted} />
                  <View style={styles.themeTextContainer}>
                    <Text
                      variant="title2"
                      color={isSelected ? theme.colors.primary : theme.colors.textPrimary}
                      weight={isSelected ? 'semibold' : 'medium'}
                    >
                      {item.label}
                    </Text>
                    <Text variant="helper1" color={theme.colors.textMuted}>
                      {item.subtitle}
                    </Text>
                  </View>
                  {isSelected && <Icon name="Check" size={20} color={theme.colors.primary} />}
                </TouchableOpacity>
                {idx < arr.length - 1 && <Divider spacing="sm" />}
              </React.Fragment>
            );
          })}
        </Card>

        {/* Design System UI Kit Link */}
        <Button
          title="Open UI Kit Component Showcase"
          variant="outline"
          size="medium"
          fullWidth
          leftIcon="Star"
          onPress={() => navigation.navigate('Showcase')}
          style={styles.showcaseBtn}
        />

        <Button
          title="Log Out"
          variant="danger"
          size="large"
          fullWidth
          leftIcon="User"
          onPress={() => navigation.replace('Auth', { screen: 'Login' })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollBody: {
      padding: theme.spacing.lg,
    },
    userCard: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatarCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    verifiedBadge: {
      marginTop: theme.spacing.sm,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    themeCard: {
      marginBottom: theme.spacing.xl,
    },
    themeOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    themeTextContainer: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    showcaseBtn: {
      marginBottom: theme.spacing.md,
    },
  });
