import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { HomeScreen } from "../../features/home/screens/HomeScreen";
import { ProductDetailsScreen } from "../../features/products/screens/ProductDetailsScreen";
import { CategoriesScreen } from "../../features/categories/screens/CategoriesScreen";
import { SearchScreen } from "../../features/search/screens/SearchScreen";
import { CartScreen } from "../../features/cart/screens/CartScreen";
import { CheckoutStepperModal } from "../../features/checkout/screens/CheckoutStepperModal";
import { OrderListScreen } from "../../features/orders/screens/OrderListScreen";
import { OrderTrackingScreen } from "../../features/orders/screens/OrderTrackingScreen";
import { ProfileScreen } from "../../features/profile/screens/ProfileScreen";
import { SettingsScreen } from "../../features/profile/screens/SettingsScreen";
import { useTheme } from "../../design-system";
import { useCartStore } from "../../features/cart/store/useCartStore";
import { ProductId, OrderId } from "../../shared/types/branded";

type TabName = "Home" | "Categories" | "Search" | "Cart" | "Orders" | "Account";

export const AppNavigator: React.FC = () => {
  const { colors, typography } = useTheme();
  const cartItems = useCartStore((state: any) => state.items);
  const cartBadgeCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [selectedProductId, setSelectedProductId] = useState<ProductId | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<OrderId | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Product details modal / screen overlay
  if (selectedProductId) {
    return (
      <ProductDetailsScreen
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
        onNavigateToCart={() => {
          setSelectedProductId(null);
          setActiveTab("Cart");
        }}
      />
    );
  }

  // Checkout modal flow
  if (isCheckoutOpen) {
    return (
      <CheckoutStepperModal
        onBackToCart={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderId) => {
          setIsCheckoutOpen(false);
          setSelectedOrderId(orderId);
          setActiveTab("Orders");
        }}
      />
    );
  }

  // Order tracking screen
  if (selectedOrderId) {
    return (
      <OrderTrackingScreen
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      />
    );
  }

  // Settings screen
  if (isSettingsOpen) {
    return <SettingsScreen onBack={() => setIsSettingsOpen(false)} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "Home":
        return (
          <HomeScreen
            onNavigateToProduct={(id) => setSelectedProductId(id)}
            onNavigateToCategory={(_id, _name) => setActiveTab("Categories")}
            onNavigateToSearch={() => setActiveTab("Search")}
          />
        );
      case "Categories":
        return (
          <CategoriesScreen
            onSelectCategory={() => setActiveTab("Home")}
          />
        );
      case "Search":
        return (
          <SearchScreen
            onSearchSubmit={(_q) => setActiveTab("Home")}
            onBack={() => setActiveTab("Home")}
          />
        );
      case "Cart":
        return (
          <CartScreen
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            onNavigateToHome={() => setActiveTab("Home")}
          />
        );
      case "Orders":
        return (
          <OrderListScreen
            onSelectOrder={(orderId) => setSelectedOrderId(orderId)}
          />
        );
      case "Account":
        return (
          <ProfileScreen
            onNavigateToOrders={() => setActiveTab("Orders")}
            onNavigateToSettings={() => setIsSettingsOpen(true)}
          />
        );
    }
  };

  const TABS: Array<{ id: TabName; label: string; icon: string }> = [
    { id: "Home", label: "Home", icon: "🏠" },
    { id: "Categories", label: "Departments", icon: "☰" },
    { id: "Search", label: "Search", icon: "🔍" },
    { id: "Cart", label: "Cart", icon: "🛒" },
    { id: "Orders", label: "Orders", icon: "📦" },
    { id: "Account", label: "Account", icon: "👤" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

      {/* Amazon Bottom Navigation Bar */}
      <View style={[styles.bottomTabBar, { backgroundColor: colors.secondary, borderTopColor: colors.borderSubtle }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                {tab.id === "Cart" && cartBadgeCount > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.cartBadgeText}>{cartBadgeCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  typography.caption,
                  styles.tabLabel,
                  {
                    color: isActive ? colors.primary : "#A9ACAC",
                    fontWeight: isActive ? "700" : "400",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: "row",
    height: 58,
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "relative",
  },
  tabIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#0F1111",
    fontSize: 9,
    fontWeight: "900",
  },
});
