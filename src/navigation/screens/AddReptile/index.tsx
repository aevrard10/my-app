import { Button, TextInput } from "react-native-paper";
import useAddReptilesMutation from "../Home/hooks/mutations/useAddReptilesMutation";
import { Formik } from "formik";
import useReptilesQuery from "../Home/hooks/queries/useReptilesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

const initialValues = {
  name: "",
  species: "",
  age: 0,
  last_fed: "",
};
const schema = Yup.object().shape({
  name: Yup.string().required(),
  species: Yup.string().required(),
  age: Yup.number().required(),
  last_fed: Yup.string(),
});
const AddReptile = () => {
  const { mutate: addReptile, isPending } = useAddReptilesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { goBack } = useNavigation();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      isInitialValid={false}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        addReptile(
          {
            input: {
              name: values.name,
              species: values.species,
              age: values.age,
              last_fed: values.last_fed,
            },
          },
          {
            onSuccess: () => {
              resetForm();

              queryClient.invalidateQueries({
                queryKey: useReptilesQuery.queryKey,
              });
              goBack();
              show("Reptile ajouté avec succès !", {
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
            label="Name"
            value={formik.values.name}
            onChangeText={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            error={formik.errors.name}
          />
          <TextInput
            label="Species"
            value={formik.values.species}
            onChangeText={formik.handleChange("species")}
            onBlur={formik.handleBlur("species")}
            error={formik.errors.species}
          />
          <TextInput
            label="Age"
            value={formik.values.age?.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              const number = parseInt(text, 10);
              formik.setFieldValue("age", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
            }}
            onBlur={formik.handleBlur("age")}
            inputMode="numeric"
            error={formik.errors.age}
          />
          <TextInput
            label="Last Fed"
            value={formik.values.last_fed}
            onChangeText={formik.handleChange("last_fed")}
            onBlur={formik.handleBlur("last_fed")}
            error={formik.errors.last_fed}
          />
          <Button
            icon={"plus"}
            loading={isPending}
            disabled={!formik.isValid}
            onPress={formik.submitForm}
            mode="contained"
          >
            AJOUTER
          </Button>
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
export default AddReptile;
