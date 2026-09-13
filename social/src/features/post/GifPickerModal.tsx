import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, SearchBar } from '../../shared/components';
import { RichContentParser, GifItem } from '../../core/content/RichContentParser';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface GifPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGif: (gif: GifItem) => void;
}

const GifPickerModalComponent: React.FC<GifPickerModalProps> = ({
  visible,
  onClose,
  onSelectGif,
}) => {
  const { colors, theme } = useTheme();
  const [search, setSearch] = useState('');
  const gifs = RichContentParser.getTrendingGifs();

  const filtered = search.trim()
    ? gifs.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()))
    : gifs;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Select a GIF">
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search Tenor & GIPHY..."
        />

        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onSelectGif(item);
                onClose();
              }}
              style={[styles.gifCard, { borderRadius: theme.radius.md }]}
            >
              <Image source={{ uri: item.previewUrl }} style={styles.gifImage} resizeMode="cover" />
              <View style={styles.titleOverlay}>
                <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1}>
                  {item.title}
                </Typography>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </BottomSheet>
  );
};

export const GifPickerModal = memo(GifPickerModalComponent);

const styles = StyleSheet.create({
  content: {
    height: 380,
    paddingTop: 8,
  },
  gridList: {
    paddingVertical: 12,
    gap: 8,
  },
  gifCard: {
    flex: 1,
    height: 120,
    margin: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
