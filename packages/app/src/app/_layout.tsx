import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SystemBars } from "react-native-edge-to-edge";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { Provider as TinybaseProvider } from "tinybase/ui-react";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { SessionProvider } from "../utils/supabase";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [sessionReady, setSessionReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && sessionReady) {
      SplashScreen.hide();
    }
  }, [loaded, sessionReady]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SessionProvider callback={() => setSessionReady(true)}>
      <StatusBar style="auto" animated />
      <TinybaseProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <KeyboardProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <SystemBars style={"auto"} />
          </KeyboardProvider>
        </ThemeProvider>
      </TinybaseProvider>
    </SessionProvider>
  );
}
