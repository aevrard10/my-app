import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Lottie from "@shared/components/Lottie";
import lottieNoFound from "../../../assets/not_found.json";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "@shared/i18n";

export function NotFound() {
  const { navigate } = useNavigation();
  const { t } = useI18n();
  return (
    <Screen contentStyle={styles.screen}>
      <CardSurface style={styles.card}>
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <Lottie source={lottieNoFound} autoPlay isLoop={false} />
          </View>
          <Text variant="titleLarge">{t("notfound.title")}</Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            {t("notfound.subtitle")}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigate(ScreenNames.HOME_TABS)}
          >
            {t("notfound.back")}
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
