import React from "react";
import { Alert, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  useAddSpreadsheetCallback,
  useDelSpreadsheetCallback,
  useJoinSpreadsheetCallback,
  useSpreadsheetIds,
} from "../../utils/store/user";
import { supabase } from "../../utils/supabase";
import { Button, Text, Screen } from "../../components/ui";

export default function Home() {
  const spreadsheetIds = useSpreadsheetIds();
  const addSpreadsheet = useAddSpreadsheetCallback();
  const joinSpreadsheet = useJoinSpreadsheetCallback();

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
}));
