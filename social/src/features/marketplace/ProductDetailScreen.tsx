import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button } from '../../shared/components';
import { useMarketplaceStore, ProductItem } from '../../store/useMarketplaceStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { ChatSellerModal } from './ChatSellerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProductDetailScreenProps {
  productId: string;
  onBack: () => void;
  onNavigateToChat?: (conversationId: string) => void;
}

const ProductDetailScreenComponent: React.FC<ProductDetailScreenProps> = ({
  productId,
  onBack,
  onNavigateToChat,
}) => {
  const { colors, theme } = useTheme();
  const product = useMarketplaceStore((state) => state.products.find((p) => p.id === productId));
  const wishlistIds = useMarketplaceStore((state) => state.wishlistIds);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const { showToast } = useToast();

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const isRTL = I18nManager.isRTL;

  if (!product) return null;

  const isSaved = wishlistIds.includes(product.id);

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case 'new':
        return '✨ Brand New';
      case 'like_new':
        return '🌟 Like New';
      case 'good':
        return '👍 Good Condition';
      default:
        return 'Fair Condition';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image Carousel */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.images[0] }} style={styles.heroImage} resizeMode="cover" />

          {/* Floating Back Button */}
          <TouchableOpacity onPress={onBack} style={styles.floatingBackBtn}>
            <Typography variant="h3" color="#FFFFFF">
              {isRTL ? '➡️' : '⬅️'}
            </Typography>
          </TouchableOpacity>

          {/* Floating Wishlist Heart */}
          <TouchableOpacity
            onPress={() => {
              toggleWishlist(product.id);
              showToast({
                message: isSaved ? 'Removed from Wishlist' : 'Saved to Wishlist! ❤️',
                type: 'info',
              });
            }}
            style={[styles.floatingWishlistBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
          >
            <Typography variant="h3">{isSaved ? '❤️' : '🤍'}</Typography>
          </TouchableOpacity>
        </View>

        {/* Product Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.priceRow}>
            <Typography variant="h1" color={colors.primary} bold>
              {product.currency}{product.price.toLocaleString()}
            </Typography>
            <View style={[styles.conditionPill, { backgroundColor: colors.surfaceElevated }]}>
              <Typography variant="caption" color={colors.text} bold>
                {getConditionBadge(product.condition)}
              </Typography>
            </View>
          </View>

          <Typography variant="h3" color={colors.text} bold style={styles.titleText}>
            {product.title}
          </Typography>

          <View style={styles.locationRow}>
            <Typography variant="caption" color={colors.textSecondary}>
              📍 Listed in {product.location} • {product.createdAt}
            </Typography>
          </View>
        </View>

        {/* Seller Info Card */}
        <View style={[styles.sellerCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 10 }}>
            Seller Information
          </Typography>
          <View style={styles.sellerRow}>
            <Avatar uri={product.sellerAvatar} name={product.sellerName} size="md" />
            <View style={styles.sellerDetails}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="subtitle1" color={colors.text} bold>
                  {product.sellerName}
                </Typography>
                {product.sellerVerified && (
                  <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
                    ☑️
                  </Typography>
                )}
              </View>
              <Typography variant="caption" color={colors.textSecondary}>
                ⭐ {product.sellerRating} • Highly rated seller • Fast responder
              </Typography>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.descCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 8 }}>
            Description
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={styles.descBody}>
            {product.description}
          </Typography>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomActionBar, { backgroundColor: colors.surface, borderTopColor: colors.borderSubtle }]}>
        <Button
          label="Make an Offer 🏷️"
          variant="ghost"
          size="lg"
          onPress={() => setIsChatModalOpen(true)}
          style={{ flex: 1 }}
        />
        <Button
          label="Message Seller 💬"
          variant="primary"
          size="lg"
          onPress={() => setIsChatModalOpen(true)}
          style={{ flex: 1.4 }}
        />
      </View>

      {/* Chat Seller Modal */}
      <ChatSellerModal
        visible={isChatModalOpen}
        product={product}
        onClose={() => setIsChatModalOpen(false)}
        onNavigateToChat={onNavigateToChat}
      />
    </View>
  );
};

export const ProductDetailScreen = memo(ProductDetailScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  floatingWishlistBtn: {
    position: 'absolute',
    top: 40,
    right: 16,
    padding: 8,
    borderRadius: 20,
  },
  infoCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conditionPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  titleText: {
    marginTop: 10,
  },
  locationRow: {
    marginTop: 6,
  },
  sellerCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  descCard: {
    padding: 16,
  },
  descBody: {
    lineHeight: 22,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
  },
});
