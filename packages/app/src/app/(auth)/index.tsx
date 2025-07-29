import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Colors } from "../../constants/Colors";
import { Button, Text, Screen } from "../../components/ui";

export default function Auth() {
  return (
    <Screen padding="large" centerContent>
      {/* Header Section */}
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        Welcome to Sheett
      </Text>
      <Text
        variant="body"
        color="secondary"
        align="center"
        style={styles.subtitle}
      >
        Your personal spreadsheet companion
      </Text>

      {/* Content Section */}
      <Screen padding="none" style={styles.content}>
        <FeatureCard icon="✨" text="Organize your data" />
        <FeatureCard icon="🚀" text="Sync across devices" />
        <FeatureCard icon="🔒" text="Secure & private" />
      </Screen>

      {/* Action Buttons */}
      <Link href="/sign-in" asChild>
        <Button
          title="Sign In"
          onPress={() => {}}
          variant="primary"
          size="large"
          fullWidth
          style={styles.primaryButton}
        />
      </Link>

      <Link href="/sign-up" asChild>
        <Button
          title="Create Account"
          onPress={() => {}}
          variant="outline"
          size="large"
          fullWidth
          style={styles.secondaryButton}
        />
      </Link>
    </Screen>
  );
}

const FeatureCard = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureContainer}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text variant="body" weight="medium" style={styles.featureText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create((theme) => ({
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 40,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
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
    flex: 1,
  },
  primaryButton: {
    marginBottom: 16,
  },
  secondaryButton: {
    marginBottom: 0,
  },
}));
