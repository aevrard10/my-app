import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Aucun élément</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default EmptyList;
