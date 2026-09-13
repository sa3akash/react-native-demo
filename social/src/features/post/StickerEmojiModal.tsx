import React, { memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet } from '../../shared/components';
import { RichContentParser, StickerItem } from '../../core/content/RichContentParser';

export interface StickerEmojiModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerItem) => void;
}

const StickerEmojiModalComponent: React.FC<StickerEmojiModalProps> = ({
  visible,
  onClose,
  onSelectSticker,
}) => {
  const { colors, theme } = useTheme();
  const stickers = RichContentParser.getStickers();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Stickers & Emojis">
      <View style={styles.content}>
        <FlatList
          data={stickers}
          numColumns={4}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onSelectSticker(item);
                onClose();
              }}
              style={[styles.stickerCard, { backgroundColor: colors.inputBg, borderRadius: theme.radius.lg }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={item.name}
            >
              <Typography variant="h1" style={styles.emoji}>
                {item.emoji}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
                {item.name}
              </Typography>
            </TouchableOpacity>
          )}
        />
      </View>
    </BottomSheet>
  );
};

export const StickerEmojiModal = memo(StickerEmojiModalComponent);

const styles = StyleSheet.create({
  content: {
    height: 320,
    paddingTop: 8,
  },
  gridList: {
    paddingVertical: 12,
    gap: 8,
  },
  stickerCard: {
    flex: 1,
    height: 80,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
});
