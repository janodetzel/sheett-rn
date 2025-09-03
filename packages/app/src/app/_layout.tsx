import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "../utils/supabase";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getRouteInfoFromState } from "expo-router/build/global-state/routeInfo";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true });

export default function RootLayout() {
  const [sessionReady, setSessionReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && sessionReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, sessionReady]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SessionProvider callback={() => setSessionReady(true)}>
      <StatusBar style="auto" animated />
      <SafeAreaProvider>
        <KeyboardProvider>
          <GestureHandlerRootView>
            {sessionReady && <RootNavigator />}
          </GestureHandlerRootView>
          <SystemBars style={"auto"} />
        </KeyboardProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const session = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(home)" />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
