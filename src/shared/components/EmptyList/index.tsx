import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Lottie from "../Lottie";
import lottieNoResult from "../../../assets/lottie_no_result.json";

const EmptyList = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        <Lottie source={lottieNoResult} autoPlay isLoop={false} />
      </View>
      <Text variant="titleSmall" style={styles.title}>
        Aucun résultat
      </Text>
      <Text variant="bodySmall" style={[styles.subtitle, { color: colors.outline }]}>
        Ajoutez un premier élément pour commencer.
      </Text>
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
    gap: 6,
  },
  title: {
    marginTop: 4,
  },
  subtitle: {
    textAlign: "center",
  },
});

export default EmptyList;
