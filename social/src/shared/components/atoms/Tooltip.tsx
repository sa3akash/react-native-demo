import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  LayoutRectangle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const TooltipComponent: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const { colors, theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  return (
    <View style={styles.anchorContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint="Tap to show tooltip description"
      >
        {children}
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            {layout && (
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: colors.text,
                    borderRadius: theme.radius.sm,
                    top: position === 'top' ? Math.max(layout.y - 45, 40) : layout.y + layout.height + 8,
                    left: Math.max(layout.x - 20, 16),
                  },
                ]}
              >
                <Typography variant="caption" color={colors.textInverse} bold>
                  {content}
                </Typography>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export const Tooltip = memo(TooltipComponent);

const styles = StyleSheet.create({
  anchorContainer: {
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bubble: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
});
