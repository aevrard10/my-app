import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Text, TextInput } from "react-native-paper";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useSnackbar } from "@rn-flix/snackbar";
import useResetPasswordMutation from "./hooks/data/mutations/useResetPasswordMutation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@shared/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QueriesKeys from "@shared/declarations/queriesKeys";
import ScreenNames from "@shared/declarations/screenNames";

const schema = Yup.object().shape({
  token: Yup.string().required("Token requis"),
  password: Yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
});

const ResetPassword = () => {
  const { show } = useSnackbar();
  const { setToken } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { mutate, isPending } = useResetPasswordMutation();

  const initialToken = route.params?.token || "";
  const initialEmail = route.params?.email || "";

  useEffect(() => {
    // nothing for now
  }, [initialToken]);

  return (
    <Screen contentStyle={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <CardSurface style={styles.card}>
            <Text variant="titleLarge" style={styles.title}>
              Nouveau mot de passe
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Colle le token reçu par email et choisis un nouveau mot de passe.
            </Text>

            <Formik
              initialValues={{ token: initialToken, password: "", confirm: "" }}
              validationSchema={schema}
              onSubmit={(values) => {
                mutate(
                  {
                    input: { token: values.token.trim(), newPassword: values.password },
                  },
                  {
                    onSuccess: async (data) => {
                      const authToken = data?.resetPassword?.token;
                      if (authToken) {
                        await AsyncStorage.setItem(QueriesKeys.USER_TOKEN, authToken);
                        setToken(authToken);
                        show("Mot de passe mis à jour");
                        navigation.reset({
                          index: 0,
                          routes: [{ name: ScreenNames.HOME_TABS as never }],
                        });
                      } else {
                        show("Mot de passe mis à jour. Connecte-toi.");
                        navigation.navigate(ScreenNames.LOGIN as never);
                      }
                    },
                    onError: () => show("Lien expiré ou invalide"),
                  }
                );
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <TextInput
                    label="Token"
                    mode="outlined"
                    value={values.token}
                    onChangeText={handleChange("token")}
                    autoCapitalize="none"
                  />
                  {touched.token && errors.token ? (
                    <Text style={styles.error}>{errors.token}</Text>
                  ) : null}

                  <TextInput
                    label="Nouveau mot de passe"
                    mode="outlined"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    secureTextEntry
                  />
                  {touched.password && errors.password ? (
                    <Text style={styles.error}>{errors.password}</Text>
                  ) : null}

                  <TextInput
                    label="Confirmer"
                    mode="outlined"
                    value={values.confirm}
                    onChangeText={handleChange("confirm")}
                    secureTextEntry
                  />
                  {touched.confirm && errors.confirm ? (
                    <Text style={styles.error}>{errors.confirm}</Text>
                  ) : null}

                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    loading={isPending}
                    style={{ marginTop: 12 }}
                  >
                    Réinitialiser
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.navigate(ScreenNames.LOGIN as never)}
                    style={{ marginTop: 4 }}
                  >
                    Retour à la connexion
                  </Button>

                  {initialEmail ? (
                    <Text variant="labelSmall" style={{ opacity: 0.6, marginTop: 8 }}>
                      Email : {initialEmail}
                    </Text>
                  ) : null}
                </View>
              )}
            </Formik>
          </CardSurface>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    gap: 12,
    padding: 16,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.7,
  },
  form: {
    gap: 10,
  },
  error: {
    color: "#b3261e",
  },
});

export default ResetPassword;
