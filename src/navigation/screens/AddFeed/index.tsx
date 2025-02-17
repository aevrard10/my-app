import React, { useState } from "react";
import { TextInput, View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Surface,
  Divider,
  Dialog,
  RadioButton,
  Portal,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useSnackbar } from "@rn-flix/snackbar";
import useAddFoodStockMutation from "./hooks/data/mutations/useAddFoodStockMutation";
import useFoodQuery from "../Feed/hooks/data/queries/useStockQuery";

const initialValues = {
  name: "",
  quantity: "",
  type: "",
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nom de la nourriture requis"),
  quantity: Yup.number()
    .typeError("La quantité doit être un nombre")
    .required("Quantité requise")
    .min(1, "La quantité doit être au moins de 1"),
});

const AddFeed = () => {
  const { show } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: addFoodStock } = useAddFoodStockMutation();
  const { goBack } = useNavigation();

  const [visible, setVisible] = useState(false);
  const [visibleType, setVisibleType] = useState(false);

  return (
    <Portal.Host>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values) => {
          addFoodStock(
            { input: values },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: useFoodQuery.queryKey,
                });
                show("Nourriture ajoutée avec succès");
                goBack();
              },
              onError: () => {
                show("Une erreur s'est produite");
              },
            }
          );
        }}
      >
        {(formik) => (
          <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.inputSection}>
              {/* Sélecteur de type de nourriture */}
              <View style={styles.fieldContainer}>
                <Button mode="outlined" onPress={() => setVisible(true)}>
                  {formik.values.name || "Sélectionner une nourriture"}
                </Button>
                <Portal>
                  <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Choisir un aliment</Dialog.Title>
                    <Dialog.Content>
                      <RadioButton.Group
                        onValueChange={(value) => {
                          formik.setFieldValue("name", value);
                          setVisible(false);
                        }}
                        value={formik.values.name}
                      >
                        <RadioButton.Item label="Poussin" value="Poussin" />
                        <RadioButton.Item label="Poule" value="Poule" />
                        <RadioButton.Item label="Caille" value="Caille" />
                        <RadioButton.Item label="Canard" value="Canard" />
                        <RadioButton.Item label="Dinde" value="Dinde" />
                        <RadioButton.Item label="Souris" value="Souris" />
                        <RadioButton.Item label="Rat" value="Rat" />
                        <RadioButton.Item label="lézard" value="lézard" />
                        <RadioButton.Item label="Criquet" value="Criquet" />
                        <RadioButton.Item label="Blatte" value="Blatte" />
                        <RadioButton.Item
                          label="Vers de farine"
                          value="Vers de farine"
                        />
                        <RadioButton.Item
                          label="Vers de terre"
                          value="Vers de terre"
                        />
                        <RadioButton.Item label="Grillon" value="Grillon" />
                        <RadioButton.Item label="Cafard" value="Cafard" />
                        <RadioButton.Item label="Poisson" value="Poisson" />
                        <RadioButton.Item label="Autre" value="Autre" />
                      </RadioButton.Group>
                    </Dialog.Content>
                  </Dialog>
                </Portal>
              </View>

              <Divider style={styles.divider} />
              {/* Sélecteur de type  */}
              <View style={styles.fieldContainer}>
                <Button mode="outlined" onPress={() => setVisibleType(true)}>
                  {formik.values.type || "Sélectionner le type"}
                </Button>
                <Portal>
                  <Dialog
                    visible={visibleType}
                    onDismiss={() => setVisibleType(false)}
                  >
                    <Dialog.Title>Choisir un type</Dialog.Title>
                    <Dialog.Content>
                      <RadioButton.Group
                        onValueChange={(value) => {
                          formik.setFieldValue("type", value);
                          setVisible(false);
                        }}
                        value={formik.values.type}
                      >
                        <RadioButton.Item label="Rongeur" value="Rongeur" />
                        <RadioButton.Item label="Insectes" value="Insectes" />
                        <RadioButton.Item label="Volaille" value="Volaille" />
                        <RadioButton.Item label="Poisson" value="Poisson" />
                        <RadioButton.Item label="Reptile" value="Reptile" />
                        <RadioButton.Item label="Autre" value="Autre" />
                      </RadioButton.Group>
                    </Dialog.Content>
                  </Dialog>
                </Portal>
              </View>

              <Divider style={styles.divider} />
              {/* Champ Quantité */}
              <View style={styles.fieldContainer}>
                <TextInput
                  placeholder="Quantité"
                  keyboardType="numeric"
                  value={formik.values.quantity.toString()}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue(
                      "quantity",
                      isNaN(number) ? "" : number
                    );
                  }}
                  style={styles.input}
                />
              </View>
            </Surface>

            {/* Bouton Ajouter */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={formik.submitForm}
                disabled={!formik.isValid}
              >
                Ajouter
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </Portal.Host>
  );
};

// 🎨 Style amélioré
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default AddFeed;
