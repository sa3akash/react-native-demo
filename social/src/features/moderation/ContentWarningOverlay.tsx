import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button } from '../../shared/components';

export interface ContentWarningOverlayProps {
  reason?: string;
  onReport?: () => void;
  children: React.ReactNode;
}

const ContentWarningOverlayComponent: React.FC<ContentWarningOverlayProps> = ({
  reason = 'Sensitive Content',
  onReport,
  children,
}) => {
  const { colors, theme } = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);

  if (isRevealed) {
    return <View>{children}</View>;
  }

  return (
    <View style={[styles.overlayContainer, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md, borderColor: colors.borderSubtle }]}>
      <Typography variant="h2" style={{ marginBottom: 6 }}>
        ⚠️
      </Typography>
      <Typography variant="subtitle2" color={colors.text} bold>
        {reason}
      </Typography>
      <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4, paddingHorizontal: 20 }}>
        This content was flagged by our Automated AI Safety System for community guidelines.
      </Typography>

      <View style={styles.actionBtnRow}>
        {onReport && (
          <Button
            label="Report 🚩"
            variant="ghost"
            size="sm"
            onPress={onReport}
          />
        )}
        <Button
          label="Show Content 👁️"
          variant="primary"
          size="sm"
          onPress={() => setIsRevealed(true)}
        />
      </View>
    </View>
  );
};

export const ContentWarningOverlay = memo(ContentWarningOverlayComponent);

const styles = StyleSheet.create({
  overlayContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 4,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
});
