/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const BaseColors = {
  // Base theme colors
  base100dark: "#02120E",
  base100light: "#FFF8FD",
  neutral: "#001A13",
  accent: "#D99330",
  secondary: "#1FD65F",
  primary: "#1EB854",

  // Whites and grays
  white: "#FFFFFF",
  gray50: "#F7FAFC",
  gray100: "#EDF2F7",
  gray200: "#E2E8F0",
  gray300: "#CBD5E0",
  gray400: "#A0AEC0",
  gray500: "#718096",
  gray600: "#4A5568",
  gray700: "#2D3748",
  gray800: "#1A202C",
  gray900: "#171923",

  // Status colors
  error: "#E53E3E",
  errorLight: "#FC8181",
  info: "#3182CE",
  infoLight: "#63B3ED",
} as const;

// Color token types
export type ColorToken = {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
  inverse: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    accent: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  interactive: {
    primary: string;
    secondary: string;
    destructive: string;
    disabled: string;
    hover: string;
  };
};

// Generate color variants
const generateColorVariants = (baseColor: string) => {
  return {
    50: adjustBrightness(baseColor, 0.9),
    100: adjustBrightness(baseColor, 0.8),
    200: adjustBrightness(baseColor, 0.6),
    300: adjustBrightness(baseColor, 0.4),
    400: adjustBrightness(baseColor, 0.2),
    500: baseColor,
    600: adjustBrightness(baseColor, -0.2),
    700: adjustBrightness(baseColor, -0.4),
    800: adjustBrightness(baseColor, -0.6),
    900: adjustBrightness(baseColor, -0.8),
  };
};

// Helper function to adjust color brightness
const adjustBrightness = (hex: string, factor: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)));
  const newG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)));
  const newB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)));

  return `#${newR.toString(16).padStart(2, "0")}${newG
    .toString(16)
    .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};

// Generate color palettes
const primaryPalette = generateColorVariants(BaseColors.primary);
const secondaryPalette = generateColorVariants(BaseColors.secondary);
const accentPalette = generateColorVariants(BaseColors.accent);
const neutralPalette = generateColorVariants(BaseColors.neutral);

export const Colors: {
  light: ColorToken;
  dark: ColorToken;
} = {
  light: {
    primary: BaseColors.primary,
    secondary: BaseColors.secondary,
    accent: BaseColors.accent,
    neutral: BaseColors.neutral,
    background: BaseColors.base100light,
    inverse: BaseColors.base100dark,
    surface: BaseColors.white,
    text: {
      primary: BaseColors.neutral,
      secondary: BaseColors.gray600,
      tertiary: BaseColors.gray500,
      inverse: BaseColors.white,
    },
    border: {
      primary: BaseColors.gray200,
      secondary: BaseColors.gray50,
      accent: BaseColors.accent,
    },
    status: {
      success: BaseColors.primary,
      warning: BaseColors.accent,
      error: BaseColors.error,
      info: BaseColors.info,
    },
    interactive: {
      primary: BaseColors.primary,
      secondary: BaseColors.secondary,
      destructive: BaseColors.error,
      disabled: BaseColors.gray300,
      hover: primaryPalette[600],
    },
  },
  dark: {
    primary: BaseColors.primary,
    secondary: BaseColors.secondary,
    accent: BaseColors.accent,
    neutral: BaseColors.neutral,
    background: BaseColors.base100dark,
    inverse: BaseColors.base100light,
    surface: BaseColors.gray800,
    text: {
      primary: BaseColors.gray50,
      secondary: BaseColors.gray400,
      tertiary: BaseColors.gray500,
      inverse: BaseColors.neutral,
    },
    border: {
      primary: BaseColors.gray700,
      secondary: BaseColors.gray600,
      accent: BaseColors.accent,
    },
    status: {
      success: BaseColors.primary,
      warning: BaseColors.accent,
      error: BaseColors.errorLight,
      info: BaseColors.infoLight,
    },
    interactive: {
      primary: BaseColors.primary,
      secondary: BaseColors.secondary,
      destructive: BaseColors.errorLight,
      disabled: BaseColors.gray600,
      hover: primaryPalette[400],
    },
  },
} as const;

// Export color palettes for advanced usage
export const ColorPalettes = {
  primary: primaryPalette,
  secondary: secondaryPalette,
  accent: accentPalette,
  neutral: neutralPalette,
} as const;

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
