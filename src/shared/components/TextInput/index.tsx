import React, { FC } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useTheme } from "react-native-paper";

const TextInput: FC<TextInputProps> = (props) => {
  const { colors } = useTheme();
  return (
    <RNTextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={props.placeholderTextColor ?? colors.outline}
      selectionColor={colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    outlineStyle: "none",
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 10,
    fontFamily: "JetBrainsMono-Regular",
  },
});
export default TextInput;
