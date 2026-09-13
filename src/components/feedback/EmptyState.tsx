import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../buttons/Button';
import { BodyText } from '../typography/BodyText';
import { Heading } from '../typography/Heading';

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📭',
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Heading level="h1" style={styles.icon}>
        {icon}
      </Heading>
      <Heading level="h3" style={styles.title}>
        {title}
      </Heading>
      {description && (
        <BodyText
          size="medium"
          color={theme.colors.text.secondary}
          align="center"
          style={styles.desc}>
          {description}
        </BodyText>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
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
