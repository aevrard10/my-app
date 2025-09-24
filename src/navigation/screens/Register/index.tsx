import { View, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "@rn-flix/snackbar";
import { Button, Avatar, Surface, TextInput } from "react-native-paper";
import useBreakpoints from "@shared/hooks/useBreakpoints";
import useRegisterMutation from "./hooks/mutations/useRegisterMutation";

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
  const { isMd } = useBreakpoints();

  return (
    <ScrollView>
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
                  mutate(
                    {
                      input: {
                        username: values.username,
                        email: values.email,
                        password: values.password,
                      },
                    },
                    {
                      onSuccess: async (data) => {
                        resetForm();
                        show("Inscription réussi", {
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
                      outlineStyle={{ borderWidth: 0 }}
                      style={styles.input}
                      placeholder="Nom d'utilisateur"
                      value={formik.values.username}
                      onChangeText={formik.handleChange("username")}
                      onBlur={formik.handleBlur("username")}
                    />
                    <TextInput
                      outlineStyle={{ borderWidth: 0 }}
                      style={styles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      mode="outlined"
                      value={formik.values.email}
                      onChangeText={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                    />
                    <TextInput
                      outlineStyle={{ borderWidth: 0 }}
                      mode="outlined"
                      style={styles.input}
                      placeholder="Mot de passe"
                      value={formik.values.password}
                      onChangeText={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                    />

                    <Button
                      mode="outlined"
                      loading={isPending}
                      disabled={!formik.isValid}
                      onPress={formik.submitForm}
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
    </ScrollView>
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
export default Register;
