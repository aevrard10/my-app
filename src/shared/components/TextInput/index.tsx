import React, { FC } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

const TextInput: FC<TextInputProps> = (props) => {
  return <RNTextInput {...props} style={styles.input} />;
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    outlineStyle: "none",
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});
export default TextInput;
