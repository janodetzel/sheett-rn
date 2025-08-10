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
import {
  SpreadsheetStore,
  useSpreadsheetValue,
  useSpreadsheetCellIds,
  useSpreadsheetCell,
  useSpreadsheetCellValue,
  useDelSpreadsheetCellCallback,
  useSpreadsheetCollaborator,
  useAddSpreadsheetCollaboratorCallback,
  useDelSpreadsheetCollaboratorCallback,
  rowIdColumnIdToCellId,
  cellIdToRowIdColumnId,
} from "@/src/utils/store/spreadsheet";
import { Link, useRouter } from "expo-router";

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
          ],
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

  const router = useRouter();

  return (
    <View>
      <View style={styles.spreadsheetItem}>
        <Text variant="bodySmall" style={styles.spreadsheetId}>
          Spreadsheet: {id}
        </Text>
        <Button
          title="Open"
          onPress={() => router.navigate(`./sheett/${id}`)}
          variant="primary"
          size="small"
          style={styles.deleteButton}
        />
        <Button
          title="Delete"
          onPress={deleteSpreadsheet}
          variant="destructive"
          size="small"
          style={styles.deleteButton}
        />
      </View>
      <View>
        {/* <SpreadsheetStore id={id} /> */}
        {/* <SpreadsheetTestComponent id={id} /> */}
      </View>
    </View>
  );
};

// Test component for spreadsheet store functionalities
const SpreadsheetTestComponent = ({ id }: { id: string }) => {
  const [inc, setInc] = useState(1);
  const [name, setName] = useSpreadsheetValue(id, "name");

  const [description, setDescription] = useSpreadsheetValue(id, "description");

  // Cell management
  const cellIds = useSpreadsheetCellIds(id);
  const addCollaborator = useAddSpreadsheetCollaboratorCallback(id);

  const deleteCollaborator = useDelSpreadsheetCollaboratorCallback(
    id,
    "test-user-123",
  );

  const [collaborator, setCollaborator] = useSpreadsheetCollaborator(
    id,
    "test-user-123",
  );

  // Test cell operations
  const testCellId = rowIdColumnIdToCellId(`row${inc}`, `col${inc}`);

  const deleteCell = useDelSpreadsheetCellCallback(id, testCellId);

  const [cellValue, setCellValue] = useSpreadsheetCellValue(
    id,
    testCellId,
    "value",
  );
  const [cellRow, setCell] = useSpreadsheetCell(id, testCellId);

  const handleAddTestCell = () => {
    setCell({
      rowId: `row${inc}`,
      columnId: `col${inc}`,
      value: "Test Cell Value",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "test-user",
    });
  };

  const handleUpdateCellValue = () => {
    setCellValue("Updated Cell Value");
  };

  const handleAddCollaborator = () => {
    addCollaborator("test-user-123", "editor");
  };

  return (
    <View style={styles.testSection}>
      <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
        Spreadsheet Store Test
      </Text>

      {/* Basic value operations */}
      <View style={styles.testGroup}>
        <Text variant="bodySmall" weight="semibold">
          Basic Values:
        </Text>
        <Text>Name: {name || "Not set"}</Text>
        <Text>Description: {description || "Not set"}</Text>
        <Button
          title="Set Name"
          onPress={() => setName("Test Spreadsheet")}
          variant="secondary"
          size="small"
        />
        <Button
          title="Set Description"
          onPress={() => setDescription("A test spreadsheet")}
          variant="secondary"
          size="small"
        />
      </View>

      {/* Cell operations */}
      <View style={styles.testGroup}>
        <Text variant="bodySmall" weight="semibold">
          Cell Operations:
        </Text>
        <Text>Cell Value: {cellValue || "Not set"}</Text>
        <Text>Total Cells: {cellIds?.length || 0}</Text>
        <Button
          title="Add Test Cell"
          onPress={handleAddTestCell}
          variant="primary"
          size="small"
        />
        <Button
          title="Update Cell Value"
          onPress={handleUpdateCellValue}
          variant="primary"
          size="small"
        />
        <Button
          title="Delete Test Cell"
          onPress={deleteCell}
          variant="destructive"
          size="small"
        />
      </View>

      {/* Collaborator operations */}
      <View style={styles.testGroup}>
        <Text variant="bodySmall" weight="semibold">
          Collaborator Operations:
        </Text>
        <Button
          title="Add Test Collaborator"
          onPress={handleAddCollaborator}
          variant="outline"
          size="small"
        />
        <Button
          title="Delete Test Collaborator"
          onPress={deleteCollaborator}
          variant="destructive"
          size="small"
        />
        <Button
          title="Set Collaborators"
          onPress={() =>
            setCollaborator({
              role: "viewer",
            })
          }
        />
        <Text>Collaborators: {JSON.stringify(collaborator)}</Text>
      </View>

      {/* Cell ID utilities */}
      <View style={styles.testGroup}>
        <Text variant="bodySmall" weight="semibold">
          Cell ID Utilities:
        </Text>
        <Text>Generated Cell ID: {testCellId}</Text>
        <Text>Parsed: {JSON.stringify(cellIdToRowIdColumnId(testCellId))}</Text>
      </View>
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
  // Test component styles
  testSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  testGroup: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
}));
