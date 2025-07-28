import { UserStore } from "@/src/utils/store/user";
import { Slot, Stack } from "expo-router";
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import CustomHeader from "../../components/CustomHeader";

export default function HomeLayout() {
  return (
    <TinybaseProvider>
      <UserStore />
      <Stack
        screenOptions={{
          header: ({ route, options }) => (
            <CustomHeader
              title={options.title || route.name}
              showBack={false}
            />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
      </Stack>
    </TinybaseProvider>
  );
}
