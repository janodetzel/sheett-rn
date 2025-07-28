import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  useAddSpreadsheetCallback,
  useDelSpreadsheetCallback,
  useJoinSpreadsheetCallback,
  useSpreadsheetIds,
} from "../../utils/store/user";
import { supabase } from "../../utils/supabase";

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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Welcome to Sheett</Text>
        <Text style={styles.subtitle}>Manage your spreadsheets</Text>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateSpreadsheet}
        >
          <Text style={styles.createButtonText}>Create New Spreadsheet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleAddSpreadsheet}
        >
          <Text style={styles.createButtonText}>Join Spreadsheet</Text>
        </TouchableOpacity>

        <View style={styles.spreadsheetsSection}>
          <Text style={styles.sectionTitle}>Your Spreadsheets</Text>
          {spreadsheetIds.length === 0 ? (
            <Text style={styles.emptyText}>
              No spreadsheets yet. Create one to get started!
            </Text>
          ) : (
            spreadsheetIds.map((id) => <ListItem key={id} id={id} />)
          )}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const ListItem = ({ id }: { id: string }) => {
  const deleteSpreadsheet = useDelSpreadsheetCallback(id);

  const handleDeleteSpreadsheet = (id: string) => {
    deleteSpreadsheet(id);
  };

  console.log(id);

  return (
    <View key={id} style={styles.spreadsheetItem}>
      <Text style={styles.spreadsheetId}>Spreadsheet: {id}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSpreadsheet(id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: theme.colors.text,
    opacity: 0.7,
  },
  createButton: {
    backgroundColor: theme.colors.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spreadsheetsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: theme.colors.text,
    opacity: 0.6,
    fontStyle: "italic",
  },
  spreadsheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background === "#fff" ? "#F5F5F5" : "#2A2A2A",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.icon,
  },
  spreadsheetId: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: theme.colors.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    alignSelf: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}));
