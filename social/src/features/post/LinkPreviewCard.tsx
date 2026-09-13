import React, { memo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../shared/components';
import { LinkPreviewMetadata } from '../../core/content/RichContentParser';

export interface LinkPreviewCardProps {
  metadata: LinkPreviewMetadata;
  onRemove?: () => void;
}

const LinkPreviewCardComponent: React.FC<LinkPreviewCardProps> = ({
  metadata,
  onRemove,
}) => {
  const { colors, theme } = useTheme();

  const handleOpen = () => {
    Linking.openURL(metadata.url);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleOpen}
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderColor: colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel={`Link preview for ${metadata.title}`}
    >
      {metadata.imageUrl && (
        <Image
          source={{ uri: metadata.imageUrl }}
          style={styles.previewImg}
          resizeMode="cover"
        />
      )}

      <View style={styles.textCol}>
        <View style={styles.domainRow}>
          <Typography variant="overline" color={colors.primary} bold>
            🌐 {metadata.domain.toUpperCase()}
          </Typography>
          {onRemove && (
            <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
              <Typography variant="caption" color={colors.danger} bold>
                ✕
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1} style={styles.title}>
          {metadata.title}
        </Typography>

        <Typography variant="caption" color={colors.textSecondary} numberOfLines={2}>
          {metadata.description}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export const LinkPreviewCard = memo(LinkPreviewCardComponent);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 8,
  },
  previewImg: {
    width: '100%',
    height: 140,
  },
  textCol: {
    padding: 12,
  },
  domainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    marginBottom: 2,
  },
  removeBtn: {
    padding: 2,
  },
});
