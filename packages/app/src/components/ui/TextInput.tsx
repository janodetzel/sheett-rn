import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Text from "./Text";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  style?: any;
}

export default function TextInput({
  variant = "default",
  size = "medium",
  error = false,
  leftIcon,
  rightIcon,
  label,
  helperText,
  style,
  ...props
}: TextInputProps) {
  const { theme } = useUnistyles();
  const inputStyle = [
    styles.input,
    styles[`${variant}Input`],
    styles[`${size}Input`],
    error && styles.errorInput,
    style,
  ];

  const containerStyle = [
    styles.container,
    leftIcon && styles.containerWithLeftIcon,
    rightIcon && styles.containerWithRightIcon,
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="label" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <RNTextInput
          style={inputStyle}
          placeholderTextColor={theme.colors.text.tertiary}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {helperText && (
        <Text
          variant="caption"
          color={error ? "error" : "tertiary"}
          style={styles.helperText}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: 16,
  },
  containerWithLeftIcon: {
    // Additional styles if needed
  },
  containerWithRightIcon: {
    // Additional styles if needed
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    borderColor: theme.colors.border.primary,
  },
  // Variants
  defaultInput: {
    // Default styling
  },
  outlinedInput: {
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
  },
  filledInput: {
    backgroundColor: theme.colors.surface,
    borderColor: "transparent",
  },
  // Sizes
  smallInput: {
    height: 40,
    fontSize: 14,
  },
  mediumInput: {
    height: 50,
    fontSize: 16,
  },
  largeInput: {
    height: 56,
    fontSize: 18,
  },
  // States
  errorInput: {
    borderColor: theme.colors.status.error,
  },
  helperText: {
    marginTop: 4,
  },
}));
