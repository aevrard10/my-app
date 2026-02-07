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
import { useI18n } from "@shared/i18n";

const initialValues = {
  name: "",
  quantity: "",
  type: "",
};

const AddFeed = () => {
  const { show } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: addFoodStock } = useAddFoodStockMutation();
  const { goBack } = useNavigation();
  const { t } = useI18n();
  const schema = Yup.object().shape({
    name: Yup.string().required(t("add_feed.validation.name_required")),
    quantity: Yup.number()
      .typeError(t("add_feed.validation.qty_number"))
      .required(t("add_feed.validation.qty_required"))
      .min(1, t("add_feed.validation.qty_min")),
    type: Yup.string().nullable(),
  });

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
              {
                input: {
                  name: values.name,
                  quantity: Number(values.quantity),
                  unit: null,
                  type: values.type || null,
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: useFoodQuery.queryKey,
                  });
                  show(t("add_feed.success"));
                  goBack();
                },
                onError: () => {
                  show(t("add_feed.error"));
                },
              },
            );
          }}
        >
          {(formik) => (
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text variant="headlineSmall">{t("add_feed.title")}</Text>
                <Text variant="bodySmall" style={styles.headerSubtitle}>
                  {t("add_feed.subtitle")}
                </Text>
              </View>

              <CardSurface style={styles.inputSection}>
                <View style={styles.fieldContainer}>
                  <Button mode="contained" onPress={() => setVisible(true)}>
                    {formik.values.name || t("add_feed.select_food")}
                  </Button>

                  <Portal>
                    <Dialog
                      visible={visible}
                      onDismiss={() => setVisible(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>{t("add_feed.choose_food")}</Dialog.Title>
                      <Dialog.Content>
                        <ScrollView style={{ maxHeight: 300 }}>
                          <RadioButton.Group
                            onValueChange={(value) => {
                              formik.setFieldValue("name", value);
                              setVisible(false);
                            }}
                            value={formik.values.name}
                          >
                            <RadioButton.Item
                              label={t("food.chick")}
                              value="Poussin"
                            />
                            <RadioButton.Item
                              label={t("food.chicken")}
                              value="Poule"
                            />
                            <RadioButton.Item
                              label={t("food.quail")}
                              value="Caille"
                            />
                            <RadioButton.Item
                              label={t("food.duck")}
                              value="Canard"
                            />
                            <RadioButton.Item
                              label={t("food.turkey")}
                              value="Dinde"
                            />
                            <RadioButton.Item
                              label={t("food.mouse")}
                              value="Souris"
                            />
                            <RadioButton.Item
                              label={t("food.rat")}
                              value="Rat"
                            />
                            <RadioButton.Item
                              label={t("food.lizard")}
                              value="Lézard"
                            />
                            <RadioButton.Item
                              label={t("food.cricket")}
                              value="Criquet"
                            />
                            <RadioButton.Item
                              label={t("food.roach")}
                              value="Blatte"
                            />
                            <RadioButton.Item
                              label={t("food.mealworm")}
                              value="Vers de farine"
                            />
                            <RadioButton.Item
                              label={t("food.earthworm")}
                              value="Vers de terre"
                            />
                            <RadioButton.Item
                              label={t("food.grillon")}
                              value="Grillon"
                            />
                            <RadioButton.Item
                              label={t("food.cockroach")}
                              value="Cafard"
                            />
                            <RadioButton.Item
                              label={t("food.fish")}
                              value="Poisson"
                            />
                            <RadioButton.Item
                              label={t("food.other")}
                              value="Autre"
                            />
                          </RadioButton.Group>
                        </ScrollView>
                      </Dialog.Content>
                    </Dialog>
                  </Portal>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.fieldContainer}>
                  <Button mode="outlined" onPress={() => setVisibleType(true)}>
                    {formik.values.type || t("add_feed.select_type")}
                  </Button>
                  <Portal>
                    <Dialog
                      visible={visibleType}
                      onDismiss={() => setVisibleType(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>{t("add_feed.choose_type")}</Dialog.Title>
                      <Dialog.Content>
                        <RadioButton.Group
                          onValueChange={(value) => {
                            formik.setFieldValue("type", value);
                            setVisibleType(false);
                          }}
                          value={formik.values.type}
                        >
                          <RadioButton.Item
                            label={t("food_type.rodent")}
                            value="Rongeur"
                          />
                          <RadioButton.Item
                            label={t("food_type.insects")}
                            value="Insectes"
                          />
                          <RadioButton.Item
                            label={t("food_type.poultry")}
                            value="Volaille"
                          />
                          <RadioButton.Item
                            label={t("food_type.fish")}
                            value="Poisson"
                          />
                          <RadioButton.Item
                            label={t("food_type.reptile")}
                            value="Reptile"
                          />
                          <RadioButton.Item
                            label={t("food_type.other")}
                            value="Autre"
                          />
                        </RadioButton.Group>
                      </Dialog.Content>
                    </Dialog>
                  </Portal>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.fieldContainer}>
                  <TextInput
                    placeholder={t("add_feed.quantity")}
                    keyboardType="numeric"
                    value={formik.values.quantity.toString()}
                    onChangeText={(text) => {
                      const number = parseInt(text, 10);
                      formik.setFieldValue(
                        "quantity",
                        isNaN(number) ? "" : number,
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
                  {t("add_feed.add")}
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
// todo: refactor to use react-native-dropdown-picker for better UX and performance with long lists
