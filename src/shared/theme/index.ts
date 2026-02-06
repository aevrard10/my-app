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
    primaryContainer: palette.primaryLight,
    onPrimary: "#FFFFFF",
    onPrimaryContainer: palette.primaryDark,
    secondary: palette.secondary,
    secondaryContainer: palette.surfaceAlt,
    onSecondary: palette.primaryDark,
    tertiary: palette.accent,
    tertiaryContainer: palette.accentLight,
    onTertiary: "#3D1F13",
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: "#F2EFE8",
    outline: palette.border,
    outlineVariant: palette.border,
    error: palette.error,
    onSurface: palette.text,
    onSurfaceVariant: palette.muted,
    backdrop: "rgba(24, 31, 28, 0.35)",
  },
};

export { appTheme };
