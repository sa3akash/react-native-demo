/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Interactive Design System Showcase Screen
 * Advanced Theme-Aware Styling via `useStyles(createStyles)`
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useStyles } from '../hooks/useStyles';
import { Theme } from '../theme/types';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Switch } from '../components/Switch';
import { Divider } from '../components/Divider';
import { Icon } from '../components/Icon';
import { ShadowElevation } from '../tokens/shadows';

type ShowcaseTab = 'colors' | 'typography' | 'shadows' | 'components' | 'demo';

export const DesignSystemShowcase: React.FC = () => {
  const { theme, isDark, toggleTheme, isSystem, mode } = useTheme();
  const styles = useStyles(createStyles);
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('colors');

  // Input states for testing
  const [sampleText, setSampleText] = useState('');
  const [samplePassword, setSamplePassword] = useState('Secret123!');
  const [sampleSwitch, setSampleSwitch] = useState(true);

  const activeModeBadgeLabel = useMemo(() => {
    if (isSystem) return `SYSTEM (${mode.toUpperCase()})`;
    return isDark ? 'DARK MODE' : 'LIGHT MODE';
  }, [isSystem, isDark, mode]);

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleBox}>
          <Text variant="helper1" color={theme.colors.primary} weight="semibold">
            budhi design lab
          </Text>
          <Text variant="h3" color={theme.colors.textPrimary} weight="semibold">
            GoSeat UI Kit
          </Text>
        </View>

        <View style={styles.themeToggleContainer}>
          <Badge label={activeModeBadgeLabel} variant="primary" size="small" style={styles.modeBadge} />
          <Icon name={isDark ? 'Darkmode' : 'Lightmode'} size={20} color={theme.colors.primary} />
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            activeColor={theme.colors.primary}
            style={styles.switchMarginLeft}
          />
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {[
          { id: 'colors', label: 'Color' },
          { id: 'typography', label: 'Typography' },
          { id: 'shadows', label: 'Shadow' },
          { id: 'components', label: 'Components' },
          { id: 'demo', label: 'Live Demo' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as ShowcaseTab)}
              style={[
                styles.tabItem,
                isActive && styles.activeTabBorder,
              ]}
            >
              <Text
                variant="title2"
                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                weight={isActive ? 'semibold' : 'medium'}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Render Colors Tab
  const renderColorsTab = () => {
    const rawColors = theme.colors.raw;

    const renderSwatchRow = (
      title: string,
      countLabel: string,
      swatches: { pct: string; hex: string }[]
    ) => (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text variant="title1" color={theme.colors.textPrimary} weight="semibold">
            {title}
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted}>
            {countLabel}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.swatchRow}>
          {swatches.map((item, index) => (
            <View key={index} style={styles.swatchCard}>
              <View style={[styles.swatchBox, { backgroundColor: item.hex }]} />
              <View style={styles.swatchInfo}>
                <Text variant="helper1" color={theme.colors.textPrimary} weight="semibold">
                  {item.pct}
                </Text>
                <Text variant="helper2" color={theme.colors.textMuted}>
                  {item.hex}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );

    return (
      <View style={styles.tabContent}>
        <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.pageTitle}>
          Color
        </Text>

        {renderSwatchRow('Primary', '7 colors', [
          { pct: '0%', hex: rawColors.primary['0'] },
          { pct: '25%', hex: rawColors.primary['25'] },
          { pct: '50%', hex: rawColors.primary['50'] },
          { pct: '75%', hex: rawColors.primary['75'] },
          { pct: '90%', hex: rawColors.primary['90'] },
          { pct: '100%', hex: rawColors.primary['100'] },
          { pct: '200%', hex: rawColors.primary['200'] },
        ])}

        {renderSwatchRow('Secondary', '7 colors', [
          { pct: '0%', hex: rawColors.secondary['0'] },
          { pct: '25%', hex: rawColors.secondary['25'] },
          { pct: '50%', hex: rawColors.secondary['50'] },
          { pct: '75%', hex: rawColors.secondary['75'] },
          { pct: '90%', hex: rawColors.secondary['90'] },
          { pct: '100%', hex: rawColors.secondary['100'] },
          { pct: '200%', hex: rawColors.secondary['200'] },
        ])}

        {renderSwatchRow('Greyscale', '9 colors', [
          { pct: '0%', hex: rawColors.greyscale['0'] },
          { pct: '5%', hex: rawColors.greyscale['5'] },
          { pct: '15%', hex: rawColors.greyscale['15'] },
          { pct: '30%', hex: rawColors.greyscale['30'] },
          { pct: '50%', hex: rawColors.greyscale['50'] },
          { pct: '75%', hex: rawColors.greyscale['75'] },
          { pct: '100%', hex: rawColors.greyscale['100'] },
          { pct: '150%', hex: rawColors.greyscale['150'] },
          { pct: '200%', hex: rawColors.greyscale['200'] },
        ])}

        {renderSwatchRow('Alert/Success', '8 colors', [
          { pct: '0%', hex: rawColors.success['0'] },
          { pct: '10%', hex: rawColors.success['10'] },
          { pct: '25%', hex: rawColors.success['25'] },
          { pct: '50%', hex: rawColors.success['50'] },
          { pct: '65%', hex: rawColors.success['65'] },
          { pct: '90%', hex: rawColors.success['90'] },
          { pct: '100%', hex: rawColors.success['100'] },
          { pct: '200%', hex: rawColors.success['200'] },
        ])}

        {renderSwatchRow('Alert/Error', '8 colors', [
          { pct: '0%', hex: rawColors.error['0'] },
          { pct: '10%', hex: rawColors.error['10'] },
          { pct: '25%', hex: rawColors.error['25'] },
          { pct: '50%', hex: rawColors.error['50'] },
          { pct: '65%', hex: rawColors.error['65'] },
          { pct: '90%', hex: rawColors.error['90'] },
          { pct: '100%', hex: rawColors.error['100'] },
          { pct: '200%', hex: rawColors.error['200'] },
        ])}

        {renderSwatchRow('Alert/Warning', '8 colors', [
          { pct: '0%', hex: rawColors.warning['0'] },
          { pct: '10%', hex: rawColors.warning['10'] },
          { pct: '25%', hex: rawColors.warning['25'] },
          { pct: '50%', hex: rawColors.warning['50'] },
          { pct: '65%', hex: rawColors.warning['65'] },
          { pct: '90%', hex: rawColors.warning['90'] },
          { pct: '100%', hex: rawColors.warning['100'] },
          { pct: '200%', hex: rawColors.warning['200'] },
        ])}
      </View>
    );
  };

  // Render Typography Tab
  const renderTypographyTab = () => (
    <View style={styles.tabContent}>
      <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.pageTitle}>
        Typography
      </Text>

      {/* Font Banner */}
      <Card variant="flat" padding="lg" style={styles.fontBanner}>
        <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">
          Poppins
        </Text>
        <Text variant="paragraph" color={theme.colors.textMuted} style={styles.fontSubtitleMargin}>
          Google Fonts / System Fallback
        </Text>

        <View style={styles.sampleCharGrid}>
          <View style={styles.sampleCharItem}>
            <Text variant="helper1" color={theme.colors.textMuted}>Capital Letter</Text>
            <Text variant="title1" color={theme.colors.textPrimary} weight="semibold">ABCDEFGHIJKLMNOPQRSTUVWXYZ</Text>
          </View>
          <View style={styles.sampleCharItem}>
            <Text variant="helper1" color={theme.colors.textMuted}>Small Letter</Text>
            <Text variant="title1" color={theme.colors.textPrimary} weight="regular">abcdefghijklmnopqrstuvwxyz</Text>
          </View>
          <View style={styles.sampleCharItem}>
            <Text variant="helper1" color={theme.colors.textMuted}>Numbers & Symbols</Text>
            <Text variant="title1" color={theme.colors.textPrimary} weight="medium">1234567890 ~!@#$%^&*()</Text>
          </View>
        </View>

        <View style={styles.weightCardsRow}>
          <Card variant="elevated" elevation="xsmall" padding="md" style={styles.weightCard}>
            <Text variant="h2" color={theme.colors.textPrimary} weight="regular">Aa</Text>
            <Text variant="helper1" color={theme.colors.textMuted}>Poppins Regular</Text>
          </Card>
          <Card variant="elevated" elevation="xsmall" padding="md" style={styles.weightCard}>
            <Text variant="h2" color={theme.colors.textPrimary} weight="medium">Aa</Text>
            <Text variant="helper1" color={theme.colors.textMuted}>Poppins Medium</Text>
          </Card>
          <Card variant="elevated" elevation="xsmall" padding="md" style={styles.weightCard}>
            <Text variant="h2" color={theme.colors.textPrimary} weight="semibold">Aa</Text>
            <Text variant="helper1" color={theme.colors.textMuted}>Poppins Semibold</Text>
          </Card>
        </View>
      </Card>

      {/* Headings */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Headline
      </Text>

      <Card variant="outlined" padding="lg" style={styles.typoTable}>
        <View style={styles.typoRow}>
          <Text variant="h1" color={theme.colors.textPrimary}>Heading 1</Text>
          <Text variant="helper1" color={theme.colors.textMuted}>Semibold / 40px</Text>
        </View>
        <Divider spacing="md" />
        <View style={styles.typoRow}>
          <Text variant="h2" color={theme.colors.textPrimary}>Heading 2</Text>
          <Text variant="helper1" color={theme.colors.textMuted}>Medium / 32px</Text>
        </View>
        <Divider spacing="md" />
        <View style={styles.typoRow}>
          <Text variant="h3" color={theme.colors.textPrimary}>Heading 3</Text>
          <Text variant="helper1" color={theme.colors.textMuted}>Medium / 24px</Text>
        </View>
        <Divider spacing="md" />
        <View style={styles.typoRow}>
          <Text variant="h4" color={theme.colors.textPrimary}>Heading 4</Text>
          <Text variant="helper1" color={theme.colors.textMuted}>Medium / 20px</Text>
        </View>
      </Card>

      {/* Body Scale */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Body
      </Text>

      <Card variant="outlined" padding="lg" style={styles.typoTable}>
        {[
          { name: 'Title 1', weight: 'Semibold', size: '16px', variant: 'title1' as const },
          { name: 'Title 2', weight: 'Medium', size: '14px', variant: 'title2' as const },
          { name: 'Paragraph', weight: 'Regular', size: '12px', variant: 'paragraph' as const },
          { name: 'Helper 1', weight: 'Semibold', size: '10px', variant: 'helper1' as const },
          { name: 'Helper 2', weight: 'Semibold', size: '8px', variant: 'helper2' as const },
        ].map((item, idx, arr) => (
          <React.Fragment key={item.name}>
            <View style={styles.bodyTypoRow}>
              <View style={styles.flex2}>
                <Text variant="title2" color={theme.colors.textPrimary} weight="semibold">{item.name}</Text>
              </View>
              <View style={styles.flex2}>
                <Text variant="paragraph" color={theme.colors.textSecondary}>{item.weight}</Text>
              </View>
              <View style={styles.flex1}>
                <Text variant="paragraph" color={theme.colors.textMuted}>{item.size}</Text>
              </View>
              <View style={styles.flex2AlignRight}>
                <Text variant={item.variant} color={theme.colors.textPrimary}>Aa Sample</Text>
              </View>
            </View>
            {idx < arr.length - 1 && <Divider spacing="sm" />}
          </React.Fragment>
        ))}
      </Card>
    </View>
  );

  // Render Shadows Tab
  const renderShadowsTab = () => {
    const shadowLevels: ShadowElevation[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];

    return (
      <View style={styles.tabContent}>
        <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.pageTitle}>
          Shadow
        </Text>
        <Text variant="paragraph" color={theme.colors.textMuted} style={styles.shadowSubTitleMargin}>
          Light & Dark Mode Elevation Tokens
        </Text>

        <View style={styles.shadowGrid}>
          {shadowLevels.map((lvl) => (
            <Card
              key={lvl}
              elevation={lvl}
              variant="elevated"
              padding="lg"
              style={styles.shadowCardItem}
            >
              <Text variant="title2" color={theme.colors.textPrimary} weight="semibold">
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </Text>
              <Text variant="helper2" color={theme.colors.textMuted} style={styles.marginTop4}>
                Elevation Level
              </Text>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  // Render Components Tab
  const renderComponentsTab = () => (
    <View style={styles.tabContent}>
      <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.pageTitle}>
        Components
      </Text>

      {/* Buttons */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Buttons
      </Text>

      <View style={styles.compGroup}>
        <View style={styles.wrapRow}>
          <Button title="Primary Button" variant="primary" style={styles.compItem} />
          <Button title="Secondary" variant="secondary" style={styles.compItem} />
          <Button title="Outline" variant="outline" style={styles.compItem} />
          <Button title="Ghost" variant="ghost" style={styles.compItem} />
          <Button title="Success" variant="success" style={styles.compItem} />
          <Button title="Danger" variant="danger" style={styles.compItem} />
          <Button title="Warning" variant="warning" style={styles.compItem} />
        </View>

        <Divider spacing="md" />

        <Text variant="title2" color={theme.colors.textSecondary} style={styles.marginBottom8}>
          Sizes & States
        </Text>
        <View style={styles.wrapRow}>
          <Button title="Small" size="small" variant="primary" style={styles.compItem} />
          <Button title="Medium" size="medium" variant="primary" style={styles.compItem} />
          <Button title="Large" size="large" variant="primary" style={styles.compItem} />
          <Button title="With Icon" variant="primary" leftIcon="Travel" style={styles.compItem} />
          <Button title="Disabled" variant="primary" disabled style={styles.compItem} />
          <Button title="Loading" variant="primary" loading style={styles.compItem} />
        </View>
      </View>

      {/* Text Inputs */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Inputs & TextFields
      </Text>

      <Card variant="outlined" padding="lg" style={styles.compGroup}>
        <Input
          label="Departure City"
          placeholder="e.g. New York, NY"
          leftIcon="Location"
          value={sampleText}
          onChangeText={setSampleText}
          helperText="Enter your origin city"
        />

        <Input
          label="Password / PIN"
          placeholder="Enter secret passcode"
          isPassword
          leftIcon="Lock"
          value={samplePassword}
          onChangeText={setSamplePassword}
        />

        <Input
          label="Promo Code (Error State)"
          placeholder="DISCOUNT2026"
          leftIcon="Star"
          error="Invalid or expired promo code"
        />
      </Card>

      {/* Badges */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Badges & Status Tags
      </Text>

      <View style={styles.wrapRow}>
        <Badge label="Primary" variant="primary" style={styles.compItem} />
        <Badge label="Confirmed" variant="success" icon="Check" style={styles.compItem} />
        <Badge label="Pending" variant="warning" icon="Time" style={styles.compItem} />
        <Badge label="Cancelled" variant="error" icon="Close" style={styles.compItem} />
        <Badge label="Secondary" variant="secondary" style={styles.compItem} />
        <Badge label="Outlined" variant="primary" outlined style={styles.compItem} />
      </View>

      {/* Switches & Layout */}
      <Text variant="title1" color={theme.colors.textPrimary} weight="semibold" style={styles.subSectionTitle}>
        Switches & Toggles
      </Text>

      <Card variant="outlined" padding="lg" style={styles.switchRow}>
        <View style={styles.flex1}>
          <Text variant="title2" color={theme.colors.textPrimary} weight="semibold">
            Enable Ticket Notifications
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted}>
            Receive real-time departure and gate alerts
          </Text>
        </View>
        <Switch value={sampleSwitch} onValueChange={setSampleSwitch} />
      </Card>
    </View>
  );

  // Render Live Demo Tab
  const renderDemoTab = () => (
    <View style={styles.tabContent}>
      <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.pageTitle}>
        Live Demo
      </Text>
      <Text variant="paragraph" color={theme.colors.textMuted} style={styles.demoSubtitleMargin}>
        GoSeat Bus Ticket Booking Component Preview
      </Text>

      <Card variant="elevated" elevation="medium" padding="xl" style={styles.demoCard}>
        {/* Ticket Header */}
        <View style={styles.demoHeader}>
          <View>
            <Badge label="EXPRESS BUS" variant="primary" icon="Travel" />
            <Text variant="h3" color={theme.colors.textPrimary} weight="semibold" style={styles.marginTop8}>
              GreenLine Express
            </Text>
          </View>

          <View style={styles.alignItemsRight}>
            <Text variant="h3" color={theme.colors.primary} weight="semibold">
              $45.00
            </Text>
            <Text variant="helper1" color={theme.colors.success} weight="semibold">
              15 Seats Left
            </Text>
          </View>
        </View>

        <Divider spacing="lg" />

        {/* Route Details */}
        <View style={styles.routeContainer}>
          <View style={styles.flex1}>
            <Text variant="h4" color={theme.colors.textPrimary} weight="semibold">08:00 AM</Text>
            <Text variant="title2" color={theme.colors.textSecondary}>New York (Port Auth)</Text>
          </View>

          <View style={styles.routeLineContainer}>
            <Icon name="Time" size={16} color={theme.colors.primary} />
            <Text variant="helper1" color={theme.colors.textMuted}>4h 30m</Text>
            <View style={styles.dashedRouteLine} />
          </View>

          <View style={[styles.flex1, styles.alignItemsRight]}>
            <Text variant="h4" color={theme.colors.textPrimary} weight="semibold">12:30 PM</Text>
            <Text variant="title2" color={theme.colors.textSecondary}>Boston (South Stn)</Text>
          </View>
        </View>

        <Divider spacing="lg" />

        {/* Features & Booking */}
        <View style={styles.featuresRow}>
          <Badge label="AC / Wi-Fi" variant="secondary" />
          <Badge label="Reclining" variant="neutral" />
          <Badge label="Power Outlet" variant="neutral" />
        </View>

        <Button
          title="Select Seat & Book Now"
          variant="primary"
          size="large"
          fullWidth
          rightIcon="ArrowRight"
          style={styles.marginTop20}
          onPress={() => Alert.alert('Booking Initiated', 'GoSeat Design System Ticket Booking preview!')}
        />
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {activeTab === 'colors' && renderColorsTab()}
        {activeTab === 'typography' && renderTypographyTab()}
        {activeTab === 'shadows' && renderShadowsTab()}
        {activeTab === 'components' && renderComponentsTab()}
        {activeTab === 'demo' && renderDemoTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Advanced Centralized Theme Stylesheet Generator (`createStyles`)
 * All dynamic screen & component styles defined here once for optimal performance.
 */
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      borderBottomWidth: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    headerTitleBox: {
      flex: 1,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modeBadge: {
      marginRight: 8,
    },
    switchMarginLeft: {
      marginLeft: 8,
    },
    tabBar: {
      flexDirection: 'row',
    },
    tabItem: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginRight: 8,
    },
    activeTabBorder: {
      borderBottomWidth: 3,
      borderBottomColor: theme.colors.primary,
    },
    scrollBody: {
      paddingBottom: 40,
    },
    tabContent: {
      padding: 16,
    },
    pageTitle: {
      marginBottom: 16,
    },
    subSectionTitle: {
      marginTop: 24,
      marginBottom: 12,
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 12,
    },
    swatchRow: {
      flexDirection: 'row',
    },
    swatchCard: {
      width: 90,
      marginRight: 12,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    swatchBox: {
      height: 60,
      width: '100%',
    },
    swatchInfo: {
      padding: 6,
    },
    fontBanner: {
      marginBottom: 20,
    },
    fontSubtitleMargin: {
      marginBottom: 16,
    },
    sampleCharGrid: {
      marginBottom: 16,
    },
    sampleCharItem: {
      marginBottom: 8,
    },
    weightCardsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    weightCard: {
      flex: 1,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    typoTable: {
      marginBottom: 12,
    },
    typoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bodyTypoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },
    flex1: {
      flex: 1,
    },
    flex2: {
      flex: 2,
    },
    flex2AlignRight: {
      flex: 2,
      alignItems: 'flex-end',
    },
    shadowGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    shadowCardItem: {
      width: (theme.responsive.screenWidth - 48) / 2,
      marginBottom: 16,
      height: theme.responsive.verticalScale(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
    shadowSubTitleMargin: {
      marginBottom: 24,
    },
    marginTop4: {
      marginTop: 4,
    },
    compGroup: {
      marginBottom: 16,
    },
    wrapRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    compItem: {
      marginRight: 8,
      marginBottom: 12,
    },
    marginBottom8: {
      marginBottom: 8,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    demoSubtitleMargin: {
      marginBottom: 20,
    },
    demoCard: {
      marginTop: 8,
    },
    demoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    marginTop8: {
      marginTop: 8,
    },
    marginTop20: {
      marginTop: 20,
    },
    alignItemsRight: {
      alignItems: 'flex-end',
    },
    routeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    routeLineContainer: {
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    dashedRouteLine: {
      width: 40,
      borderBottomWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      marginTop: 4,
    },
    featuresRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
  });
