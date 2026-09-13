import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../buttons/Button';
import { BodyText } from '../typography/BodyText';
import { Heading } from '../typography/Heading';

export interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Heading level="h1" style={styles.icon}>
        ⚠️
      </Heading>
      <Heading level="h3" style={styles.title}>
        {title}
      </Heading>
      <BodyText size="medium" color={theme.colors.status.error} align="center" style={styles.desc}>
        {message}
      </BodyText>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          fullWidth={false}
          style={styles.btn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 8,
  },
});
