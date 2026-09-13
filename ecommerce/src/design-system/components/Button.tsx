import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const { colors, radius, spacing, typography } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    let bg = colors.primary;
    let border = "transparent";

    switch (variant) {
      case "primary":
        bg = colors.primary;
        break;
      case "secondary":
        bg = colors.secondary;
        break;
      case "outline":
        bg = "transparent";
        border = colors.border;
        break;
      case "text":
        bg = "transparent";
        break;
      case "danger":
        bg = colors.error;
        break;
    }

    let paddingVertical: number = spacing.md;
    let paddingHorizontal: number = spacing.lg;

    if (size === "sm") {
      paddingVertical = spacing.xs + 2;
      paddingHorizontal = spacing.md;
    } else if (size === "lg") {
      paddingVertical = spacing.lg;
      paddingHorizontal = spacing["2xl"];
    }

    return {
      backgroundColor: disabled ? colors.borderSubtle : bg,
      borderColor: border,
      borderWidth: variant === "outline" ? 1.5 : 0,
      borderRadius: radius.md,
      paddingVertical,
      paddingHorizontal,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    let color = colors.secondaryDark;

    switch (variant) {
      case "primary":
        color = "#0F1111"; // Amazon dark text on gold button
        break;
      case "secondary":
        color = "#FFFFFF";
        break;
      case "outline":
      case "text":
        color = colors.text;
        break;
      case "danger":
        color = "#FFFFFF";
        break;
    }

    if (disabled) {
      color = colors.textMuted;
    }

    const fontStyle = size === "sm" ? typography.bodySmall : size === "lg" ? typography.button : typography.button;

    return {
      ...fontStyle,
      color,
      fontWeight: "600",
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[getContainerStyle(), style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextStyle().color} />
      ) : (
        <>
          {leftIcon ? <React.Fragment>{leftIcon}</React.Fragment> : null}
          <Text style={[getTextStyle(), leftIcon ? { marginLeft: spacing.xs } : null, rightIcon ? { marginRight: spacing.xs } : null, textStyle]}>
            {title}
          </Text>
          {rightIcon ? <React.Fragment>{rightIcon}</React.Fragment> : null}
        </>
      )}
    </TouchableOpacity>
  );
};
