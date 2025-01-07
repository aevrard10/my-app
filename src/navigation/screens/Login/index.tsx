import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Yup from "yup";
import useLoginMutation from "./hooks/data/mutations/useLoginMutation";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { Button, Avatar, Text, Surface, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@shared/contexts/AuthContext";
import useBreakpoints from "@shared/hooks/useBreakpoints";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import ScreenNames from "@shared/declarations/screenNames";
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
      console.log(pushTokenString);
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
  const { isMd } = useBreakpoints();
  const { navigate } = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Surface
          style={{
            width: "90%",
            // overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {isMd && (
              <Image
                source={{
                  uri: "https://lapauseinfo.fr/wp-content/uploads/2024/02/26771140-une-bleu-serpent-naturel-contexte-gratuit-photo-scaled.jpeg",
                }}
                style={{ width: "50%", height: "100%" }}
              />
            )}
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={styles.avatarBorder}>
                  <Avatar.Icon
                    size={150}
                    style={{
                      borderWidth: 5,
                      borderColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    icon={"account-circle"}
                  />
                </View>
              </View>

              <Formik
                initialValues={initialValues}
                validationSchema={schema}
                enableReinitialize
                onSubmit={(values, { resetForm }) => {
                  if (!expoPushToken) {
                    show(
                      "Le token Expo n'a pas encore été récupéré. Veuillez réessayer.",
                      {
                        label: "Ok",
                      }
                    );
                    return;
                  }
                  mutate(
                    {
                      input: {
                        email: values.email,
                        password: values.password,
                        expo_token: expoPushToken, // expoPushToken,
                      },
                    },
                    {
                      onSuccess: async (data) => {
                        console.log("data", data);
                        resetForm();
                        await AsyncStorage.setItem(
                          QueriesKeys.USER_TOKEN,
                          data?.login?.token
                        );
                        setToken(data?.login?.token); // Met à jour le contexte
                        show("Connexion réussi", {
                          label: "Ok",
                        });
                      },
                      onError: (e) => {
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
                      outlineStyle={{ borderWidth: 0 }}
                      keyboardType="email-address"
                      style={styles.input}
                      placeholder="Email"
                      value={formik.values.email}
                      onChangeText={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      error={formik.errors.email}
                    />
                    <TextInput
                      mode="outlined"
                      outlineStyle={{ borderWidth: 0 }}
                      style={styles.input}
                      secureTextEntry={!showPassword}
                      placeholder="Mot de passe"
                      value={formik.values.password}
                      onChangeText={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                      error={formik.errors.password}
                      right={
                        <TextInput.Icon
                          icon={!showPassword ? "eye-off" : "eye"}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                    />

                    <Button
                      loading={isPending}
                      disabled={!formik.isValid}
                      onPress={formik.submitForm}
                      mode="contained"
                    >
                      Connexion
                    </Button>
                    <Button
                      onPress={() => navigate(ScreenNames.REGISTER)}
                      mode="contained"
                    >
                      S'inscrire
                    </Button>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 60,
    margin: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarBorder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  header: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
  },
});
export default Login;
