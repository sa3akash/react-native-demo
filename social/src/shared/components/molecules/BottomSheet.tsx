import React, { memo } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxHeight?: string | number;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
  maxHeight = '80%',
}) => {
  const { colors, theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                {
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: theme.radius.xxl,
                  borderTopRightRadius: theme.radius.xxl,
                  maxHeight,
                },
                style,
              ]}
              accessible={true}
              accessibilityViewIsModal={true}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandleWrap}>
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: colors.borderSubtle, borderRadius: theme.radius.full },
                  ]}
                />
              </View>

              {title && (
                <View style={styles.header}>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    {title}
                  </Typography>
                  <TouchableOpacity
                    onPress={onClose}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Close bottom sheet"
                  >
                    <Typography variant="h3" color={colors.textSecondary}>
                      ✕
                    </Typography>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const BottomSheet = memo(BottomSheetComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    paddingHorizontal: 16,
  },
});
