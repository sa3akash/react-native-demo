import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, Button } from '../../shared/components';
import {
  useSearchStore,
  SortByOption,
  DateRangeOption,
} from '../../store/useSearchStore';

export interface SearchFiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: Array<{ id: SortByOption; label: string; icon: string }> = [
  { id: 'relevance', label: 'Top / Relevance', icon: '🎯' },
  { id: 'recent', label: 'Most Recent', icon: '🕒' },
  { id: 'most_liked', label: 'Most Liked / Popular', icon: '❤️' },
  { id: 'most_viewed', label: 'Most Viewed', icon: '👁️' },
];

const DATE_OPTIONS: Array<{ id: DateRangeOption; label: string }> = [
  { id: 'anytime', label: 'Anytime' },
  { id: 'today', label: 'Past 24 Hours' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'this_year', label: 'This Year' },
];

const SearchFiltersModalComponent: React.FC<SearchFiltersModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const filters = useSearchStore((state) => state.filters);
  const setFilters = useSearchStore((state) => state.setFilters);
  const resetFilters = useSearchStore((state) => state.resetFilters);

  const isRTL = I18nManager.isRTL;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Search Filters ⚙️">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sort By Section */}
        <Typography variant="subtitle2" color={colors.text} bold style={styles.sectionTitle}>
          Sort Results By
        </Typography>
        <View style={styles.optionsWrap}>
          {SORT_OPTIONS.map((opt) => {
            const isSelected = filters.sortBy === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => setFilters({ sortBy: opt.id })}
                style={[
                  styles.optionPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radius.full,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={isSelected ? '#FFFFFF' : colors.text}
                  bold
                >
                  {opt.icon} {opt.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date Range Section */}
        <Typography variant="subtitle2" color={colors.text} bold style={styles.sectionTitle}>
          Date Posted
        </Typography>
        <View style={styles.optionsWrap}>
          {DATE_OPTIONS.map((opt) => {
            const isSelected = filters.dateRange === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => setFilters({ dateRange: opt.id })}
                style={[
                  styles.optionPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radius.full,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={isSelected ? '#FFFFFF' : colors.text}
                  bold
                >
                  {opt.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Verified Accounts Only Switch */}
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
          <View style={{ flex: 1 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Verified Profiles Only ☑️
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Only show verified creators, brands, and public figures
            </Typography>
          </View>
          <Switch
            value={filters.verifiedOnly}
            onValueChange={(val) => setFilters({ verifiedOnly: val })}
            trackColor={{ false: colors.borderSubtle, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            label="Reset Filters"
            variant="ghost"
            size="md"
            onPress={resetFilters}
            style={{ flex: 1 }}
          />
          <Button
            label="Apply Filters"
            variant="primary"
            size="md"
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export const SearchFiltersModal = memo(SearchFiltersModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 4,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  optionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  switchRow: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
});
