import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, SearchBar, Button, Card, SegmentedControl } from '../../shared/components';
import { useMarketplaceStore, ProductItem } from '../../store/useMarketplaceStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { ProductDetailScreen } from './ProductDetailScreen';
import { CreateListingModal } from './CreateListingModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;

export interface MarketplaceScreenProps {
  onNavigateToChat?: (conversationId: string) => void;
  onChatSeller?: (name: string) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All 🛒' },
  { id: 'Electronics', label: '💻 Electronics' },
  { id: 'Vehicles', label: '🚗 Vehicles' },
  { id: 'Furniture', label: '🪑 Furniture' },
  { id: 'wishlist', label: '❤️ Wishlist' },
];

export const MarketplaceScreenComponent: React.FC<MarketplaceScreenProps> = ({
  onNavigateToChat,
}) => {
  const { colors, theme } = useTheme();
  const products = useMarketplaceStore((state) => state.getFilteredProducts());
  const searchQuery = useMarketplaceStore((state) => state.searchQuery);
  const setSearchQuery = useMarketplaceStore((state) => state.setSearchQuery);
  const filters = useMarketplaceStore((state) => state.filters);
  const setFilters = useMarketplaceStore((state) => state.setFilters);
  const wishlistIds = useMarketplaceStore((state) => state.wishlistIds);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const { showToast } = useToast();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (selectedProductId) {
    return (
      <ProductDetailScreen
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
        onNavigateToChat={onNavigateToChat}
      />
    );
  }

  const getConditionText = (cond: string) => {
    switch (cond) {
      case 'new':
        return '✨ New';
      case 'like_new':
        return '🌟 Like New';
      default:
        return 'Used';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitleRow}>
          <Typography variant="h2" color={colors.text} bold>
            Marketplace
          </Typography>
          <Button
            label="+ Sell"
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          />
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, vehicles, electronics..."
        />

        {/* Category Filter Pills */}
        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={CATEGORY_TABS}
            activeId={filters.category}
            onSelect={(id) => setFilters({ category: id })}
            size="sm"
          />
        </View>
      </View>

      {/* 2-Column Product Grid */}
      <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              🛍️
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Listings Found
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              {filters.category === 'wishlist'
                ? 'Your wishlist is empty. Tap the heart on any item to save it.'
                : 'Try adjusting your search query or category filters.'}
            </Typography>
          </View>
        ) : (
          <View style={styles.gridRow}>
            {products.map((item) => {
              const isSaved = wishlistIds.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedProductId(item.id)}
                  style={[styles.productCard, { width: CARD_WIDTH, backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
                >
                  <View style={styles.thumbWrap}>
                    <Image source={{ uri: item.images[0] }} style={styles.cardImage} resizeMode="cover" />

                    {/* Wishlist Heart */}
                    <TouchableOpacity
                      onPress={() => {
                        toggleWishlist(item.id);
                        showToast({
                          message: isSaved ? 'Removed from Wishlist' : 'Saved to Wishlist! ❤️',
                          type: 'info',
                        });
                      }}
                      style={styles.cardHeartBtn}
                    >
                      <Typography variant="caption" style={{ fontSize: 16 }}>
                        {isSaved ? '❤️' : '🤍'}
                      </Typography>
                    </TouchableOpacity>

                    {/* Condition Tag */}
                    <View style={styles.conditionTag}>
                      <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                        {getConditionText(item.condition)}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Typography variant="subtitle1" color={colors.primary} bold>
                      {item.currency}{item.price.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1} style={{ marginTop: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 2 }}>
                      📍 {item.location}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create Listing Modal */}
      <CreateListingModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(id) => setSelectedProductId(id)}
      />
    </View>
  );
};

export const MarketplaceScreen = memo(MarketplaceScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridContent: {
    padding: 16,
    paddingBottom: 40,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardHeartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardBody: {
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    width: '100%',
  },
});
