import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { Button, Text, Screen, TextInput } from "../../components/ui";
import {
  signUp,
  validateEmail,
  validatePassword,
  handleAuthError,
} from "../../utils/supabase/auth";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert("Error", passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({ email, password });

      if (handleAuthError(result)) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/sign-in"),
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padding="medium" scrollable={true}>
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        Create Account
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

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        size="large"
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        size="large"
      />

      <Button
        title={loading ? "Creating Account..." : "Sign Up"}
        onPress={handleSignUp}
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        disabled={loading}
        style={styles.button}
      />

      <Button
        title="Already have an account? Sign In"
        onPress={() => router.push("/(auth)/sign-in")}
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
    marginBottom: 40,
  },
  button: {
    marginTop: 16,
  },
  linkButton: {
    marginTop: 20,
  },
}));
