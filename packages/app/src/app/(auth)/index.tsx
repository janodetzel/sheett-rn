import { Link } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Auth() {
  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
      <Link href={"/sign-in"}>Sign In</Link>
      <Link href={"/sign-up"}>Sign Up</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
