import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenWrapper, TextInput, Button, useTheme } from "../../../design-system";
import { useAuthStore } from "../store/useAuthStore";

export interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("shakil@ecommerce.app");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(undefined);
    await login(email, password);
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>amazon</Text>
        </View>
        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.lg }]}>
          Sign-In
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Welcome back! Access your Amazon account
        </Text>
      </View>

      <View style={styles.formContainer}>
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
            <Text style={[typography.caption, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Email or mobile phone number"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ marginBottom: spacing.md }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          containerStyle={{ marginBottom: spacing.sm }}
        />

        <TouchableOpacity onPress={onNavigateToForgotPassword} style={styles.forgotBtn}>
          <Text style={[typography.caption, styles.forgotText, { color: colors.info }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={handleLogin}
          isLoading={isLoading}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      <View style={styles.footerContainer}>
        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>New to Amazon?</Text>
        <Button
          title="Create your Amazon account"
          variant="outline"
          onPress={onNavigateToRegister}
          style={styles.fullWidthBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F1111",
    letterSpacing: -1,
  },
  formContainer: {
    width: "100%",
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  forgotBtn: {
    alignSelf: "flex-end",
  },
  forgotText: {
    fontWeight: "600",
  },
  footerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  fullWidthBtn: {
    marginTop: 16,
    width: "100%",
  },
});
