import React, { PropsWithChildren } from "react";
import { Platform, StyleSheet, ViewStyle } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { radius } from "@shared/theme/tokens";

type CardSurfaceProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

const CardSurface = ({ children, style }: CardSurfaceProps) => {
  const { colors } = useTheme();
  return (
    <Surface
      elevation={0}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outlineVariant ?? colors.outline,
        },
        style,
      ]}
    >
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#1A1A1A",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: "#1A1A1A",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
    }),
  },
});

export default CardSurface;
