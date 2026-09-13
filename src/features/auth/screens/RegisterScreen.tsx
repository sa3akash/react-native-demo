import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUiStore } from '../../../app/store/uiStore';
import { Button } from '../../../components/buttons/Button';
import { FormField } from '../../../components/forms/FormField';
import { PasswordInput } from '../../../components/forms/PasswordInput';
import { Container } from '../../../components/layout/Container';
import { Screen } from '../../../components/layout/Screen';
import { Spacer } from '../../../components/layout/Spacer';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { Text } from '../../../components/typography/Text';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { authApi } from '../api/authApi';
import { registerSchema, RegisterFormValues } from '../schemas/auth.schema';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const showToast = useUiStore(state => state.showToast);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const data = await authApi.register(values);
      setAuthenticated(data.user, data.tokens.accessToken);
      showToast({ message: 'Account created successfully!', type: 'success' });
    } catch (error) {
      showToast({ message: 'Registration failed. Try again.', type: 'error' });
    }
  };

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="lg" />
        <Heading level="h1">Create Account 🚀</Heading>
        <Spacer size="xs" />
        <BodyText color={theme.colors.text.secondary}>
          Join thousands of professionals using our enterprise suite.
        </BodyText>

        <Spacer size="xl" />

        <FormField control={control} name="fullName" label="Full Name" placeholder="Alex Vance" />
        <FormField
          control={control}
          name="email"
          label="Email Address"
          placeholder="alex@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField
          control={control}
          name="password"
          label="Password"
          placeholder="••••••••"
          Component={PasswordInput}
        />
        <FormField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          Component={PasswordInput}
        />

        <Spacer size="lg" />

        <Button title="Create Account" onPress={handleSubmit(onSubmit)} />

        <Spacer size="xl" />

        <View style={styles.footer}>
          <Text size={14} color={theme.colors.text.secondary}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text size={14} weight="700" color={theme.colors.brand.primary}>
              Sign In
            </Text>
          </Pressable>
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
