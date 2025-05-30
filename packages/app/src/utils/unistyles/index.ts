/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from "react-native-unistyles";
import { breakpoints } from "./brakepoints";
import { settings } from "./settings";
import { appThemes } from "./theme";

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings,
});
