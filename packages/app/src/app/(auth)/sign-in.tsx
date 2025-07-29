import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native-unistyles";
import { supabase } from "../../utils/supabase/client";
import { Button, Text, Screen, TextInput } from "../../components/ui";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        // Navigate to home screen on successful sign in
        router.replace("/(home)");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <Screen padding="medium" scrollable={true}>
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        Sign In
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
        autoComplete="password"
        size="large"
      />

      <Button
        title={loading ? "Signing In..." : "Sign In"}
        onPress={handleSignIn}
        variant="primary"
        size="large"
        fullWidth
        loading={loading}
        disabled={loading}
        style={styles.button}
      />

      <Button
        title="Don't have an account? Sign Up"
        onPress={handleSignUp}
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
