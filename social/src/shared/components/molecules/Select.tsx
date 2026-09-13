import React, { useState, useMemo, memo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';
import { SearchBar } from './SearchBar';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  error?: string;
  searchable?: boolean;
  disabled?: boolean;
}

const SelectComponent: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  selectedValue,
  onSelect,
  error,
  searchable = true,
  disabled = false,
}) => {
  const { colors, theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = I18nManager.isRTL;

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selectedValue),
    [options, selectedValue]
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="subtitle2" color={colors.text} bold style={styles.label}>
          {label}
        </Typography>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.danger : colors.inputBorder,
            borderRadius: theme.radius.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        accessible={true}
        accessibilityRole="combobox"
        accessibilityLabel={label || 'Select input'}
      >
        <Typography
          variant="body1"
          color={selectedOption ? colors.text : colors.textMuted}
          style={styles.selectedText}
        >
          {selectedOption ? `${selectedOption.icon ? selectedOption.icon + ' ' : ''}${selectedOption.label}` : placeholder}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary}>
          ▼
        </Typography>
      </TouchableOpacity>

      {error && (
        <Typography variant="caption" color={colors.danger} style={styles.errorText}>
          {error}
        </Typography>
      )}

      {/* Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderRadius: theme.radius.xl }]}>
            <View style={styles.sheetHeader}>
              <Typography variant="subtitle1" color={colors.text} bold>
                {label || 'Select Option'}
              </Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Typography variant="h3" color={colors.textSecondary}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchWrap}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search options..."
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <View style={styles.optionTextCol}>
                      <Typography
                        variant="body1"
                        color={isSelected ? colors.primary : colors.text}
                        bold={isSelected}
                      >
                        {item.icon ? `${item.icon} ` : ''}
                        {item.label}
                      </Typography>
                      {item.sublabel && (
                        <Typography variant="caption" color={colors.textSecondary}>
                          {item.sublabel}
                        </Typography>
                      )}
                    </View>
                    {isSelected && (
                      <Typography variant="body1" color={colors.primary} bold>
                        ✓
                      </Typography>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const Select = memo(SelectComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  trigger: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    flex: 1,
  },
  errorText: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '75%',
    paddingTop: 16,
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  optionsList: {
    paddingHorizontal: 10,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  optionTextCol: {
    flex: 1,
  },
});
