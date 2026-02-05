import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Lottie from "@shared/components/Lottie";
import lottieNoFound from "../../../assets/not_found.json";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useNavigation } from "@react-navigation/native";

export function NotFound() {
  const { navigate } = useNavigation();
  return (
    <Screen contentStyle={styles.screen}>
      <CardSurface style={styles.card}>
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <Lottie source={lottieNoFound} autoPlay isLoop={false} />
          </View>
          <Text variant="titleLarge">Page introuvable</Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Cette page n&apos;existe pas. Revenez à l&apos;accueil.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigate(ScreenNames.HOME_TABS)}
          >
            Retour à l&apos;accueil
          </Button>
        </View>
      </CardSurface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  card: {
    padding: 24,
  },
  lottieContainer: {
    width: 180,
    height: 180,
  },
  container: {
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 8,
  },
});
