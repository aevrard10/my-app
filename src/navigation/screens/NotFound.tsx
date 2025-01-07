import { Button } from "@react-navigation/elements";
import React from "react";
import { StyleSheet, View } from "react-native";
import lottieNoFound from "../../assets/not_found.json";
import Lottie from "@shared/components/Lottie";
import ScreenNames from "@shared/declarations/screenNames";

export function NotFound() {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.lottieContainer}>
          <Lottie source={lottieNoFound} autoPlay isLoop={false} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button screen={ScreenNames.HOME_TABS}>Retouner à l'accueil</Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  lottieContainer: {
    width: "50%",
    height: "50%",
  },
  container: {
    display: "flex",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 10,
//   },
// });
