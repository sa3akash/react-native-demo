import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button } from '../../shared/components';
import { useModerationStore } from '../../store/useModerationStore';
import { ModerationCategory } from '../../core/moderation/AIModerationEngine';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ReportModalProps {
  visible: boolean;
  targetType: 'user' | 'post' | 'comment';
  targetId: string;
  targetAuthorName: string;
  targetAuthorAvatar?: string;
  targetContentSnippet: string;
  mediaUrl?: string;
  onClose: () => void;
}

const REPORT_REASONS: Array<{ id: ModerationCategory; title: string; desc: string; icon: string }> = [
  { id: 'hate_speech', title: 'Hate Speech & Discrimination', desc: 'Slurs, violent extremism, racism, or attacks on identity', icon: '🚨' },
  { id: 'toxicity', title: 'Harassment & Bullying', desc: 'Threats, targeted insults, intimidation, or severe toxicity', icon: '🛑' },
  { id: 'nsfw', title: 'NSFW / Explicit Adult Content', desc: 'Nudity, sexual activity, or gore', icon: '🔞' },
  { id: 'spam', title: 'Spam & Scam / Phishing', desc: 'Deceptive links, repetitive bot messages, fake crypto drops', icon: '🎣' },
  { id: 'impersonation', title: 'Impersonation & Fake Account', desc: 'Pretending to be someone else or unauthorized brand', icon: '🎭' },
  { id: 'misinformation', title: 'Harmful Misinformation', desc: 'Dangerous health, civic, or safety conspiracy', icon: '⚠️' },
];

const ReportModalComponent: React.FC<ReportModalProps> = ({
  visible,
  targetType,
  targetId,
  targetAuthorName,
  targetAuthorAvatar,
  targetContentSnippet,
  mediaUrl,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const submitReport = useModerationStore((state) => state.submitReport);
  const { showToast } = useToast();

  const [selectedReason, setSelectedReason] = useState<ModerationCategory>('toxicity');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = () => {
    const ticket = submitReport({
      targetType,
      targetId,
      targetAuthorName,
      targetAuthorAvatar,
      targetContentSnippet,
      reasonCategory: selectedReason,
      additionalNotes: additionalNotes.trim(),
      mediaUrl,
    });

    if (ticket.status === 'quarantined') {
      showToast({
        message: 'Report received! AI detected critical violation and quarantined content immediately 🛡️',
        type: 'success',
      });
    } else {
      showToast({
        message: 'Thank you for keeping SocialSphere safe. Report submitted for safety review.',
        type: 'info',
      });
    }

    setAdditionalNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title={`Report ${targetType.toUpperCase()} 🚩`}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Content Snippet */}
        <View style={[styles.snippetBox, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
          <Typography variant="caption" color={colors.textSecondary} bold>
            REPORTING {targetType.toUpperCase()} BY {targetAuthorName}
          </Typography>
          <Typography variant="body2" color={colors.text} numberOfLines={2} style={{ marginTop: 4 }}>
            "{targetContentSnippet}"
          </Typography>
        </View>

        {/* Reason Selector */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 8 }}>
          Select Violation Category
        </Typography>

        <View style={styles.reasonsList}>
          {REPORT_REASONS.map((r) => {
            const isSelected = selectedReason === r.id;

            return (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.8}
                onPress={() => setSelectedReason(r.id)}
                style={[
                  styles.reasonCard,
                  {
                    backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radius.md,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <Typography variant="h3">{r.icon}</Typography>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {r.title}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {r.desc}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Additional Notes */}
        <Input
          label="Additional Details (Optional)"
          placeholder="Provide context or links to assist the moderation team..."
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          multiline
          numberOfLines={2}
        />

        <Button
          label="Submit Report for AI Review"
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          fullWidth
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const ReportModal = memo(ReportModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 10,
  },
  snippetBox: {
    padding: 12,
  },
  reasonsList: {
    gap: 8,
    marginVertical: 4,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});
