import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button, SegmentedControl } from '../../shared/components';
import { useChatStore, ConversationType } from '../../store/useChatStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreateChatModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (convId: string) => void;
}

const CHAT_TYPES = [
  { id: 'direct', label: '👤 Direct' },
  { id: 'group', label: '👥 Group' },
  { id: 'channel', label: '📢 Channel' },
  { id: 'community', label: '🌐 Community' },
];

const CreateChatModalComponent: React.FC<CreateChatModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { colors, theme } = useTheme();
  const createConversation = useChatStore((state) => state.createConversation);
  const { showToast } = useToast();

  const [chatType, setChatType] = useState<ConversationType>('direct');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');

  const handleCreate = () => {
    if (!title.trim()) {
      showToast({ message: 'Please enter a title or recipient name.', type: 'warning' });
      return;
    }

    const convId = createConversation({
      title: title.trim(),
      avatarUrl,
      type: chatType,
      description: description.trim() || undefined,
      participants: [
        { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
      ],
    });

    showToast({ message: `${chatType.toUpperCase()} created successfully! 🎉`, type: 'success' });
    setTitle('');
    setDescription('');
    onClose();
    onCreated(convId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="New Conversation">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Type Selector */}
        <SegmentedControl
          segments={CHAT_TYPES}
          activeId={chatType}
          onSelect={(id) => setChatType(id as ConversationType)}
          size="sm"
        />

        <View style={{ marginTop: 12 }}>
          <Input
            label={chatType === 'direct' ? 'Contact / Username' : `${chatType.toUpperCase()} Name`}
            placeholder={
              chatType === 'direct'
                ? 'e.g. David Chen or @david'
                : chatType === 'group'
                ? 'e.g. Mobile Tech Team'
                : chatType === 'channel'
                ? 'e.g. React Native Updates'
                : 'e.g. AI Engineers Global'
            }
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        {chatType !== 'direct' && (
          <Input
            label="Description (Optional)"
            placeholder={`What is this ${chatType} about?`}
            value={description}
            onChangeText={setDescription}
          />
        )}

        <Button
          label={`Create ${chatType.toUpperCase()}`}
          variant="primary"
          size="lg"
          onPress={handleCreate}
          fullWidth
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const CreateChatModal = memo(CreateChatModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    gap: 8,
  },
});
