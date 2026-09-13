import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button, Modal, Input, EmptyState } from '../../shared/components';
import { useStoryStore, StoryHighlight } from '../../store/useStoryStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface StoryHighlightsScreenProps {
  onBack: () => void;
}

const StoryHighlightsScreenComponent: React.FC<StoryHighlightsScreenProps> = ({ onBack }) => {
  const { colors, theme } = useTheme();
  const { highlights, createHighlight, deleteHighlight } = useStoryStore();
  const { showToast } = useToast();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?w=400');

  const handleCreate = () => {
    if (!newTitle.trim()) {
      showToast({ message: 'Please enter a title for your highlight album.', type: 'warning' });
      return;
    }
    createHighlight(newTitle.trim(), newCover, ['arch_1']);
    showToast({ message: `Highlight "${newTitle}" created! ⭐`, type: 'success' });
    setNewTitle('');
    setIsCreateModalVisible(false);
  };

  const handleDelete = (id: string, title: string) => {
    deleteHighlight(id);
    showToast({ message: `Highlight "${title}" removed.`, type: 'info' });
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
          Story Highlights
        </Typography>
        <TouchableOpacity onPress={() => setIsCreateModalVisible(true)} style={styles.addBtn}>
          <Typography variant="subtitle2" color={colors.primary} bold>
            + New
          </Typography>
        </TouchableOpacity>
      </View>

      <FlatList
        data={highlights}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            padding={14}
            style={[styles.highlightCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}
          >
            <View style={styles.cardRow}>
              <View style={styles.coverRing}>
                <Image source={{ uri: item.coverUrl }} style={styles.coverImg} />
              </View>
              <View style={styles.textCol}>
                <Typography variant="subtitle1" color={colors.text} bold>
                  {item.title}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {item.storyIds.length} stories • Created {item.createdAt}
                </Typography>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.title)}
                style={styles.deleteBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Delete highlight ${item.title}`}
              >
                <Typography variant="caption" color={colors.danger} bold>
                  Delete
                </Typography>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="⭐"
            title="No Story Highlights"
            description="Group your favorite stories into categorized highlight albums on your profile."
            actionLabel="+ Create Highlight"
            onAction={() => setIsCreateModalVisible(true)}
          />
        }
      />

      {/* Create Highlight Modal */}
      <Modal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        title="New Story Highlight"
      >
        <View style={styles.modalBody}>
          <View style={styles.coverPickRow}>
            <Image source={{ uri: newCover }} style={styles.modalCoverThumb} />
            <TouchableOpacity
              onPress={() => setNewCover('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400')}
              style={[styles.changeCoverBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Typography variant="caption" color={colors.primary} bold>
                📷 Change Cover
              </Typography>
            </TouchableOpacity>
          </View>

          <Input
            label="Highlight Title"
            placeholder="e.g. Travel, Work, Conferences"
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus
          />

          <Button
            label="Save Highlight"
            variant="primary"
            size="md"
            onPress={handleCreate}
            fullWidth
            style={{ marginTop: 12 }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export const StoryHighlightsScreen = memo(StoryHighlightsScreenComponent);

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
  addBtn: {
    padding: 6,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  highlightCard: {
    marginBottom: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#0A84FF',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textCol: {
    marginLeft: 14,
    flex: 1,
  },
  deleteBtn: {
    padding: 8,
  },
  modalBody: {
    paddingTop: 8,
  },
  coverPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  modalCoverThumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  changeCoverBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
});
