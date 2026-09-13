import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  onClose?: () => void;
  actionText?: string;
  onAction?: () => void;
}

const AlertComponent: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  onClose,
  actionText,
  onAction,
}) => {
  const { colors, theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  let bgColor = colors.infoBg;
  let borderColor = colors.info;
  let icon = 'ℹ️';

  if (variant === 'success') {
    bgColor = colors.successBg;
    borderColor = colors.success;
    icon = '✅';
  } else if (variant === 'warning') {
    bgColor = colors.warningBg;
    borderColor = colors.warning;
    icon = '⚠️';
  } else if (variant === 'danger') {
    bgColor = colors.dangerBg;
    borderColor = colors.danger;
    icon = '🚫';
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor,
          borderRadius: theme.radius.md,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
    >
      <Typography variant="h4" style={styles.icon}>
        {icon}
      </Typography>

      <View style={styles.textCol}>
        {title && (
          <Typography variant="subtitle2" color={colors.text} bold>
            {title}
          </Typography>
        )}
        <Typography variant="body2" color={colors.text}>
          {message}
        </Typography>

        {actionText && (
          <TouchableOpacity
            onPress={onAction}
            style={styles.actionBtn}
            accessible={true}
            accessibilityRole="button"
          >
            <Typography variant="buttonSmall" color={borderColor} bold>
              {actionText}
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
        >
          <Typography variant="caption" color={colors.textSecondary}>
            ✕
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const Alert = memo(AlertComponent);

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    padding: 12,
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  textCol: {
    flex: 1,
  },
  actionBtn: {
    marginTop: 6,
  },
  closeBtn: {
    padding: 4,
  },
});
