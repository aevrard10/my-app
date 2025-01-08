import React, { FC } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

const TextInput: FC<TextInputProps> = (props) => {
  return (
    <RNTextInput
      {...props}
      style={styles.input}
      placeholderTextColor="gray" // Assurez-vous que la couleur est visible
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
    fontFamily: "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
});
export default TextInput;
