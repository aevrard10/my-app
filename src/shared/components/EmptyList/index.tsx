import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Lottie from "../Lottie";
import lottieNoResult from "../../../assets/lottie_no_result.json";

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        <Lottie source={lottieNoResult} autoPlay isLoop={false} />
      </View>
      <Text variant="labelSmall">{"Aucun résultat."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    width: 100,
    height: 100,
  },
  container: {
    display: "flex",
    alignItems: "center",
  },
});

export default EmptyList;
