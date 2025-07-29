import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface TextProps extends RNTextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodySmall"
    | "caption"
    | "label";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "inverse"
    | "accent"
    | "success"
    | "error";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export default function Text({
  variant = "body",
  weight = "normal",
  color = "primary",
  align = "left",
  style,
  children,
  ...props
}: TextProps) {
  const textStyle = [
    styles.text,
    styles[variant],
    styles[weight],
    styles[`${color}Color`],
    styles[`${align}Align`],
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
  },
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Weights
  normal: {
    fontWeight: "400",
  },
  medium: {
    fontWeight: "500",
  },
  semibold: {
    fontWeight: "600",
  },
  bold: {
    fontWeight: "700",
  },
  // Colors
  primaryColor: {
    color: theme.colors.text.primary,
  },
  secondaryColor: {
    color: theme.colors.text.secondary,
  },
  tertiaryColor: {
    color: theme.colors.text.tertiary,
  },
  inverseColor: {
    color: theme.colors.text.inverse,
  },
  accentColor: {
    color: theme.colors.accent,
  },
  successColor: {
    color: theme.colors.status.success,
  },
  errorColor: {
    color: theme.colors.status.error,
  },
  // Alignment
  leftAlign: {
    textAlign: "left",
  },
  centerAlign: {
    textAlign: "center",
  },
  rightAlign: {
    textAlign: "right",
  },
}));
