/**
 * GoSeat Navigation System - Login Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../../design-system/theme/ThemeContext';
import { useStyles } from '../../../design-system/hooks/useStyles';
import { Theme } from '../../../design-system/theme/types';
import { Text } from '../../../design-system/components/Text';
import { Input } from '../../../design-system/components/Input';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { Icon } from '../../../design-system/components/Icon';
import { AuthScreenProps } from '../../types';

export const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const [email, setEmail] = useState('user@goseat.com');
  const [password, setPassword] = useState('Secret123!');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main', { screen: 'Home' });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Icon name="Travel" size={32} color={theme.colors.raw.greyscale['0']} />
          </View>
          <Text variant="h1" color={theme.colors.textPrimary} weight="semibold" style={styles.title}>
            GoSeat
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted} align="center">
            Book your bus tickets in seconds
          </Text>
        </View>

        <Card variant="elevated" elevation="medium" padding="xl" style={styles.card}>
          <Text variant="h3" color={theme.colors.textPrimary} weight="semibold" style={styles.formTitle}>
            Welcome Back
          </Text>

          <Input
            label="Email Address"
            placeholder="enter your email"
            leftIcon="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="enter your password"
            leftIcon="Lock"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title="Log In"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onPress={handleLogin}
            style={styles.loginBtn}
          />

          <Button
            title="Create New Account"
            variant="outline"
            size="medium"
            fullWidth
            onPress={() => navigation.navigate('Register', { email })}
          />
        </Card>
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
      justifyContent: 'center',
      minHeight: '100%',
    },
    headerBox: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
    },
    logoBadge: {
      width: theme.responsive.scale(64),
      height: theme.responsive.scale(64),
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      marginBottom: 4,
    },
    card: {
      width: '100%',
    },
    formTitle: {
      marginBottom: theme.spacing.lg,
    },
    loginBtn: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
  });
