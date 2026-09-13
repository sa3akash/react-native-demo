import React, { memo } from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ModalComponent: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
}) => {
  const { colors, theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: theme.radius.lg,
                  borderColor: colors.borderSubtle,
                },
                style,
              ]}
              accessible={true}
              accessibilityViewIsModal={true}
            >
              {title && (
                <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                  <Typography variant="h5" color={colors.text} bold>
                    {title}
                  </Typography>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onClose}
                    style={styles.closeBtn}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Close modal"
                  >
                    <Typography variant="body1" color={colors.textSecondary} bold>
                      ✕
                    </Typography>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.body}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export const Modal = memo(ModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
  },
});
