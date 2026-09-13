import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { ScreenWrapper, Header, Price, useTheme } from "../../../design-system";
import { mockApi } from "../../../core/api/mockApi";
import { Order } from "../../../core/api/mockData";
import { OrderId } from "../../../shared/types/branded";

export interface OrderListScreenProps {
  onSelectOrder: (orderId: OrderId) => void;
}

export const OrderListScreen: React.FC<OrderListScreenProps> = ({ onSelectOrder }) => {
  const { colors, spacing, typography, radius } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    mockApi.getOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <ScreenWrapper>
      <Header title="Your Orders & Tracking" />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectOrder(item.id)}
            style={[
              styles.orderCard,
              { backgroundColor: colors.card, borderColor: colors.borderSubtle, borderRadius: radius.md },
            ]}
          >
            <View style={[styles.cardHeader, { backgroundColor: colors.background, padding: spacing.xs + 2 }]}>
              <View>
                <Text style={[typography.caption, { color: colors.textMuted }]}>ORDER PLACED</Text>
                <Text style={[typography.caption, styles.boldText, { color: colors.text }]}>
                  {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </Text>
              </View>
              <View style={styles.rightAlignHeader}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>TOTAL</Text>
                <Price price={item.grandTotal} size="sm" />
              </View>
            </View>

            <View style={{ padding: spacing.md }}>
              <Text style={[typography.body, styles.statusText, { color: colors.success }]}>
                Status: {item.status.replace(/_/g, " ")}
              </Text>

              {item.items.map((ordItem, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Image source={{ uri: ordItem.productImage }} style={styles.productImg} resizeMode="contain" />
                  <View style={styles.flexItem}>
                    <Text style={[typography.bodySmall, styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                      {ordItem.productTitle}
                    </Text>
                    <Text style={[typography.caption, styles.qtyText, { color: colors.textMuted }]}>
                      Qty: {ordItem.quantity}
                    </Text>
                  </View>
                </View>
              ))}

              <Text style={[typography.caption, styles.trackText, { color: colors.info }]}>
                Track Package →
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  boldText: {
    fontWeight: "700",
  },
  rightAlignHeader: {
    alignItems: "flex-end",
  },
  statusText: {
    fontWeight: "700",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productImg: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  flexItem: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: "600",
  },
  qtyText: {
    marginTop: 2,
  },
  trackText: {
    fontWeight: "700",
    marginTop: 8,
  },
});
