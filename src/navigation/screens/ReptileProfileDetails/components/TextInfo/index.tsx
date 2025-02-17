import TextInput from "@shared/components/TextInput";
import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider } from "react-native-paper";

type TextProps = {
  title: string;
  value: string;
  noDivider?: boolean;
  readOnly?: boolean;
  onChangeText?: (text: string) => void;
};
const TextInfo: FC<TextProps> = (props) => {
  const { title, value, noDivider, readOnly = true,onChangeText } = props;
  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text} variant="labelMedium">{title}</Text>
          {!readOnly ? (
          <TextInput value={value} onChangeText={onChangeText} textAlign="left"  />):(

          <Text style={styles.text} variant="bodyLarge">{value}</Text>)}
        </View>
      </View>
      {noDivider ? null : <Divider style={styles.divider} />}
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: { marginVertical: 8, marginRight: 24, alignSelf: 'flex-start' },
  textContainer: { marginVertical: 8 },
  divider: {
    marginHorizontal: 16,
  },
  text: { marginLeft: 10 },
});

export default TextInfo;
