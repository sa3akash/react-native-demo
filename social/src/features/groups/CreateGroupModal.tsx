import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button, SegmentedControl } from '../../shared/components';
import { useGroupStore, GroupPrivacy } from '../../store/useGroupStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (groupId: string) => void;
}

const PRIVACY_OPTIONS = [
  { id: 'public', label: '🌐 Public' },
  { id: 'private', label: '🔒 Private' },
  { id: 'secret', label: '🕵️ Secret' },
];

const CreateGroupModalComponent: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { colors, theme } = useTheme();
  const createGroup = useGroupStore((state) => state.createGroup);
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [privacy, setPrivacy] = useState<GroupPrivacy>('public');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [screeningQuestion, setScreeningQuestion] = useState('');

  const isRTL = I18nManager.isRTL;

  const handleCreate = () => {
    if (!name.trim()) {
      showToast({ message: 'Please enter a group name.', type: 'warning' });
      return;
    }

    const groupId = createGroup({
      name: name.trim(),
      description: description.trim(),
      category,
      privacy,
      requiresApproval,
      screeningQuestions: screeningQuestion.trim() ? [screeningQuestion.trim()] : [],
    });

    showToast({ message: `${name} created successfully! 🎉`, type: 'success' });
    setName('');
    setDescription('');
    onClose();
    onCreated?.(groupId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Create New Community Group">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Name */}
        <Input
          label="Group Name"
          placeholder="e.g. React Native Architecture Masters"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {/* Description */}
        <Input
          label="Group Purpose / Description"
          placeholder="Describe what members discuss and share in this group..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Category */}
        <Input
          label="Category / Discipline"
          placeholder="e.g. Artificial Intelligence, Web3, Design"
          value={category}
          onChangeText={setCategory}
        />

        {/* Privacy Selector */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 8, marginBottom: 4 }}>
          Privacy Level
        </Typography>
        <SegmentedControl
          segments={PRIVACY_OPTIONS}
          activeId={privacy}
          onSelect={(id) => setPrivacy(id as GroupPrivacy)}
          size="sm"
        />

        {/* Membership Approval Switch */}
        <View
          style={[
            styles.switchRow,
            {
              borderTopColor: colors.borderSubtle,
              borderBottomColor: colors.borderSubtle,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Require Admin Approval
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Admins or moderators must approve new member requests
            </Typography>
          </View>
          <Switch
            value={requiresApproval}
            onValueChange={setRequiresApproval}
            trackColor={{ false: colors.borderSubtle, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Screening Question (if approval enabled) */}
        {requiresApproval && (
          <Input
            label="Applicant Screening Question"
            placeholder="e.g. Why do you want to join this guild?"
            value={screeningQuestion}
            onChangeText={setScreeningQuestion}
          />
        )}

        <Button
          label="Create Group"
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

export const CreateGroupModal = memo(CreateGroupModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  switchRow: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});
