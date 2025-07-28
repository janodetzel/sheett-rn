import { UserStore } from "@/src/utils/store/user";
import { Slot, Stack } from "expo-router";
import { Provider as TinybaseProvider } from "tinybase/ui-react";

export default function HomeLayout() {
  return (
    <TinybaseProvider>
      <UserStore />
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </TinybaseProvider>
  );
}
