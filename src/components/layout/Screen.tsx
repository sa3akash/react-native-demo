import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { SafeAreaScreen } from './SafeAreaScreen';

export interface ScreenProps {
  readonly scrollable?: boolean;
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
  readonly contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  scrollable = false,
  children,
  style,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();
  const safeAreaStyleProps = style ? { style } : {};

  if (scrollable) {
    return (
      <SafeAreaScreen {...safeAreaStyleProps}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: theme.colors.background.primary },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen {...safeAreaStyleProps}>
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        {children}
      </View>
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
