import { Button, Divider, SegmentedButtons } from "react-native-paper";
import useAddReptilesMutation from "../Home/hooks/mutations/useAddReptilesMutation";
import { Formik } from "formik";
import useReptilesQuery from "../Home/hooks/queries/useReptilesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, TextInput } from "react-native";
import React, { useState } from "react";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";

const initialValues = {
  name: "",
  species: "",
  age: 0,
  last_fed: "",
  snake: "snake",
};
const schema = Yup.object().shape({
  name: Yup.string().required(),
  species: Yup.string().required(),
  age: Yup.number().required(),
  last_fed: Yup.string(),
  snake: Yup.string().oneOf(["snake", "lizard"]),
});
const AddReptile = () => {
  const { mutate: addReptile, isPending } = useAddReptilesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { goBack } = useNavigation();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
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
          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
            />
            <Divider style={{ marginHorizontal: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Espèce"
              onBlur={formik.handleBlur("species")}
              value={formik.values.species}
              onChangeText={formik.handleChange("species")}
            />
          </View>

          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={formik.values.age?.toString()}
              keyboardType="numeric"
              onChangeText={(text) => {
                const number = parseInt(text, 10);
                formik.setFieldValue("age", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
              }}
              onBlur={formik.handleBlur("age")}
              inputMode="numeric"
            />
            <Divider style={{ marginHorizontal: 8 }} />
            <DatePickerInput
              locale="fr"
              label="Date de naissance"
              saveLabel="Confirmer"
              style={styles.input}
              value={inputDate}
              onChange={(data) => {
                setInputDate(data);
                formik.setFieldValue("last_fed", formatYYYYMMDD(data));
              }}
              inputMode="start"
            />
          </View>
          <SegmentedButtons
            value={formik.values.snake ? "snake" : "lizard"}
            onValueChange={formik.handleChange("snake")}
            buttons={[
              {
                value: "snake",
                label: "Serpent",
              },
              {
                value: "lizard",
                label: "Varan",
              },
            ]}
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
  inputSection: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    borderRadius: 10,
  },
  input: {
    padding: 10,
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});
export default AddReptile;
