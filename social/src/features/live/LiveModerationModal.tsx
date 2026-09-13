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
import { Typography, BottomSheet, Input, Button } from '../../shared/components';
import { useLiveStreamStore } from '../../store/useLiveStreamStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface LiveModerationModalProps {
  visible: boolean;
  onClose: () => void;
}

const LiveModerationModalComponent: React.FC<LiveModerationModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const isCommentsDisabled = useLiveStreamStore((state) => state.isCommentsDisabled);
  const toggleCommentsDisabled = useLiveStreamStore((state) => state.toggleCommentsDisabled);
  const blockedWords = useLiveStreamStore((state) => state.blockedWords);
  const addBlockedWord = useLiveStreamStore((state) => state.addBlockedWord);
  const removeBlockedWord = useLiveStreamStore((state) => state.removeBlockedWord);
  const { showToast } = useToast();

  const [newWord, setNewWord] = useState('');
  const isRTL = I18nManager.isRTL;

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    addBlockedWord(newWord.trim());
    setNewWord('');
    showToast({ message: 'Keyword added to spam filter', type: 'info' });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Stream Moderation 🛡️">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Disable Comments Toggle */}
        <View
          style={[
            styles.switchRow,
            {
              borderBottomColor: colors.borderSubtle,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Pause / Disable Live Chat
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Temporarily prevent viewers from submitting new comments
            </Typography>
          </View>
          <Switch
            value={isCommentsDisabled}
            onValueChange={() => {
              toggleCommentsDisabled();
              showToast({
                message: isCommentsDisabled ? 'Live chat enabled' : 'Live chat paused',
                type: 'info',
              });
            }}
            trackColor={{ false: colors.borderSubtle, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Blocked Words Filter */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 10 }}>
          Spam & Profanity Word Filter
        </Typography>

        <View style={styles.addWordRow}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="e.g. crypto spam, phishing"
              value={newWord}
              onChangeText={setNewWord}
            />
          </View>
          <Button
            label="+ Add"
            variant="primary"
            size="sm"
            onPress={handleAddWord}
            style={{ marginLeft: 8 }}
          />
        </View>

        {/* Blocked Words Chips */}
        <View style={styles.chipsWrap}>
          {blockedWords.map((word) => (
            <View
              key={word}
              style={[styles.wordPill, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}
            >
              <Typography variant="caption" color={colors.text} bold>
                {word}
              </Typography>
              <TouchableOpacity
                onPress={() => removeBlockedWord(word)}
                style={styles.removeBtn}
              >
                <Typography variant="caption" color={colors.textMuted}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export const LiveModerationModal = memo(LiveModerationModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 10,
  },
  switchRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  wordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  removeBtn: {
    padding: 2,
  },
});
