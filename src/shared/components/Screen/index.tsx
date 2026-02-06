import React, { PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { gradients, spacing } from "@shared/theme/tokens";

type ScreenProps = PropsWithChildren<{
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Edge[];
}>;

const Screen = ({
  children,
  style,
  contentStyle,
  edges = ["top", "bottom"],
}: ScreenProps) => {
  const headerHeight = useHeaderHeight();
  return (
    <LinearGradient colors={gradients.main} style={[styles.container, style]}>
      <SafeAreaView
        style={[
          styles.safeArea,
          { paddingTop: spacing.sm + headerHeight },
          contentStyle,
        ]}
        edges={edges}
      >
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

export default Screen;
