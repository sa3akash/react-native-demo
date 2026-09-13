import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ScreenWrapper, Header, Button, useTheme } from "../../../design-system";
import { useAuthStore } from "../../auth/store/useAuthStore";

export interface ProfileScreenProps {
  onNavigateToOrders: () => void;
  onNavigateToSettings: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateToOrders,
  onNavigateToSettings,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <ScreenWrapper scrollable>
      <Header title="Your Account" />

      {/* Greeting Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.secondary, padding: spacing.lg }]}>
        <View style={styles.userRow}>
          <Image
            source={{
              uri: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfoCol}>
            <Text style={[typography.h2, styles.whiteText]}>Hello, {user?.name || "Shakil"}</Text>
            <Text style={[typography.caption, styles.mutedWhiteText]}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Quick Action Grid Buttons */}
      <View style={{ padding: spacing.md }}>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            onPress={onNavigateToOrders}
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.borderSubtle }]}
          >
            <Text style={styles.gridIcon}>📦</Text>
            <Text style={[typography.body, styles.boldTitle, { color: colors.text }]}>
              Your Orders
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Track, return or buy again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateToSettings}
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.borderSubtle }]}
          >
            <Text style={styles.gridIcon}>⚙️</Text>
            <Text style={[typography.body, styles.boldTitle, { color: colors.text }]}>
              Login & Security
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Edit name, email & theme</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.borderSubtle }]}>
            <Text style={styles.gridIcon}>📍</Text>
            <Text style={[typography.body, styles.boldTitle, { color: colors.text }]}>
              Your Addresses
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>2 Saved Locations</Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.borderSubtle }]}>
            <Text style={styles.gridIcon}>❤️</Text>
            <Text style={[typography.body, styles.boldTitle, { color: colors.text }]}>
              Your Wishlist
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Saved items</Text>
          </View>
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={logout}
          style={{ marginTop: spacing["2xl"] }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    width: "100%",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FF9900",
  },
  userInfoCol: {
    marginLeft: 12,
  },
  whiteText: {
    color: "#FFFFFF",
  },
  mutedWhiteText: {
    color: "#A9ACAC",
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  boldTitle: {
    fontWeight: "700",
    marginTop: 4,
  },
  gridIcon: {
    fontSize: 24,
  },
});
