import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
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
import { useLogin } from '../hooks/useLogin';
import { loginSchema, LoginFormValues } from '../schemas/auth.schema';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const loginMutation = useLogin();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'user@example.com',
      password: 'password123',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="xxl" />
        <Heading level="h1">Welcome Back 👋</Heading>
        <Spacer size="xs" />
        <BodyText color={theme.colors.text.secondary}>
          Sign in to your account to access enterprise services.
        </BodyText>

        <Spacer size="xl" />

        <FormField
          control={control}
          name="email"
          label="Email Address"
          placeholder="alex@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Spacer size="sm" />

        <FormField
          control={control}
          name="password"
          label="Password"
          placeholder="••••••••"
          Component={PasswordInput}
        />

        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
          <Text size={14} weight="600" color={theme.colors.brand.primary} align="right">
            Forgot password?
          </Text>
        </Pressable>

        <Spacer size="lg" />

        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={loginMutation.isPending}
        />

        <Spacer size="xl" />

        <View style={styles.footer}>
          <Text size={14} color={theme.colors.text.secondary}>
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text size={14} weight="700" color={theme.colors.brand.primary}>
              Create one
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
