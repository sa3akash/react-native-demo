/**
 * GoSeat Navigation System - Register Screen
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
import { AuthScreenProps } from '../../types';

export const RegisterScreen: React.FC<AuthScreenProps<'Register'>> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  const [name, setName] = useState('');
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
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
          <Text variant="h2" color={theme.colors.textPrimary} weight="semibold" style={styles.title}>
            Join GoSeat
          </Text>
          <Text variant="paragraph" color={theme.colors.textMuted} align="center">
            Create an account to manage your bus bookings
          </Text>
        </View>

        <Card variant="elevated" elevation="medium" padding="xl">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon="User"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Email Address"
            placeholder="john@example.com"
            leftIcon="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="create a strong password"
            leftIcon="Lock"
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title="Create Account"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onPress={handleRegister}
            style={styles.submitBtn}
          />

          <Button
            title="Already have an account? Log In"
            variant="ghost"
            size="medium"
            fullWidth
            onPress={() => navigation.navigate('Login')}
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
      marginBottom: theme.spacing.xl,
    },
    title: {
      marginBottom: 6,
    },
    submitBtn: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
  });
