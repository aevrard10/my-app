import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useSnackbar } from "@rn-flix/snackbar";
import { useAuth } from "@shared/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QueriesKeys from "@shared/declarations/queriesKeys";
import Screen from "@shared/components/Screen";
import { Button, Text } from "react-native-paper";

const AppleLogin = ({ navigation }: any) => {
  const { setToken } = useAuth();
  const { show } = useSnackbar();

  const handleApple = async () => {
    try {
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
    }
  };

  useEffect(() => {
    handleApple();
  }, []);

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Connexion</Text>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.btn}
          onPress={handleApple}
        />
        <Button onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          Retour
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { padding: 20 },
  container: { gap: 16 },
  title: { textAlign: "center" },
  btn: { width: "100%", height: 48 },
});

export default AppleLogin;
