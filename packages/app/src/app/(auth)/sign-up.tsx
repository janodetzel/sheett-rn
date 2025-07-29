import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { supabase } from "../../utils/supabase/client";
import { Button, Text, Screen, TextInput } from "../../components/ui";

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

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
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
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
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
        onPress={handleSignIn}
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
