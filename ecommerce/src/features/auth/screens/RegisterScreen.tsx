import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenWrapper, TextInput, Button, useTheme } from "../../../design-system";
import { useAuthStore } from "../store/useAuthStore";

export interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const { colors, spacing, typography } = useTheme();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    setError(undefined);
    await register(name, email, password);
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={[typography.h1, { color: colors.text }]}>Create Account</Text>
      </View>

      <View style={styles.formContainer}>
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
            <Text style={[typography.caption, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Your name"
          value={name}
          onChangeText={setName}
          placeholder="First and last name"
          containerStyle={{ marginBottom: spacing.md }}
        />

        <TextInput
          label="Mobile number or email"
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
          placeholder="At least 6 characters"
          secureTextEntry
          helperText="Passwords must be at least 6 characters."
          containerStyle={{ marginBottom: spacing.lg }}
        />

        <Button title="Verify email" onPress={handleRegister} isLoading={isLoading} />
      </View>

      <TouchableOpacity onPress={onNavigateToLogin} style={styles.footerLink}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
          Already have an account?{" "}
          <Text style={{ color: colors.info, fontWeight: "700" }}>Sign-In →</Text>
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 24,
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
  footerLink: {
    marginTop: 32,
    alignSelf: "center",
  },
});
