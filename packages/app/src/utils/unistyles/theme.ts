import { Colors } from "@/src/constants/Colors";

const lightTheme = {
  colors: Colors.light,
  borderRadius: 6,
  gap: (v: number) => v * 8,
};

const darkTheme = {
  colors: Colors.dark,
  borderRadius: 6,
  gap: (v: number) => v * 8,
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};
