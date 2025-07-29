import React from "react";
import {
  View,
  ScrollView,
  ViewStyle,
  ScrollViewProps,
  Platform,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  backgroundColor?: "background" | "surface";
  centerContent?: boolean;
  style?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  contentContainerStyle?: ViewStyle;
}

export default function Screen({
  children,
  scrollable = true,
  padding = "medium",
  backgroundColor = "background",
  centerContent = false,
  style,
  scrollViewProps,
  contentContainerStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    styles[`${backgroundColor}Background`],
    { paddingTop: insets.top },
    style,
  ];

  const contentStyle = [
    styles.content,
    styles[`${padding}Padding`],
    { paddingBottom: insets.bottom },
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
  // Background variants
  backgroundBackground: {
    backgroundColor: theme.colors.background,
  },
  surfaceBackground: {
    backgroundColor: theme.colors.surface,
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
