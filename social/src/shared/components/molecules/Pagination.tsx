import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'dots' | 'numbered';
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'dots',
}) => {
  const { colors, theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  if (totalPages <= 1) return null;

  if (variant === 'dots') {
    return (
      <View
        style={[styles.dotsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        accessible={true}
        accessibilityRole="tablist"
        accessibilityLabel={`Page ${currentPage} of ${totalPages}`}
      >
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isActive = page === currentPage;
          return (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page)}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? colors.primary : colors.border,
                  width: isActive ? 20 : 8,
                  borderRadius: theme.radius.full,
                },
              ]}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Go to page ${page}`}
            />
          );
        })}
      </View>
    );
  }

  // Numbered Pagination
  return (
    <View
      style={[styles.numberedContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      accessible={true}
      accessibilityRole="tablist"
    >
      <TouchableOpacity
        disabled={currentPage <= 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[styles.arrowBtn, { opacity: currentPage <= 1 ? 0.3 : 1 }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
      >
        <Typography variant="body1" color={colors.text}>
          ◀
        </Typography>
      </TouchableOpacity>

      <Typography variant="subtitle2" color={colors.text} bold style={styles.pageText}>
        Page {currentPage} of {totalPages}
      </Typography>

      <TouchableOpacity
        disabled={currentPage >= totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={[styles.arrowBtn, { opacity: currentPage >= totalPages ? 0.3 : 1 }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Next page"
      >
        <Typography variant="body1" color={colors.text}>
          ▶
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

export const Pagination = memo(PaginationComponent);

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    height: 8,
  },
  numberedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  arrowBtn: {
    padding: 8,
  },
  pageText: {
    marginHorizontal: 16,
  },
});
