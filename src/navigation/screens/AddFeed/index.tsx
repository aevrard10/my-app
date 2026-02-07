import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Divider,
  Dialog,
  RadioButton,
  Portal,
  Text,
  Searchbar,
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
import {
  FOOD_ITEMS,
  getFoodLabel,
  getFoodTypeKeyFromFood,
  getFoodTypeLabel,
  normalizeFoodName,
} from "@shared/constants/foodCatalog";
import useSearchFilter from "@shared/hooks/useSearchFilter";

const initialValues = {
  name: "",
  quantity: "",
  type: "",
  custom_name: "",
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
    custom_name: Yup.string().when("name", {
      is: "other",
      then: (schema) =>
        schema.required(t("add_feed.validation.custom_required")),
      otherwise: (schema) => schema,
    }),
  });

  const [visible, setVisible] = useState(false);
  const [foodSearch, setFoodSearch] = useState("");
  const [filteredFoodItems] = useSearchFilter(
    FOOD_ITEMS,
    foodSearch,
    undefined,
    [(item) => t(item.labelKey)],
    1,
  );

  return (
    <Screen>
      <Portal.Host>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values) => {
            const isCustom = values.name === "other";
            const rawName = isCustom ? values.custom_name.trim() : values.name;
            const finalName = isCustom
              ? rawName
              : normalizeFoodName(rawName);
            const derivedType =
              isCustom
                ? "other"
                : values.type || getFoodTypeKeyFromFood(rawName) || "other";
            addFoodStock(
              {
                input: {
                  name: finalName,
                  quantity: Number(values.quantity),
                  unit: null,
                  type: derivedType || null,
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
                    {formik.values.name
                      ? getFoodLabel(formik.values.name, t)
                      : t("add_feed.select_food")}
                  </Button>

                  <Portal>
                    <Dialog
                      visible={visible}
                      onDismiss={() => setVisible(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>{t("add_feed.choose_food")}</Dialog.Title>
                      <Dialog.Content>
                        <Searchbar
                          elevation={0}
                          mode="bar"
                          value={foodSearch}
                          onChangeText={setFoodSearch}
                          placeholder={t("add_feed.search_food")}
                          clearButtonMode="always"
                          style={styles.searchbar}
                          inputStyle={styles.searchInput}
                        />
                        <ScrollView style={{ maxHeight: 300 }}>
                          <RadioButton.Group
                            onValueChange={(value) => {
                              formik.setFieldValue("name", value);
                              const derived = getFoodTypeKeyFromFood(value);
                              formik.setFieldValue("type", derived || "other");
                              if (value !== "other") {
                                formik.setFieldValue("custom_name", "");
                              }
                              setVisible(false);
                            }}
                            value={formik.values.name}
                          >
                            {filteredFoodItems.length > 0 ? (
                              filteredFoodItems.map((item) => (
                                <RadioButton.Item
                                  key={item.key}
                                  label={t(item.labelKey)}
                                  value={item.key}
                                />
                              ))
                            ) : (
                              <Text style={styles.emptyText}>
                                {t("add_feed.no_results")}
                              </Text>
                            )}
                          </RadioButton.Group>
                        </ScrollView>
                      </Dialog.Content>
                    </Dialog>
                  </Portal>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.fieldContainer}>
                  <Text variant="labelSmall" style={styles.typeLabel}>
                    {t("add_feed.type_label")}
                  </Text>
                  <Text variant="bodyMedium" style={styles.typeValue}>
                    {formik.values.type
                      ? getFoodTypeLabel(formik.values.type, t)
                      : t("add_feed.type_placeholder")}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                {formik.values.name === "other" ? (
                  <>
                    <View style={styles.fieldContainer}>
                      <TextInput
                        placeholder={t("add_feed.custom_name")}
                        value={formik.values.custom_name}
                        onChangeText={formik.handleChange("custom_name")}
                        style={styles.input}
                      />
                    </View>
                    <Divider style={styles.divider} />
                  </>
                ) : null}

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
  typeLabel: {
    opacity: 0.6,
    marginBottom: 6,
  },
  typeValue: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
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
  searchbar: {
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 14,
  },
  emptyText: {
    opacity: 0.6,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default AddFeed;
// todo: refactor to use react-native-dropdown-picker for better UX and performance with long lists
