import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useSnackbar } from "@rn-flix/snackbar";
import useRequestPasswordResetMutation from "./hooks/data/mutations/useRequestPasswordResetMutation";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";

const schema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email requis"),
});

const ForgotPassword = () => {
  const { colors } = useTheme();
  const { show } = useSnackbar();
  const { mutate, isPending } = useRequestPasswordResetMutation();
  const navigation = useNavigation();

  return (
    <Screen contentStyle={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <CardSurface style={styles.card}>
            <Text variant="titleLarge" style={styles.title}>
              Mot de passe oublié
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Saisis ton email, nous t’enverrons un lien de réinitialisation.
            </Text>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={schema}
              onSubmit={(values) => {
                mutate(
                  { email: values.email },
                  {
                    onSuccess: (data) => {
                      const token = data?.requestPasswordReset?.resetToken;
                      show(
                        data?.requestPasswordReset?.message ||
                          "Lien de réinitialisation généré"
                      );
                      navigation.navigate(ScreenNames.RESET_PASSWORD as never, {
                        token,
                        email: values.email,
                      } as never);
                    },
                    onError: () => show("Impossible de générer le lien"),
                  }
                );
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <TextInput
                    label="Email"
                    mode="outlined"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    error={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email ? (
                    <Text style={styles.error}>{errors.email}</Text>
                  ) : null}

                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    loading={isPending}
                    style={{ marginTop: 12 }}
                  >
                    Envoyer le lien
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 4 }}
                  >
                    Retour
                  </Button>
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

export default ForgotPassword;
