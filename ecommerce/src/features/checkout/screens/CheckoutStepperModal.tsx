import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenWrapper, Header, Button, useTheme } from "../../../design-system";
import { MOCK_ADDRESSES, UserAddress } from "../../../core/api/mockData";
import { useCartStore } from "../../cart/store/useCartStore";
import { formatMoney } from "../../../domain/pricing/money";
import { OrderId, toOrderId } from "../../../shared/types/branded";
import { analytics } from "../../../core/analytics/analytics";

export interface CheckoutStepperModalProps {
  onBackToCart: () => void;
  onOrderSuccess: (orderId: OrderId) => void;
}

type CheckoutStep = "ADDRESS" | "DELIVERY" | "PAYMENT" | "REVIEW";

const DELIVERY_OPTIONS = [
  { id: "std", name: "Standard Delivery", est: "3-5 Business Days", fee: 0 },
  { id: "exp", name: "Express Delivery", est: "2 Business Days", fee: 4.99 },
  { id: "prm", name: "Prime Same-Day Delivery", est: "Today by 8 PM", fee: 9.99 },
];

const PAYMENT_METHODS = [
  { id: "cc", name: "Credit / Debit Card (Visa, Mastercard)" },
  { id: "pp", name: "PayPal Express" },
  { id: "cod", name: "Cash on Delivery (COD)" },
  { id: "mb", name: "bKash / Mobile Wallet" },
];

