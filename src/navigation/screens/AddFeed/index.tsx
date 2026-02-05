import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Divider,
  Dialog,
  RadioButton,
  Portal,
  Text,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useSnackbar } from "@rn-flix/snackbar";
import useAddFoodStockMutation from "./hooks/data/mutations/useAddFoodStockMutation";
import useFoodQuery from "../Feed/hooks/data/queries/useStockQuery";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import TextInput from "@shared/components/TextInput";

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
    <Screen>
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
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text variant="headlineSmall">Ajouter un aliment</Text>
                <Text variant="bodySmall" style={styles.headerSubtitle}>
                  Gardez votre stock à jour pour chaque type de proie.
                </Text>
              </View>

              <CardSurface style={styles.inputSection}>
                <View style={styles.fieldContainer}>
                  <Button mode="contained" onPress={() => setVisible(true)}>
                    {formik.values.name || "Sélectionner une nourriture"}
                  </Button>

                  <Portal>
                    <Dialog
                      visible={visible}
                      onDismiss={() => setVisible(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>Choisir un aliment</Dialog.Title>
                      <Dialog.Content>
                        <ScrollView style={{ maxHeight: 300 }}>
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
                            <RadioButton.Item label="Lézard" value="Lézard" />
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
                        </ScrollView>
                      </Dialog.Content>
                    </Dialog>
                  </Portal>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.fieldContainer}>
                  <Button mode="outlined" onPress={() => setVisibleType(true)}>
                    {formik.values.type || "Sélectionner le type"}
                  </Button>
                  <Portal>
                    <Dialog
                      visible={visibleType}
                      onDismiss={() => setVisibleType(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>Choisir un type</Dialog.Title>
                      <Dialog.Content>
                        <RadioButton.Group
                          onValueChange={(value) => {
                            formik.setFieldValue("type", value);
                            setVisibleType(false);
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
              </CardSurface>

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
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  inputSection: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  divider: {
    marginVertical: 10,
  },
  dialog: {
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default AddFeed;
