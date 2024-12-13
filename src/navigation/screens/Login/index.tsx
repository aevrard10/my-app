import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import useLoginMutation from "./hooks/data/mutations/useLoginMutation";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { TextInput, Button, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@shared/contexts/AuthContext";
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

  return (
    <View style={styles.mainContainer}>
      <Surface style={styles.surface} elevation={4}>
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
                  await AsyncStorage.setItem("token", data?.login?.token);
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
                label="Email"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                error={formik.errors.email}
              />
              <TextInput
                label="Mot de passe"
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={formik.errors.password}
              />

              <Button
                icon={"plus"}
                loading={isPending}
                disabled={!formik.isValid}
                onPress={formik.submitForm}
                mode="contained"
              >
                Connexion
              </Button>
            </View>
          )}
        </Formik>
      </Surface>
    </View>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  surface: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  mainContainer: {
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
export default Login;
