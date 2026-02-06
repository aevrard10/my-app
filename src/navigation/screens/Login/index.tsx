import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import * as AppleAuthentication from "expo-apple-authentication";

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") {
    return;
  }
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const Login = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));
  }, []);

  return (
    <Screen contentStyle={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View
              style={[styles.heroBadge, { backgroundColor: colors.primary }]}
            >
              <Avatar.Image
                size={100}
                source={require("../../../assets/twoReptile/reptile2.png")}
              />
            </View>
            <Text variant="headlineMedium" style={styles.title}>
              ReptiTrack
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Suivez l&apos;évolution, l&apos;alimentation et la santé de vos
              reptiles en un seul endroit.
            </Text>
          </View>

          <CardSurface style={styles.card}>
            <Text variant="titleLarge" style={styles.formTitle}>
              Connexion
            </Text>
            <Text variant="bodySmall" style={styles.formSubtitle}>
              Utilise ton identifiant Apple pour accéder à ReptiTrack.
            </Text>
            <View style={{ marginTop: 16 }}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={8}
                style={{ width: "100%", height: 48 }}
                onPress={() => navigate(ScreenNames.APPLE_LOGIN as never)}
              />
            </View>
          </CardSurface>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroImage: {
    resizeMode: "cover",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 6,
  },
  card: {
    padding: 20,
  },
  formTitle: {
    marginBottom: 4,
  },
  formSubtitle: {
    opacity: 0.65,
  },
  formContainer: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
  primaryButtonContent: {
    paddingVertical: 6,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    opacity: 0.6,
  },
});

export default Login;
