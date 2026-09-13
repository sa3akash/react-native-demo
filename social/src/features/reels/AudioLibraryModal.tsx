import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, SearchBar, Button } from '../../shared/components';
import { useReelsStore, AudioTrack } from '../../store/useReelsStore';

export interface AudioLibraryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTrack: (track: AudioTrack) => void;
}

const AudioLibraryModalComponent: React.FC<AudioLibraryModalProps> = ({
  visible,
  onClose,
  onSelectTrack,
}) => {
  const { colors, theme } = useTheme();
  const audioLibrary = useReelsStore((state) => state.audioLibrary);
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredTracks = search.trim()
    ? audioLibrary.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.artist.toLowerCase().includes(search.toLowerCase())
      )
    : audioLibrary;

  const handleTogglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Audio Library" maxHeight="80%">
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search songs, artists, soundtracks..."
        />

        <FlatList
          data={filteredTracks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isPlaying = playingId === item.id;
            return (
              <View style={[styles.trackRow, { borderBottomColor: colors.borderSubtle }]}>
                {/* Album Cover & Play Button */}
                <TouchableOpacity
                  onPress={() => handleTogglePlay(item.id)}
                  style={styles.coverWrap}
                >
                  <Image source={{ uri: item.coverUrl }} style={styles.coverImg} />
                  <View style={styles.playOverlay}>
                    <Typography variant="body2" color="#FFFFFF">
                      {isPlaying ? '⏸️' : '▶️'}
                    </Typography>
                  </View>
                </TouchableOpacity>

                {/* Track Info */}
                <View style={styles.trackInfoCol}>
                  <View style={styles.titleRow}>
                    <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
                      {item.title}
                    </Typography>
                    {item.isTrending && (
                      <View style={[styles.trendingPill, { backgroundColor: 'rgba(255, 45, 85, 0.15)' }]}>
                        <Typography variant="caption" color={colors.danger} bold>
                          🔥 Hot
                        </Typography>
                      </View>
                    )}
                  </View>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {item.artist} • {item.duration} • {(item.usesCount / 1000).toFixed(1)}k reels
                  </Typography>
                </View>

                {/* Use Sound Button */}
                <Button
                  label="Use Sound"
                  size="sm"
                  variant="primary"
                  onPress={() => {
                    onSelectTrack(item);
                    onClose();
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    </BottomSheet>
  );
};

export const AudioLibraryModal = memo(AudioLibraryModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    height: 480,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  coverWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  trendingPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
