import React, { useState } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useSnackbar } from "@rn-flix/snackbar";
import { useAuth } from "@shared/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QueriesKeys from "@shared/declarations/queriesKeys";
import Screen from "@shared/components/Screen";
import { Button, Text, useTheme } from "react-native-paper";

const AppleLogin = ({ navigation }: any) => {
  const { setToken } = useAuth();
  const { show } = useSnackbar();
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApple = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Ici on peut dériver un token local (sans backend) à partir de user + nonce
      const localToken = credential.user;
      await AsyncStorage.setItem(QueriesKeys.USER_TOKEN, localToken);
      setToken(localToken);
      show("Connexion réussie");
      navigation.reset({ index: 0, routes: [{ name: "HomeTabs" as never }] });
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") return;
      show("Connexion Apple refusée");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen contentStyle={[styles.screen, { backgroundColor: colors.surface }]}>
      <View style={styles.hero}>
        <Image
          source={require("../../../assets/cobra.png")}
          style={styles.logo}
        />
        <Text variant="headlineMedium" style={styles.title}>
          ReptiTrack
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Suivi complet de vos reptiles, même hors ligne.
        </Text>
      </View>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.cardTitle}>
          Connexion
        </Text>
        <Text variant="bodySmall" style={styles.cardSubtitle}>
          Utilise Apple pour une connexion simple et sécurisée.
        </Text>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={10}
          style={styles.btn}
          onPress={handleApple}
          disabled={isSubmitting}
        />
        <Button
          mode="text"
          onPress={handleApple}
          style={{ marginTop: 8 }}
          contentStyle={{ paddingVertical: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion…" : "Réessayer"}
        </Button>
        {Platform.OS === "web" && (
          <Text variant="bodySmall" style={styles.note}>
            Sur web, Apple Sign In requiert un environnement Apple (Safari).
            Teste surtout sur iOS.
          </Text>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { padding: 24, justifyContent: "center", gap: 24, flex: 1 },
  hero: { alignItems: "center", gap: 10 },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", opacity: 0.7 },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: "#f7f9f8",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    gap: 12,
  },
  cardTitle: { textAlign: "center" },
  cardSubtitle: { textAlign: "center", opacity: 0.7 },
  btn: { width: "100%", height: 50 },
  note: { textAlign: "center", opacity: 0.6 },
});

export default AppleLogin;
