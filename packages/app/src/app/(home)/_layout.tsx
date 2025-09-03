import { UserStore } from "@/src/utils/store/user";
import { Stack } from "expo-router";
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import Header from "../../components/layout/CustomHeader";

export default function HomeLayout() {
  return (
    <TinybaseProvider>
      <UserStore />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sheett/[id]" />
      </Stack>
    </TinybaseProvider>
  );
}
