import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenWrapper, SearchInput, useTheme } from '../../../design-system';

export interface SearchScreenProps {
  onSearchSubmit: (query: string) => void;
  onBack?: () => void;
}

const RECENT_SEARCHES = [
  'iPhone 16 Pro Max',
  'Sony WH-1000XM5',
  'MacBook Pro M3',
  'Nike Air Max',
];
const TRENDING_SEARCHES = [
  'AirPods Pro 2',
  'Samsung Galaxy S24 Ultra',
  'PS5 Console',
  '4K OLED TV',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSearchSubmit,
}) => {
  const { colors, spacing, typography } = useTheme();
  const [query, setQuery] = useState('');

  const handleSelect = (term: string) => {
    setQuery(term);
    onSearchSubmit(term);
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.secondary, padding: spacing.md },
        ]}
      >
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onSubmit={() => onSearchSubmit(query)}
          autoFocus
          placeholder="Search products, brands, categories..."
        />
      </View>

      <View style={{ padding: spacing.md }}>
        {/* Recent Searches */}
        <Text
          style={[
            typography.h3,
            { color: colors.text, marginBottom: spacing.sm },
          ]}
        >
          Recent Searches
        </Text>
        {RECENT_SEARCHES.map(term => (
          <TouchableOpacity
            key={term}
            onPress={() => handleSelect(term)}
            style={styles.searchItem}
          >
            <Text style={styles.clockIcon}>🕒</Text>
            <Text
              style={[
                typography.body,
                { color: colors.text, marginLeft: spacing.sm },
              ]}
            >
              {term}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Trending Searches */}
        <Text
          style={[
            typography.h3,
            {
              color: colors.text,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Trending on Amazon
        </Text>
        {TRENDING_SEARCHES.map(term => (
          <TouchableOpacity
            key={term}
            onPress={() => handleSelect(term)}
            style={styles.searchItem}
          >
            <Text style={styles.clockIcon}>🔥</Text>
            <Text
              style={[
                typography.body,
                { color: colors.text, marginLeft: spacing.sm },
              ]}
            >
              {term}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  clockIcon: {
    fontSize: 16,
  },
});
