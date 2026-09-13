import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Product } from "../../../core/api/mockData";
import { Card, Price, Rating, DiscountBadge, Button, useTheme } from "../../../design-system";
import { useCartStore } from "../../cart/store/useCartStore";
import { ProductId } from "../../../shared/types/branded";
import { analytics } from "../../../core/analytics/analytics";

export interface ProductCardProps {
  product: Product;
  onPress: (productId: ProductId) => void;
  style?: ViewStyle;
  variant?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  variant = "grid",
}) => {
  const { colors, typography } = useTheme();
  const addToCart = useCartStore((state: any) => state.addToCart);

  const handleAddToCart = (e: any) => {
    e?.stopPropagation?.();
    analytics.track({ name: "add_to_cart", properties: { productId: product.id } });
    addToCart(product, undefined, 1);
  };

  if (variant === "list") {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(product.id)}
        style={[styles.listContainer, { backgroundColor: colors.card, borderColor: colors.borderSubtle }, style]}
      >
        <Image source={{ uri: product.thumbnail }} style={styles.listImage} resizeMode="contain" />
        <View style={styles.listContent}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{product.brand}</Text>
          <Text style={[typography.bodySmall, styles.titleText, { color: colors.text }]} numberOfLines={2}>
            {product.title}
          </Text>
          <Rating rating={product.rating} reviewCount={product.reviewCount} style={styles.ratingSpacing} />
          <Price price={product.price} originalPrice={product.originalPrice} size="sm" />
          {product.isPrime && <Text style={[styles.primeBadge, { color: colors.prime }]}>✓prime</Text>}
          <Button title="Add to Cart" size="sm" onPress={handleAddToCart} style={styles.addBtnMargin} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Card elevation="sm" style={StyleSheet.flatten([styles.gridContainer, style])}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(product.id)}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.gridImage} resizeMode="contain" />
          {product.discountPercentage > 0 && (
            <DiscountBadge percentage={product.discountPercentage} style={styles.discountBadge} />
          )}
        </View>

        <View style={styles.infoWrapper}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{product.brand}</Text>
          <Text style={[typography.bodySmall, styles.titleText, { color: colors.text }]} numberOfLines={2}>
            {product.title}
          </Text>

          <Rating rating={product.rating} reviewCount={product.reviewCount} style={styles.ratingSpacing} />

          <Price price={product.price} originalPrice={product.originalPrice} size="sm" />

          {product.isPrime && <Text style={[styles.primeBadge, { color: colors.prime }]}>✓prime</Text>}

          <Button title="Add to Cart" size="sm" onPress={handleAddToCart} style={styles.addBtnMargin} />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    width: 170,
    marginRight: 12,
    marginBottom: 12,
    padding: 10,
  },
  imageWrapper: {
    width: "100%",
    height: 130,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  discountBadge: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  infoWrapper: {
    marginTop: 8,
  },
  titleText: {
    fontWeight: "600",
  },
  ratingSpacing: {
    marginVertical: 4,
  },
  addBtnMargin: {
    marginTop: 8,
  },
  primeBadge: {
    fontSize: 12,
    fontWeight: "900",
    fontStyle: "italic",
    marginTop: 2,
  },
  listContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  listImage: {
    width: 110,
    height: 110,
    borderRadius: 6,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
});
