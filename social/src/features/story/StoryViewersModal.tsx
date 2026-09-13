import React, { memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, BottomSheet, EmptyState } from '../../shared/components';
import { StoryViewer } from '../../store/useStoryStore';

export interface StoryViewersModalProps {
  visible: boolean;
  viewers: StoryViewer[];
  onClose: () => void;
}

const StoryViewersModalComponent: React.FC<StoryViewersModalProps> = ({
  visible,
  viewers,
  onClose,
}) => {
  const { colors } = useTheme();
  const isRTL = I18nManager.isRTL;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={`Story Viewers (${viewers.length})`}
      maxHeight="70%"
    >
      <FlatList
        data={viewers}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.viewerRow,
              {
                borderBottomColor: colors.borderSubtle,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <Avatar uri={item.userAvatar} name={item.userName} size="md" />
            <View style={styles.viewerTextCol}>
              <Typography variant="subtitle2" color={colors.text} bold>
                {item.userName}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Viewed {item.viewedAt}
              </Typography>
            </View>

            {item.reaction && (
              <View style={styles.reactionBadge}>
                <Typography variant="h3">{item.reaction}</Typography>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="👀"
            title="No Viewers Yet"
            description="When people view your story, they will appear here."
          />
        }
      />
    </BottomSheet>
  );
};

export const StoryViewersModal = memo(StoryViewersModalComponent);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  viewerRow: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  viewerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  reactionBadge: {
    paddingHorizontal: 8,
  },
});
