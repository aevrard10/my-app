import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import useLoginMutation from "./hooks/data/mutations/useLoginMutation";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@shared/contexts/AuthContext";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";

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
        "Permission not granted to get push token for push notification!"
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

const initialValues = {
  email: "",
  password: "",
};

const schema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const { mutate, isPending } = useLoginMutation();
  const { show } = useSnackbar();
  const { setToken } = useAuth();
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
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
            <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
              <Image
                source={require("../../../assets/twoReptile/reptile2.png")}
                style={styles.heroImage}
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
              Accédez à votre suivi personnalisé.
            </Text>

            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                mutate(
                  {
                    input: {
                      email: values.email,
                      password: values.password,
                      expo_token: expoPushToken,
                    },
                  },
                  {
                    onSuccess: async (data) => {
                      resetForm();
                      await AsyncStorage.setItem(
                        QueriesKeys.USER_TOKEN,
                        data?.login?.token
                      );
                      setToken(data?.login?.token);
                      show("Connexion réussi", {
                        label: "Ok",
                      });
                    },
                    onError: () => {
                      show(
                        "Une erreur est survenue, Veuillez réessayer ...",
                        {
                          label: "Ok",
                        }
                      );
                    },
                  }
                );
              }}
            >
              {(formik) => (
                <View style={styles.formContainer}>
                  <TextInput
                    mode="outlined"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholder="Email"
                    value={formik.values.email}
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    error={!!formik.errors.email}
                    left={<TextInput.Icon icon="email-outline" />}
                  />
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    placeholder="Mot de passe"
                    value={formik.values.password}
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    error={!!formik.errors.password}
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={!showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />

                  <Button
                    loading={isPending}
                    disabled={!formik.isValid}
                    onPress={formik.submitForm}
                    mode="contained"
                    contentStyle={styles.primaryButtonContent}
                  >
                    Se connecter
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigate(ScreenNames.FORGOT_PASSWORD as never)}
                    style={{ marginTop: 6 }}
                  >
                    Mot de passe oublié ?
                  </Button>
                </View>
              )}
            </Formik>
          </CardSurface>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Pas encore de compte ?
            </Text>
            <Button
              mode="text"
              onPress={() => navigate(ScreenNames.REGISTER)}
            >
              Créer un compte
            </Button>
          </View>
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
    width: 96,
    height: 96,
    resizeMode: "contain",
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
