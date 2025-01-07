import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider } from "react-native-paper";

type TextProps = {
  title: string;
  value: string;
};
const TextInfo: FC<TextProps> = (props) => {
  const { title, value } = props;
  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text variant="labelMedium">{title}</Text>
          <Text variant="bodyLarge">{value}</Text>
        </View>
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: { marginVertical: 8, marginLeft: 16, marginRight: 24 },
  textContainer: { marginVertical: 8 },
  divider: {
    marginHorizontal: 16,
  },
});

export default TextInfo;
