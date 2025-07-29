import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { Button, Text, Screen, TextInput } from "../../components/ui";
import {
  resetPassword,
  validateEmail,
  handleAuthError,
} from "../../utils/supabase/auth";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({ email });

      if (handleAuthError(result)) {
        Alert.alert(
          "Success",
          "Password reset email sent! Please check your email for instructions.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <Screen padding="medium" scrollable={true}>
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        Reset Password
      </Text>

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={styles.subtitle}
      >
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        size="large"
      />

      <Button
        title={loading ? "Sending..." : "Send Reset Link"}
        onPress={handleResetPassword}
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        disabled={loading}
        style={styles.button}
      />

      <Button
        title="Back to Sign In"
        onPress={handleBackToSignIn}
        variant="outline"
        size="medium"
        fullWidth
        style={styles.linkButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
  },
  linkButton: {
    marginTop: 20,
  },
}));
