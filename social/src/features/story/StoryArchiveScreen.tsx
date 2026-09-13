import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button, EmptyState } from '../../shared/components';
import { useStoryStore, StoryItem } from '../../store/useStoryStore';
import { useToast } from '../../shared/components/molecules/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface StoryArchiveScreenProps {
  onBack: () => void;
  onCreateHighlight?: (selectedStories: string[]) => void;
}

const StoryArchiveScreenComponent: React.FC<StoryArchiveScreenProps> = ({
  onBack,
  onCreateHighlight,
}) => {
  const { colors, theme } = useTheme();
  const archivedStories = useStoryStore((state) => state.archivedStories);
  const { showToast } = useToast();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelectionMode = selectedIds.length > 0;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCreateHighlightFromSelection = () => {
    if (selectedIds.length === 0) return;
    onCreateHighlight?.(selectedIds);
    showToast({ message: `Creating highlight with ${selectedIds.length} stories! ⭐`, type: 'success' });
    setSelectedIds([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} accessible={true} accessibilityRole="button">
          <Typography variant="h3" color={colors.text}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Story Archive
        </Typography>
        {isSelectionMode ? (
          <TouchableOpacity onPress={handleCreateHighlightFromSelection} style={styles.actionBtn}>
            <Typography variant="subtitle2" color={colors.primary} bold>
              Highlight ({selectedIds.length})
            </Typography>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>

      <FlatList
        data={archivedStories}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => toggleSelect(item.id)}
              style={styles.storyCard}
            >
              <Image source={{ uri: item.mediaUrl }} style={styles.storyThumbnail} resizeMode="cover" />

              {/* Selection Checkbox */}
              <View
                style={[
                  styles.selectCircle,
                  {
                    backgroundColor: isSelected ? colors.primary : 'rgba(0,0,0,0.5)',
                    borderColor: '#FFFFFF',
                  },
                ]}
              >
                {isSelected && (
                  <Typography variant="caption" color="#FFFFFF" bold>
                    ✓
                  </Typography>
                )}
              </View>

              {/* Date Badge */}
              <View style={styles.dateOverlay}>
                <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1}>
                  {item.createdAt}
                </Typography>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="📦"
            title="No Archived Stories"
            description="Stories you publish are automatically saved here after 24 hours."
          />
        }
      />
    </SafeAreaView>
  );
};

export const StoryArchiveScreen = memo(StoryArchiveScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 6,
  },
  actionBtn: {
    padding: 6,
  },
  gridContent: {
    padding: 2,
    paddingBottom: 30,
  },
  storyCard: {
    width: (SCREEN_WIDTH - 8) / 3,
    height: 180,
    margin: 1,
    position: 'relative',
  },
  storyThumbnail: {
    width: '100%',
    height: '100%',
  },
  selectCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
