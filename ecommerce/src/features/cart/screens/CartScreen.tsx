import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  Header,
  Price,
  Button,
  QuantitySelector,
  EmptyState,
  useTheme,
} from '../../../design-system';
import { useCartStore } from '../store/useCartStore';
import { formatMoney } from '../../../domain/pricing/money';

export interface CartScreenProps {
  onProceedToCheckout: () => void;
  onNavigateToHome: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onProceedToCheckout,
  onNavigateToHome,
}) => {
  const { colors, spacing, typography } = useTheme();
  const {
    items,
    getSellerGroups,
    getSelectedSubtotal,
    getTaxEstimate,
    getShippingEstimate,
    getGrandTotal,
    updateQuantity,
    removeFromCart,
    toggleSelection,
  } = useCartStore();

  const sellerGroups = getSellerGroups();
  const subtotal = getSelectedSubtotal();
  const tax = getTaxEstimate();
  const shipping = getShippingEstimate();
  const grandTotal = getGrandTotal();
  const selectedCount = items
    .filter((i: any) => i.selected)
    .reduce((acc: number, i: any) => acc + i.quantity, 0);

  if (items.length === 0) {
    return (
      <ScreenWrapper>
        <Header title="Your Shopping Cart" />
        <EmptyState
          icon="🛒"
          title="Your Amazon Cart is empty"
          message="Explore top deals and add items to your cart to get started."
          actionTitle="Continue Shopping"
          onAction={onNavigateToHome}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable>
      <Header title="Your Shopping Cart" />

      {/* Top Checkout Summary Box */}
      <View
        style={[
          styles.summaryBox,
          { backgroundColor: colors.surface, padding: spacing.md },
        ]}
      >
        <Text style={[typography.h3, { color: colors.text }]}>
          Subtotal ({selectedCount} items):{' '}
          <Text style={[styles.subtotalPriceText, { color: colors.price }]}>
            {formatMoney(subtotal)}
          </Text>
        </Text>
        <Text
          style={[
            typography.caption,
            styles.freeDelText,
            { color: colors.success },
          ]}
        >
          ✓ Your order qualifies for FREE Delivery
        </Text>
        <Button
          title={`Proceed to Retail Checkout (${selectedCount})`}
          onPress={onProceedToCheckout}
          disabled={selectedCount === 0}
          style={{ marginTop: spacing.md }}
        />
      </View>

      {/* Seller Grouped Items */}
      <View style={{ padding: spacing.md }}>
        {sellerGroups.map((group: any) => (
          <View
            key={group.sellerId}
            style={[
              styles.sellerCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <View
              style={[
                styles.sellerHeader,
                { backgroundColor: colors.background, padding: spacing.xs + 2 },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  styles.sellerTitleText,
                  { color: colors.text },
                ]}
              >
                Seller: {group.sellerName}
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Subtotal: {formatMoney(group.subtotal)}
              </Text>
            </View>

            {group.items.map((cartItem: any) => {
              const activePrice =
                cartItem.selectedVariant?.price ?? cartItem.product.price;
              return (
                <View
                  key={cartItem.id}
                  style={[
                    styles.cartItemRow,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  {/* Select Checkbox */}
                  <TouchableOpacity
                    onPress={() => toggleSelection(cartItem.id)}
                    style={styles.checkTouch}
                  >
                    <Text style={styles.checkIcon}>
                      {cartItem.selected ? '☑' : '☐'}
                    </Text>
                  </TouchableOpacity>

                  <Image
                    source={{ uri: cartItem.product.thumbnail }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />

                  <View style={styles.itemDetails}>
                    <Text
                      style={[
                        typography.bodySmall,
                        styles.itemTitleText,
                        { color: colors.text },
                      ]}
                      numberOfLines={2}
                    >
                      {cartItem.product.title}
                    </Text>
                    {cartItem.selectedVariant && (
                      <Text
                        style={[
                          typography.caption,
                          styles.variantAttrText,
                          { color: colors.textMuted },
                        ]}
                      >
                        {Object.entries(cartItem.selectedVariant.attributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' | ')}
                      </Text>
                    )}
                    <Price
                      price={activePrice}
                      size="sm"
                      style={styles.priceMarginTop}
                    />

                    <View style={styles.controlRow}>
                      <QuantitySelector
                        quantity={cartItem.quantity}
                        onQuantityChange={qty =>
                          updateQuantity(cartItem.id, qty)
                        }
                      />
                      <TouchableOpacity
                        onPress={() => removeFromCart(cartItem.id)}
                        style={styles.deleteBtn}
                      >
                        <Text
                          style={[
                            typography.caption,
                            styles.deleteText,
                            { color: colors.error },
                          ]}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Financial Calculation Breakdown Card */}
        <View
          style={[
            styles.breakdownCard,
            { backgroundColor: colors.surface, padding: spacing.md },
          ]}
        >
          <Text
            style={[
              typography.h3,
              { color: colors.text, marginBottom: spacing.sm },
            ]}
          >
            Order Summary
          </Text>
          <View style={styles.feeRow}>
            <Text
              style={[typography.bodySmall, { color: colors.textSecondary }]}
            >
              Items Subtotal
            </Text>
            <Text style={[typography.bodySmall, { color: colors.text }]}>
              {formatMoney(subtotal)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text
              style={[typography.bodySmall, { color: colors.textSecondary }]}
            >
              Estimated Tax (5%)
            </Text>
            <Text style={[typography.bodySmall, { color: colors.text }]}>
              {formatMoney(tax)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text
              style={[typography.bodySmall, { color: colors.textSecondary }]}
            >
              Shipping & Handling
            </Text>
            <Text style={[typography.bodySmall, { color: colors.text }]}>
              {shipping.amount === 0 ? 'FREE' : formatMoney(shipping)}
            </Text>
          </View>
          <View
            style={[
              styles.feeRow,
              styles.totalRow,
              { borderTopColor: colors.borderSubtle },
            ]}
          >
            <Text style={[typography.h3, { color: colors.text }]}>
              Grand Total
            </Text>
            <Text style={[typography.h2, { color: colors.price }]}>
              {formatMoney(grandTotal)}
            </Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  summaryBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subtotalPriceText: {
    fontWeight: '800',
  },
  freeDelText: {
    marginTop: 2,
  },
  sellerCard: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sellerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  sellerTitleText: {
    fontWeight: '700',
  },
  cartItemRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.5,
  },
  checkTouch: {
    justifyContent: 'center',
    marginRight: 8,
  },
  checkIcon: {
    fontSize: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitleText: {
    fontWeight: '600',
  },
  variantAttrText: {
    marginTop: 2,
  },
  priceMarginTop: {
    marginTop: 4,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtn: {
    marginLeft: 16,
  },
  deleteText: {
    fontWeight: '700',
  },
  breakdownCard: {
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 32,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
});
