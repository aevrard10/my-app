import React, { FC } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useTheme } from "react-native-paper";
import { radius } from "@shared/theme/tokens";

const TextInput: FC<TextInputProps> = (props) => {
  const { colors } = useTheme();
  return (
    <RNTextInput
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outlineVariant ?? colors.outline,
          color: colors.onSurface,
        },
        props.style,
      ]}
      placeholderTextColor={props.placeholderTextColor ?? colors.outline}
      selectionColor={colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    outlineStyle: "none",
    borderWidth: 1,
    borderRadius: radius.sm,
    fontFamily: "JetBrainsMono-Regular",
  },
});
export default TextInput;
