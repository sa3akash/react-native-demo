import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenWrapper, Header, useTheme } from "../../../design-system";
import { mockApi } from "../../../core/api/mockApi";
import { Order } from "../../../core/api/mockData";
import { OrderId } from "../../../shared/types/branded";

export interface OrderTrackingScreenProps {
  orderId: OrderId;
  onBack: () => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ orderId, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    mockApi.getOrderDetails(orderId).then((res) => setOrder(res.data));
  }, [orderId]);

  if (!order) return null;

  return (
    <ScreenWrapper scrollable>
      <Header title={`Order #${order.id}`} showBack onBackPress={onBack} />

      <View style={[styles.card, { backgroundColor: colors.card, margin: spacing.md, padding: spacing.md }]}>
        <Text style={[typography.h2, { color: colors.text }]}>Tracking Timeline</Text>
        <Text style={[typography.caption, styles.estText, { color: colors.success }]}>
          Estimated Delivery: {order.estimatedDeliveryDate}
        </Text>

        {/* Timeline step view */}
        <View style={styles.timelineWrapper}>
          {order.timeline.map((step, idx) => {
            const isLast = idx === order.timeline.length - 1;
            return (
              <View key={step.status} style={styles.timelineRow}>
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: step.completed
                          ? colors.success
                          : step.current
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.stepNumText}>
                      {step.completed ? "✓" : idx + 1}
                    </Text>
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.line,
                        { backgroundColor: step.completed ? colors.success : colors.border },
                      ]}
                    />
                  )}
                </View>

                <View style={[styles.rightCol, { paddingBottom: isLast ? 0 : spacing.lg }]}>
                  <Text
                    style={[
                      typography.body,
                      {
                        color: step.current ? colors.primary : step.completed ? colors.text : colors.textMuted,
                        fontWeight: step.current || step.completed ? "700" : "400",
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {step.timestamp && (
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>{step.timestamp}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  estText: {
    fontWeight: "700",
    marginTop: 2,
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  timelineWrapper: {
    marginTop: 20,
  },
  timelineRow: {
    flexDirection: "row",
  },
  leftCol: {
    alignItems: "center",
    marginRight: 12,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  rightCol: {
    flex: 1,
  },
});
