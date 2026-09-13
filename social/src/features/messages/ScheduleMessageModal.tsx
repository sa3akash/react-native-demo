import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, Button } from '../../shared/components';

export interface ScheduleMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmSchedule: (scheduleText: string) => void;
}

const SCHEDULE_PRESETS = [
  { id: '30m', label: 'In 30 minutes', value: 'Today at ' + new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  { id: '2h', label: 'In 2 hours', value: 'Today at ' + new Date(Date.now() + 120 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  { id: 'tomorrow_morning', label: 'Tomorrow morning (09:00 AM)', value: 'Tomorrow at 09:00 AM' },
  { id: 'tomorrow_evening', label: 'Tomorrow evening (06:00 PM)', value: 'Tomorrow at 06:00 PM' },
  { id: 'monday', label: 'Next Monday at 09:00 AM', value: 'Monday at 09:00 AM' },
];

const ScheduleMessageModalComponent: React.FC<ScheduleMessageModalProps> = ({
  visible,
  onClose,
  onConfirmSchedule,
}) => {
  const { colors, theme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(SCHEDULE_PRESETS[0]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Schedule Message ⏰">
      <View style={styles.content}>
        <Typography variant="body2" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Your message will be automatically sent to the recipient at the selected time.
        </Typography>

        {SCHEDULE_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <TouchableOpacity
              key={preset.id}
              activeOpacity={0.7}
              onPress={() => setSelectedPreset(preset)}
              style={[
                styles.presetRow,
                {
                  backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                  borderColor: isSelected ? colors.primary : colors.borderSubtle,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <View>
                <Typography variant="subtitle2" color={isSelected ? colors.primary : colors.text} bold>
                  {preset.label}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {preset.value}
                </Typography>
              </View>
              {isSelected && (
                <Typography variant="body1" color={colors.primary} bold>
                  ✓
                </Typography>
              )}
            </TouchableOpacity>
          );
        })}

        <Button
          label={`Schedule for ${selectedPreset.label}`}
          variant="primary"
          size="lg"
          onPress={() => {
            onConfirmSchedule(selectedPreset.value);
            onClose();
          }}
          fullWidth
          style={{ marginTop: 14 }}
        />
      </View>
    </BottomSheet>
  );
};

export const ScheduleMessageModal = memo(ScheduleMessageModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
});
