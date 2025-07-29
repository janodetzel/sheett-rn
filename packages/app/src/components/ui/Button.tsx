import React from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Colors } from "../../constants/Colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: Colors.light.border.primary }}
    >
      {loading ? (
        <ActivityIndicator
          size={size === "small" ? "small" : "small"}
          color={
            variant === "outline"
              ? Colors.light.primary
              : Colors.light.text.inverse
          }
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyle}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: theme.colors.border.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  // Variants
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.light.secondary,
  },
  destructiveButton: {
    backgroundColor: Colors.light.interactive.destructive,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  disabledButton: {
    backgroundColor: Colors.light.interactive.disabled,
    borderColor: Colors.light.interactive.disabled,
  },
  // Sizes
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  // Text styles
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: Colors.light.text.inverse,
  },
  secondaryText: {
    color: Colors.light.text.inverse,
  },
  destructiveText: {
    color: Colors.light.text.inverse,
  },
  outlineText: {
    color: Colors.light.primary,
  },
  disabledText: {
    color: Colors.light.text.tertiary,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
}));
