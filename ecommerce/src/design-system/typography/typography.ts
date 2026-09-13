import { TextStyle } from "react-native";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "button"
  | "price";

export const typography: Record<TypographyVariant, TextStyle> = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
  },
};
