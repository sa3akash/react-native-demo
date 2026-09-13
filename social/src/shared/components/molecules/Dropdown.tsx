import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutRectangle,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface DropdownProps {
  items: DropdownMenuItem[];
  children: React.ReactNode;
}

const DropdownComponent: React.FC<DropdownProps> = ({ items, children }) => {
  const { colors, theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(null);
  const isRTL = I18nManager.isRTL;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        onLayout={(e) => setAnchorLayout(e.nativeEvent.layout)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            {anchorLayout && (
              <View
                style={[
                  styles.menuCard,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.borderSubtle,
                    borderRadius: theme.radius.lg,
                    top: anchorLayout.y + anchorLayout.height + 6,
                    left: Math.max(anchorLayout.x - 100, 16),
                  },
                ]}
              >
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      setVisible(false);
                      item.onPress();
                    }}
                    style={[
                      styles.menuItem,
                      { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                  >
                    {item.icon && (
                      <Typography variant="body1" style={styles.itemIcon}>
                        {item.icon}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color={item.destructive ? colors.danger : colors.text}
                      bold={item.destructive}
                    >
                      {item.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export const Dropdown = memo(DropdownComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuCard: {
    position: 'absolute',
    minWidth: 180,
    paddingVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
});