export const CheckoutStepperModal: React.FC<CheckoutStepperModalProps> = ({
  onBackToCart,
  onOrderSuccess,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { getSelectedSubtotal, getTaxEstimate, getGrandTotal, clearCart } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>("ADDRESS");
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(MOCK_ADDRESSES[0]!);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]!);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]!);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSelectedSubtotal();
  const tax = getTaxEstimate();
  const grandTotal = getGrandTotal();

  const STEPS: CheckoutStep[] = ["ADDRESS", "DELIVERY", "PAYMENT", "REVIEW"];
  const currentStepIndex = STEPS.indexOf(step);

  const handleNextStep = () => {
    if (step === "ADDRESS") setStep("DELIVERY");
    else if (step === "DELIVERY") setStep("PAYMENT");
    else if (step === "PAYMENT") setStep("REVIEW");
    else if (step === "REVIEW") handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    await new Promise<void>((res) => setTimeout(() => res(), 1200));
    clearCart();
    const newOrderId = toOrderId(`ord_${Date.now()}`);
    analytics.track({ name: "order_created", properties: { orderId: newOrderId, total: grandTotal.amount } });
    setIsSubmitting(false);
    onOrderSuccess(newOrderId);
  };

  return (
    <ScreenWrapper scrollable>
      <Header title="Checkout" showBack onBackPress={onBackToCart} />

      {/* Stepper Progress Bar */}
      <View style={[styles.stepperContainer, { backgroundColor: colors.secondary, padding: spacing.md }]}>
        {STEPS.map((s, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          return (
            <View key={s} style={styles.stepItem}>
              <View
                style={[
                  styles.stepBadge,
                  {
                    backgroundColor: isCompleted ? colors.success : isActive ? colors.primary : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={[typography.caption, { color: isCompleted || isActive ? "#0F1111" : "#FFFFFF", fontWeight: "700" }]}>
                  {idx + 1}
                </Text>
              </View>
              <Text style={[typography.caption, styles.stepLabel, { color: isActive ? "#FFFFFF" : "#A9ACAC" }]}>
                {s}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ padding: spacing.md }}>
        {/* STEP 1: ADDRESS */}
        {step === "ADDRESS" && (
          <View>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>Select Delivery Address</Text>
            {MOCK_ADDRESSES.map((addr) => {
              const isPicked = selectedAddress.id === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => setSelectedAddress(addr)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isPicked ? colors.primary : colors.borderSubtle,
                      backgroundColor: isPicked ? colors.warningLight : colors.card,
                    },
                  ]}
                >
                  <Text style={[typography.h3, { color: colors.text }]}>{addr.fullName}</Text>
                  <Text style={[typography.body, styles.cardSubtext, { color: colors.textSecondary }]}>
                    {addr.addressLine1}, {addr.city}, {addr.country}
                  </Text>
                  <Text style={[typography.caption, styles.phoneText, { color: colors.textMuted }]}>Phone: {addr.phone}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* STEP 2: DELIVERY SPEED */}
        {step === "DELIVERY" && (
          <View>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>Choose Delivery Speed</Text>
            {DELIVERY_OPTIONS.map((opt) => {
              const isPicked = selectedDelivery.id === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedDelivery(opt)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isPicked ? colors.primary : colors.borderSubtle,
                      backgroundColor: isPicked ? colors.warningLight : colors.card,
                    },
                  ]}
                >
                  <View style={styles.deliveryRow}>
                    <Text style={[typography.h3, { color: colors.text }]}>{opt.name}</Text>
                    <Text style={[typography.body, styles.feeText, { color: colors.price }]}>
                      {opt.fee === 0 ? "FREE" : `$${opt.fee}`}
                    </Text>
                  </View>
                  <Text style={[typography.bodySmall, styles.estText, { color: colors.success }]}>
                    Estimated delivery: {opt.est}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* STEP 3: PAYMENT METHOD */}
        {step === "PAYMENT" && (
          <View>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>Payment Method</Text>
            {PAYMENT_METHODS.map((pm) => {
              const isPicked = selectedPayment.id === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  onPress={() => setSelectedPayment(pm)}
                  style={[
                    styles.optionCard,
                    {
                      borderColor: isPicked ? colors.primary : colors.borderSubtle,
                      backgroundColor: isPicked ? colors.warningLight : colors.card,
                    },
                  ]}
                >
                  <Text style={[typography.body, styles.pmTitle, { color: colors.text }]}>{pm.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* STEP 4: REVIEW & PLACE ORDER */}
        {step === "REVIEW" && (
          <View>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.md }]}>Review Order & Pay</Text>

            <View style={[styles.reviewSection, { backgroundColor: colors.surface, padding: spacing.md }]}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>DELIVER TO:</Text>
              <Text style={[typography.body, styles.boldText, { color: colors.text }]}>{selectedAddress.fullName}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{selectedAddress.addressLine1}, {selectedAddress.city}</Text>

              <Text style={[typography.caption, styles.sectionHeaderMargin, { color: colors.textMuted }]}>PAYMENT METHOD:</Text>
              <Text style={[typography.body, styles.boldText, { color: colors.text }]}>{selectedPayment.name}</Text>

              <Text style={[typography.caption, styles.sectionHeaderMargin, { color: colors.textMuted }]}>DELIVERY SPEED:</Text>
              <Text style={[typography.body, styles.boldText, { color: colors.text }]}>{selectedDelivery.name} ({selectedDelivery.est})</Text>
            </View>

            <View style={[styles.totalCard, { backgroundColor: colors.surface, padding: spacing.md, marginTop: spacing.md }]}>
              <View style={styles.reviewFeeRow}>
                <Text style={[typography.body, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[typography.body, { color: colors.text }]}>{formatMoney(subtotal)}</Text>
              </View>
              <View style={styles.reviewFeeRow}>
                <Text style={[typography.body, { color: colors.textSecondary }]}>Tax (5%)</Text>
                <Text style={[typography.body, { color: colors.text }]}>{formatMoney(tax)}</Text>
              </View>
              <View style={[styles.reviewFeeRow, styles.totalRow, { borderTopColor: colors.borderSubtle }]}>
                <Text style={[typography.h3, { color: colors.text }]}>Total Payment</Text>
                <Text style={[typography.h2, { color: colors.price }]}>{formatMoney(grandTotal)}</Text>
              </View>
            </View>
          </View>
        )}

        <Button
          title={step === "REVIEW" ? "Place Your Order & Pay" : "Continue"}
          onPress={handleNextStep}
          isLoading={isSubmitting}
          style={{ marginTop: spacing.xl }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  optionCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  cardSubtext: {
    marginTop: 2,
  },
  phoneText: {
    marginTop: 4,
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feeText: {
    fontWeight: "700",
  },
  estText: {
    marginTop: 4,
  },
  pmTitle: {
    fontWeight: "700",
  },
  boldText: {
    fontWeight: "700",
  },
  sectionHeaderMargin: {
    marginTop: 12,
  },
  reviewSection: {
    borderRadius: 8,
  },
  totalCard: {
    borderRadius: 8,
  },
  reviewFeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
  },
});
