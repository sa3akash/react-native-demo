import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { useUiStore } from '../../../app/store/uiStore';
import { Button } from '../../../components/buttons/Button';
import { FormField } from '../../../components/forms/FormField';
import { Container } from '../../../components/layout/Container';
import { Screen } from '../../../components/layout/Screen';
import { Spacer } from '../../../components/layout/Spacer';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../schemas/auth.schema';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const showToast = useUiStore(state => state.showToast);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: route.params?.email || '' },
  });

  const onSubmit = (_values: ForgotPasswordFormValues) => {
    showToast({ message: 'Reset link sent to your email address', type: 'info' });
    navigation.navigate('Login');
  };

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="xxl" />
        <Heading level="h1">Reset Password 🔑</Heading>
        <Spacer size="xs" />
        <BodyText color={theme.colors.text.secondary}>
          Enter your registered email address to receive password recovery instructions.
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

        <Spacer size="lg" />

        <Button title="Send Recovery Email" onPress={handleSubmit(onSubmit)} />
        <Spacer size="md" />
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
        />
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
});
