import TextInput from "@shared/components/TextInput";
import { FC } from "react";
import { View, StyleSheet, TextInputProps } from "react-native";
import { Text, Divider } from "react-native-paper";

type TextProps = {
  title: string;
  value: string;
  noDivider?: boolean;
  readOnly?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
};
const TextInfo: FC<TextProps> = (props) => {
  const { title, value, noDivider, readOnly = true,onChangeText, keyboardType } = props;
  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.label} variant="labelMedium">
            {title}
          </Text>
          {!readOnly ? (
            <TextInput
              keyboardType={keyboardType}
              value={value}
              onChangeText={onChangeText}
              textAlign="left"
              style={styles.input}
            />
          ) : (
            <Text style={styles.value} variant="bodyLarge">
              {value}
            </Text>
          )}
        </View>
      </View>
      {noDivider ? null : <Divider style={styles.divider} />}
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: { marginVertical: 6, alignSelf: "flex-start" },
  textContainer: { marginVertical: 6 },
  divider: {
    marginHorizontal: 16,
  },
  label: { opacity: 0.6 },
  value: { marginTop: 4 },
  input: {
    marginTop: 4,
  },
});

export default TextInfo;
