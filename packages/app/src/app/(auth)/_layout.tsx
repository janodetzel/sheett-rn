import { Stack } from "expo-router";
import CustomHeader from "../../components/CustomHeader";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ route, options }) => (
          <CustomHeader
            title={options.title || route.name}
            showBack={route.name !== "index"}
            minimal={route.name !== "index"}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Create Account",
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: "Reset Password",
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
