import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../../app/store/themeStore';
import { Button } from '../../../components/buttons/Button';
import { Container } from '../../../components/layout/Container';
import { Screen } from '../../../components/layout/Screen';
import { Spacer } from '../../../components/layout/Spacer';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { Text } from '../../../components/typography/Text';
import { SessionManager } from '../../../services/auth/SessionManager';
import { useTheme } from '../../../theme/ThemeProvider';
import { ThemeMode } from '../../../types';

export const SettingsScreen: React.FC = () => {
  const { theme, mode, setMode } = useTheme();
  const setStoreTheme = useThemeStore(state => state.setMode);

  const handleThemeChange = (selectedMode: ThemeMode) => {
    setMode(selectedMode);
    setStoreTheme(selectedMode);
  };

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="xl" />
        <Heading level="h1">App Settings ⚙️</Heading>
        <Spacer size="md" />

        <Heading level="h3">Theme Mode</Heading>
        <Spacer size="sm" />

        <View style={styles.themeRow}>
          {(['light', 'dark', 'system'] as const).map(item => (
            <Button
              key={item}
              title={item.toUpperCase()}
              variant={mode === item ? 'primary' : 'outline'}
              onPress={() => handleThemeChange(item)}
              fullWidth={false}
              style={styles.themeBtn}
            />
          ))}
        </View>

        <Spacer size="xxl" />

        <Heading level="h3">Account & Security</Heading>
        <Spacer size="sm" />
        <Button title="Sign Out" variant="secondary" onPress={SessionManager.logout} />

        <Spacer size="xxl" />

        <View
          style={[
            styles.infoBox,
            { backgroundColor: theme.colors.background.secondary, borderRadius: theme.radius.md },
          ]}>
          <Text size={14} weight="600" color={theme.colors.text.primary}>
            Enterprise Mobile Platform v1.0.0
          </Text>
          <BodyText size="small" color={theme.colors.text.muted}>
            Build Target: Production Ready RN CLI
          </BodyText>
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
  },
  infoBox: {
    padding: 16,
    alignItems: 'center',
  },
});
