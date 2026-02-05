import { MD3LightTheme, configureFonts } from "react-native-paper";
import { palette } from "./tokens";

const fonts = configureFonts({
  config: {
    fontFamily: "JetBrainsMono-Regular",
    fontWeight: "400",
  },
});

const appTheme = {
  ...MD3LightTheme,
  roundness: 16,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    primaryContainer: palette.primary,
    onPrimary: "#FFFFFF",
    secondary: palette.secondary,
    secondaryContainer: palette.surfaceAlt,
    onSecondary: "#FFFFFF",
    tertiary: palette.accent,
    tertiaryContainer: "#F4E1D6",
    onTertiary: "#3D1F13",
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceAlt,
    outline: palette.border,
    outlineVariant: palette.border,
    error: palette.error,
    onSurface: palette.text,
    onSurfaceVariant: palette.muted,
  },
};

export { appTheme };
