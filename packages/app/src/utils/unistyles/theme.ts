import { Colors } from "@/constants/Colors";

const lightTheme = {
  colors: Colors.light,

  gap: (v: number) => v * 8,
};

const darkTheme = {
  colors: Colors.dark,
  gap: (v: number) => v * 8,
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};
