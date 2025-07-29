import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  useAddSpreadsheetCallback,
  useDelSpreadsheetCallback,
  useJoinSpreadsheetCallback,
  useSpreadsheetIds,
} from "../../utils/store/user";
import { supabase, useSession } from "../../utils/supabase";
import { Button, Text, Screen, TextInput } from "../../components/ui";
import {
  getCurrentUser,
  linkAnonymousAccount,
  validateEmail,
  validatePassword,
  handleAuthError,
} from "../../utils/supabase/auth";

export default function Home() {
  const spreadsheetIds = useSpreadsheetIds();
  const addSpreadsheet = useAddSpreadsheetCallback();
  const joinSpreadsheet = useJoinSpreadsheetCallback();
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [linkingLoading, setLinkingLoading] = useState(false);

  const session = useSession();

  const isAnonymous = session?.user?.is_anonymous;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) {
        Alert.alert("Error", error.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleCreateSpreadsheet = () => {
    try {
      addSpreadsheet();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSpreadsheet = () => {
    try {
      joinSpreadsheet("d0de4cee-c629-4d75-aff5-32b0693e0cee");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkAccount = async () => {
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

    setLinkingLoading(true);
    try {
      const result = await linkAnonymousAccount({ email, password });

      if (handleAuthError(result)) {
        Alert.alert(
          "Success",
          "Account linked successfully! Please check your email for verification.",
          [
            {
              text: "OK",
              onPress: () => {
                setShowLinkAccount(false);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              },
            },
          ]
        );
      }
    } finally {
      setLinkingLoading(false);
    }
  };

  return (
    <Screen padding="medium">
      <Text variant="h2" weight="bold" align="center" style={styles.title}>
        Welcome to Sheett
      </Text>
      <Text
        variant="body"
        color="secondary"
        align="center"
        style={styles.subtitle}
      >
        Manage your spreadsheets
      </Text>

      {/* Anonymous Account Section */}
      {isAnonymous && (
        <View style={styles.anonymousSection}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Guest Account
          </Text>
          <Text
            variant="bodySmall"
            color="secondary"
            style={styles.anonymousText}
          >
            You&apos;re currently signed in as a guest. Link your account with
            an email and password to save your data permanently.
          </Text>

          {!showLinkAccount ? (
            <Button
              title="Link Account"
              onPress={() => setShowLinkAccount(true)}
              variant="primary"
              size="medium"
              style={styles.linkAccountButton}
            />
          ) : (
            <View style={styles.linkAccountForm}>
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
                autoComplete="new-password"
                size="large"
                style={styles.input}
              />

              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
                size="large"
                style={styles.input}
              />

              <View style={styles.linkAccountButtons}>
                <Button
                  title={linkingLoading ? "Linking..." : "Link Account"}
                  onPress={handleLinkAccount}
                  variant="primary"
                  size="medium"
                  loading={linkingLoading}
                  disabled={linkingLoading}
                  style={styles.linkButton}
                />

                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowLinkAccount(false);
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  variant="secondary"
                  size="medium"
                  style={styles.cancelButton}
                />
              </View>
            </View>
          )}
        </View>
      )}

      <Button
        title="Create New Spreadsheet"
        onPress={handleCreateSpreadsheet}
        variant="primary"
        size="large"
        fullWidth
        style={styles.createButton}
      />

      <Button
        title="Join Spreadsheet"
        onPress={handleAddSpreadsheet}
        variant="secondary"
        size="large"
        fullWidth
        style={styles.createButton}
      />

      <View style={styles.spreadsheetsSection}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Your Spreadsheets
        </Text>
        {spreadsheetIds.length === 0 ? (
          <Text
            variant="bodySmall"
            color="tertiary"
            align="center"
            style={styles.emptyText}
          >
            No spreadsheets yet. Create one to get started!
          </Text>
        ) : (
          spreadsheetIds.map((id) => <ListItem key={id} id={id} />)
        )}
      </View>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="destructive"
        size="medium"
        style={styles.signOutButton}
      />
    </Screen>
  );
}

const ListItem = ({ id }: { id: string }) => {
  const deleteSpreadsheet = useDelSpreadsheetCallback(id);

  const handleDeleteSpreadsheet = (id: string) => {
    deleteSpreadsheet(id);
  };

  return (
    <View style={styles.spreadsheetItem}>
      <Text variant="bodySmall" style={styles.spreadsheetId}>
        Spreadsheet: {id}
      </Text>
      <Button
        title="Delete"
        onPress={() => handleDeleteSpreadsheet(id)}
        variant="destructive"
        size="small"
        style={styles.deleteButton}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 40,
  },
  createButton: {
    marginBottom: 16,
  },
  spreadsheetsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyText: {
    fontStyle: "italic",
  },
  spreadsheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  spreadsheetId: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 12,
  },
  signOutButton: {
    alignSelf: "center",
    minWidth: 120,
  },
  // Anonymous account styles
  anonymousSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  anonymousText: {
    marginBottom: 16,
    lineHeight: 20,
  },
  linkAccountButton: {
    alignSelf: "flex-start",
  },
  linkAccountForm: {
    marginTop: 16,
  },
  input: {
    marginBottom: 12,
  },
  linkAccountButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  linkButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
}));
