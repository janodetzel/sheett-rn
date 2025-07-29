import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { Button, Text, Screen, TextInput } from "../../components/ui";
import {
  signIn,
  signInAnonymously,
  validateEmail,
  handleAuthError,
} from "../../utils/supabase/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [anonymousLoading, setAnonymousLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn({ email, password });

      if (handleAuthError(result)) {
        router.replace("/(home)");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setAnonymousLoading(true);
    try {
      const result = await signInAnonymously();

      if (handleAuthError(result)) {
        router.replace("/(home)");
      }
    } finally {
      setAnonymousLoading(false);
    }
  };

  return (
    <Screen padding="medium" scrollable={true}>
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        Welcome Back
      </Text>

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={styles.subtitle}
      >
        Sign in to your account to continue
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        size="large"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        size="large"
        style={styles.input}
      />

      <Button
        title="Forgot Password?"
        onPress={() => router.push("/(auth)/reset-password")}
        variant="secondary"
        size="small"
        fullWidth
        style={styles.forgotPassword}
      />

      <Button
        title={loading ? "Signing In..." : "Sign In"}
        onPress={handleSignIn}
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        disabled={loading || anonymousLoading}
        style={styles.button}
      />

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={styles.orText}
      >
        or
      </Text>

      <Button
        title={anonymousLoading ? "Signing In..." : "Continue as Guest"}
        onPress={handleAnonymousSignIn}
        variant="outline"
        size="large"
        fullWidth
        loading={anonymousLoading}
        disabled={loading || anonymousLoading}
        style={styles.anonymousButton}
      />

      <Button
        title="Don't have an account? Sign Up"
        onPress={() => router.push("/(auth)/sign-up")}
        variant="secondary"
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
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  orText: {
    marginTop: 24,
    marginBottom: 16,
  },
  anonymousButton: {
    marginBottom: 24,
  },
  linkButton: {
    marginTop: 20,
  },
}));
