export interface ColorPalette {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  price: string;
  rating: string;
  prime: string;
  overlay: string;
}

export const lightPalette: ColorPalette = {
  primary: "#FF9900",       // Amazon Amber/Gold
  primaryDark: "#E68A00",
  secondary: "#131921",     // Amazon Dark Navy
  secondaryDark: "#0F1111",
  background: "#F3F3F3",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  text: "#0F1111",
  textSecondary: "#565959",
  textMuted: "#888C8C",
  border: "#D5D9D9",
  borderSubtle: "#E7E7E7",
  success: "#067D62",
  successLight: "#E8F8F5",
  warning: "#B12704",
  warningLight: "#FDF2E9",
  error: "#CC0C39",
  errorLight: "#FDF0F0",
  info: "#007185",
  infoLight: "#E6F4F8",
  price: "#B12704",
  rating: "#FFA41C",
  prime: "#00A8E1",
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const darkPalette: ColorPalette = {
  primary: "#FF9900",
  primaryDark: "#E68A00",
  secondary: "#232F3E",
  secondaryDark: "#131921",
  background: "#0F1111",
  surface: "#1D252C",
  card: "#1D252C",
  text: "#F3F3F3",
  textSecondary: "#A9ACAC",
  textMuted: "#6B7280",
  border: "#333F4D",
  borderSubtle: "#2A3440",
  success: "#2ECC71",
  successLight: "#1B3B2B",
  warning: "#E67E22",
  warningLight: "#3D2713",
  error: "#FF4D4D",
  errorLight: "#3D1313",
  info: "#3498DB",
  infoLight: "#13273D",
  price: "#FF6B6B",
  rating: "#FFA41C",
  prime: "#00A8E1",
  overlay: "rgba(0, 0, 0, 0.75)",
};
