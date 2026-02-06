import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { Avatar, Button, Text, TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import useRegisterMutation from "./hooks/mutations/useRegisterMutation";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";

const initialValues = {
  email: "",
  password: "",
  username: "",
};

const schema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
  username: Yup.string().required(),
});

const Register = () => {
  const { mutate, isPending } = useRegisterMutation();
  const { show } = useSnackbar();
  const { navigate } = useNavigation();
  const { colors } = useTheme();

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
              style={[styles.heroBadge, { backgroundColor: colors.secondary }]}
            >
              <Avatar.Image
                size={100}
                source={require("../../../assets/twoReptile/reptile.png")}
              />
            </View>
            <Text variant="headlineMedium" style={styles.title}>
              Créer votre espace
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Centralisez vos soins, stocks et historiques en quelques clics.
            </Text>
          </View>

          <CardSurface style={styles.card}>
            <Text variant="titleLarge" style={styles.formTitle}>
              Inscription
            </Text>
            <Text variant="bodySmall" style={styles.formSubtitle}>
              Rejoignez votre tableau de bord reptile.
            </Text>

            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                mutate(
                  {
                    input: {
                      username: values.username,
                      email: values.email,
                      password: values.password,
                    },
                  },
                  {
                    onSuccess: async () => {
                      resetForm();
                      show("Inscription réussi", {
                        label: "Ok",
                      });
                      navigate(ScreenNames.LOGIN);
                    },
                    onError: () => {
                      show("Une erreur est survenue, Veuillez réessayer ...", {
                        label: "Ok",
                      });
                    },
                  },
                );
              }}
            >
              {(formik) => (
                <View style={styles.formContainer}>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    value={formik.values.username}
                    onChangeText={formik.handleChange("username")}
                    onBlur={formik.handleBlur("username")}
                    left={<TextInput.Icon icon="account-outline" />}
                  />
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={formik.values.email}
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    left={<TextInput.Icon icon="email-outline" />}
                  />
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={formik.values.password}
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    left={<TextInput.Icon icon="lock-outline" />}
                  />

                  <Button
                    loading={isPending}
                    disabled={!formik.isValid}
                    onPress={formik.submitForm}
                    mode="contained"
                    contentStyle={styles.primaryButtonContent}
                  >
                    Créer mon compte
                  </Button>
                </View>
              )}
            </Formik>
          </CardSurface>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Déjà un compte ?
            </Text>
            <Button mode="text" onPress={() => navigate(ScreenNames.LOGIN)}>
              Se connecter
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

export default Register;
