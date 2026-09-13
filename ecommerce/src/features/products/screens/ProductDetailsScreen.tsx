import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ScreenWrapper, Header, Price, Rating, DiscountBadge, Button, QuantitySelector, useTheme } from "../../../design-system";
import { mockApi } from "../../../core/api/mockApi";
import { Product, ProductVariant, Review } from "../../../core/api/mockData";
import { ProductId } from "../../../shared/types/branded";
import { useCartStore } from "../../cart/store/useCartStore";
import { formatMoney } from "../../../domain/pricing/money";
import { analytics } from "../../../core/analytics/analytics";

export interface ProductDetailsScreenProps {
  productId: ProductId;
  onBack: () => void;
  onNavigateToCart: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  productId,
  onBack,
  onNavigateToCart,
}) => {
  const { colors, spacing, typography } = useTheme();
  const addToCart = useCartStore((state: any) => state.addToCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([mockApi.getProductDetails(productId), mockApi.getReviews(productId)]).then(
      ([prodRes, revRes]) => {
        setProduct(prodRes.data);
        setReviews(revRes.data);
        if (prodRes.data.variants && prodRes.data.variants.length > 0) {
          const firstVariant = prodRes.data.variants[0]!;
          setSelectedVariant(firstVariant);
          setSelectedAttributes(firstVariant.attributes);
        }
        setIsLoading(false);
      }
    );
  }, [productId]);

  const handleAttributeSelect = (key: string, value: string) => {
    if (!product?.variants) return;
    const nextAttributes = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(nextAttributes);

    const matched = product.variants.find((v) =>
      Object.entries(nextAttributes).every(([k, val]) => v.attributes[k] === val)
    );
    if (matched) {
      setSelectedVariant(matched);
    }
  };

  if (isLoading || !product) {
    return (
      <ScreenWrapper>
        <Header showBack onBackPress={onBack} title="Product Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  const activePrice = selectedVariant?.price ?? product.price;
  const activeOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const images = selectedVariant?.images ?? product.images;
  const activeImage = images[selectedImageIndex] || product.thumbnail;

  const handleAddToCart = () => {
    analytics.track({ name: "add_to_cart", properties: { productId: product.id, quantity } });
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    analytics.track({ name: "checkout_started", properties: { productId: product.id, quantity } });
    addToCart(product, selectedVariant, quantity);
    onNavigateToCart();
  };

  return (
    <ScreenWrapper scrollable>
      <Header showBack onBackPress={onBack} title={product.brand} />

      {/* Main Image Gallery */}
      <View style={[styles.galleryContainer, { backgroundColor: colors.surface }]}>
        <Image source={{ uri: activeImage }} style={styles.mainImage} resizeMode="contain" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
          {images.map((imgUrl, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedImageIndex(idx)}
              style={[
                styles.thumbWrapper,
                { borderColor: idx === selectedImageIndex ? colors.primary : colors.border },
              ]}
            >
              <Image source={{ uri: imgUrl }} style={styles.thumbImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.detailsContent, { padding: spacing.md }]}>
        {/* Brand & Title */}
        <Text style={[typography.caption, styles.brandText, { color: colors.info }]}>
          Visit the {product.brand} Store
        </Text>
        <Text style={[typography.h2, styles.titleText, { color: colors.text }]}>{product.title}</Text>

        {/* Rating & Seller */}
        <View style={styles.ratingRow}>
          <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
          <Text style={[typography.caption, { color: colors.textMuted, marginLeft: spacing.md }]}>
            Seller: {product.sellerName} (★ {product.sellerRating})
          </Text>
        </View>

        {/* Price & Discounts */}
        <View style={styles.priceContainer}>
          <DiscountBadge percentage={product.discountPercentage} />
          <Price price={activePrice} originalPrice={activeOriginalPrice} size="lg" style={styles.priceMargin} />
          {product.isPrime && <Text style={[styles.primeBadge, { color: colors.prime }]}>✓prime FREE One-Day Delivery</Text>}
          {product.emiAvailable && product.emiStartingPrice && (
            <Text style={[typography.caption, styles.emiText, { color: colors.textSecondary }]}>
              EMI starts at <Text style={styles.boldText}>{formatMoney(product.emiStartingPrice)}/month</Text>.
            </Text>
          )}
        </View>

        {/* Dynamic Variants System */}
        {product.attributes && (
          <View style={styles.variantContainer}>
            {Object.entries(product.attributes).map(([attrKey, options]) => (
              <View key={attrKey} style={{ marginBottom: spacing.md }}>
                <Text style={[typography.bodySmall, styles.attrHeader, { color: colors.text }]}>
                  {attrKey}: {selectedAttributes[attrKey]}
                </Text>
                <View style={styles.chipRow}>
                  {options.map((opt) => {
                    const isSelected = selectedAttributes[attrKey] === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => handleAttributeSelect(attrKey, opt)}
                        style={[
                          styles.chip,
                          {
                            borderColor: isSelected ? colors.primary : colors.border,
                            backgroundColor: isSelected ? colors.warningLight : colors.surface,
                          },
                        ]}
                      >
                        <Text style={[typography.caption, { color: isSelected ? colors.warning : colors.text, fontWeight: isSelected ? "700" : "400" }]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Stock & Delivery Estimate */}
        <View style={styles.stockBox}>
          <Text style={[typography.body, styles.boldText, { color: product.stock > 0 ? colors.success : colors.error }]}>
            {product.stock > 0 ? `In Stock (${product.stock} units left)` : "Currently Out of Stock"}
          </Text>
          <Text style={[typography.caption, styles.deliveryEstText, { color: colors.textSecondary }]}>
            FREE Delivery by <Text style={styles.boldText}>Tomorrow, 2 PM</Text>
          </Text>
        </View>

        {/* Quantity Selector */}
        <View style={{ marginVertical: spacing.md }}>
          <Text style={[typography.bodySmall, styles.attrHeader, { color: colors.text }]}>
            Quantity:
          </Text>
          <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button title="Add to Cart" onPress={handleAddToCart} variant="primary" style={styles.flexBtnRight} />
          <Button title="Buy Now" onPress={handleBuyNow} variant="secondary" style={styles.flexBtn} />
        </View>

        {/* Product Highlights */}
        <View style={styles.sectionBox}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.xs }]}>About this item</Text>
          {product.highlights.map((item, idx) => (
            <Text key={idx} style={[typography.bodySmall, styles.bulletText, { color: colors.textSecondary }]}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Technical Specs */}
        <View style={styles.sectionBox}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.xs }]}>Technical Details</Text>
          {Object.entries(product.specifications).map(([key, val]) => (
            <View key={key} style={styles.specRow}>
              <Text style={[typography.caption, styles.specKey, { color: colors.textMuted }]}>{key}</Text>
              <Text style={[typography.bodySmall, styles.specVal, { color: colors.text }]}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={styles.sectionBox}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>Customer Reviews</Text>
          {reviews.map((rev) => (
            <View key={rev.id} style={[styles.reviewCard, { borderColor: colors.borderSubtle }]}>
              <Text style={[typography.bodySmall, styles.boldText, { color: colors.text }]}>{rev.userName}</Text>
              <Rating rating={rev.rating} showCount={false} style={styles.reviewRating} />
              <Text style={[typography.bodySmall, styles.reviewTitle, { color: colors.text }]}>{rev.title}</Text>
              <Text style={[typography.caption, styles.reviewComment, { color: colors.textSecondary }]}>{rev.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryContainer: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: 280,
  },
  thumbScroll: {
    marginTop: 12,
  },
  thumbWrapper: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 2,
    marginHorizontal: 4,
    overflow: "hidden",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  detailsContent: {
    width: "100%",
  },
  brandText: {
    fontWeight: "700",
  },
  titleText: {
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  priceContainer: {
    marginTop: 12,
  },
  priceMargin: {
    marginTop: 4,
  },
  primeBadge: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  emiText: {
    marginTop: 4,
  },
  boldText: {
    fontWeight: "700",
  },
  variantContainer: {
    marginTop: 16,
  },
  attrHeader: {
    fontWeight: "700",
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
  stockBox: {
    marginTop: 12,
  },
  deliveryEstText: {
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  flexBtnRight: {
    flex: 1,
    marginRight: 8,
  },
  flexBtn: {
    flex: 1,
  },
  sectionBox: {
    marginTop: 24,
  },
  bulletText: {
    marginBottom: 4,
  },
  specRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  specKey: {
    width: 120,
  },
  specVal: {
    flex: 1,
  },
  reviewCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewRating: {
    marginVertical: 2,
  },
  reviewTitle: {
    fontWeight: "600",
    marginTop: 2,
  },
  reviewComment: {
    marginTop: 2,
  },
});
