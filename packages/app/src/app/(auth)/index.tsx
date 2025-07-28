import { Link } from "expo-router";
import { Text, View, Pressable, ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Colors } from "../../constants/Colors";

export default function Auth() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>📊</Text>
          </View>
          <Text style={styles.title}>Welcome to Sheett</Text>
          <Text style={styles.subtitle}>
            Your personal spreadsheet companion
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.featureContainer}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>Organize your data</Text>
          </View>
          <View style={styles.featureContainer}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>Sync across devices</Text>
          </View>
          <View style={styles.featureContainer}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Secure & private</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Link href="/sign-in" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </Pressable>
          </Link>

          <Link href="/sign-up" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    minHeight: 200,
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: theme.colors.border.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: "500",
  },
  actions: {
    gap: 16,
    marginTop: 40,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: Colors.light.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
  },
}));
