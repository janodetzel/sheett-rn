import React from "react";
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  insets?: "none" | "top" | "bottom" | "both";
  centerContent?: boolean;
  style?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  contentContainerStyle?: ViewStyle;
}

export default function Screen({
  children,
  scrollable = true,
  padding = "medium",
  insets = "both",
  centerContent = false,
  style,
  scrollViewProps,
  contentContainerStyle,
}: ScreenProps) {
  const safeAreaInsets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    (insets === "top" || insets === "both") && {
      paddingTop: safeAreaInsets.top,
    },
    style,
  ];

  const contentStyle = [
    styles.content,
    styles[`${padding}Padding`],
    (insets === "bottom" || insets === "both") && {
      paddingBottom: safeAreaInsets.bottom,
    },
    centerContent && styles.centeredContent,
    contentContainerStyle,
  ];

  const screenContent = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="never"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={contentStyle}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={containerStyle}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {screenContent}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  centeredContent: {
    justifyContent: "center",
  },
  // Padding variants
  nonePadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  smallPadding: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  mediumPadding: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  largePadding: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
}));
