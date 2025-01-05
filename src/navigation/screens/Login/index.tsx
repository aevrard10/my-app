import { View, StyleSheet, TextInput, Image } from "react-native";
import * as Yup from "yup";
import useLoginMutation from "./hooks/data/mutations/useLoginMutation";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { Button, Avatar, Text, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@shared/contexts/AuthContext";
import useBreakpoints from "@shared/hooks/useBreakpoints";
import QueriesKeys from "@shared/declarations/queriesKeys";

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

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Surface
        style={{
          width: "90%",
          overflow: "hidden",
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
              isInitialValid={false}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                mutate(
                  {
                    input: {
                      email: values.email,
                      password: values.password,
                    },
                  },
                  {
                    onSuccess: async (data) => {
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
                    onError: () => {
                      show("Une erreur est survenue, Veuillez réessayer ...", {
                        label: "Ok",
                      });
                    },
                  }
                );
              }}
            >
              {(formik) => (
                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formik.values.email}
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    error={formik.errors.email}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={formik.values.password}
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    error={formik.errors.password}
                  />

                  <Button
                    loading={isPending}
                    disabled={!formik.isValid}
                    onPress={formik.submitForm}
                    mode="contained"
                  >
                    Connexion
                  </Button>
                  <Button mode="contained">S'inscrire</Button>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Surface>
    </View>
  );
};
const styles = StyleSheet.create({
  svgCurve: {
    position: "absolute",
    width: "100%",
  },
  input: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
    borderColor: "#fff",
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
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 2,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
  },
});
export default Login;
