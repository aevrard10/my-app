import React, { FC, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Divider, SegmentedButtons, Text } from "react-native-paper";
import { Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import useMeasurementsQuery from "../ReptileProfileDetails/hooks/data/queries/useMeasurementsQuery";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useSnackbar } from "@rn-flix/snackbar";
import useAddMeasurementMutation from "./hooks/data/mutations/useAddMeasurementsMutation";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import TextInput from "@shared/components/TextInput";
import { useI18n } from "@shared/i18n";

const initialValues = {
  weight: 0,
  size: 0,
  date: formatYYYYMMDD(new Date()),
  size_mesure: "cm",
  weight_mesure: "g",
};

const schema = {
  weight: Yup.number().required("Le poids est requis"),
  size: Yup.number().required("La taille est requise"),
  date: Yup.date().required("La date est requise"),
};
type Props = StaticScreenProps<{
  id: string;
}>;
const AddMesuarements = ({ route }: Props) => {
  const id = route.params.id;
  const { show } = useSnackbar();
  const { t, locale } = useI18n();
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();
  const { mutate: addMeasurement } = useAddMeasurementMutation();
  const { navigate } = useNavigation();
  return (
    <Screen>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          addMeasurement(
            {
              input: {
                reptile_id: id,
                date: values.date,
                weight: values.weight,
                size: values.size,
                size_mesure: values.size_mesure,
                weight_mesure: values.weight_mesure,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [...useMeasurementsQuery.queryKey, id],
                });

                console.log("Mesure ajoutée avec succès", id);
                show(t("add_measurements.success"));
                navigate(ScreenNames.REPTILE_PROFILE_DETAILS, { id });
              },
              onError: (e) => {
                console.error("Erreur lors de l'ajout des mesures", e);
                show(t("add_measurements.error"));
              },
            },
          );
        }}
        // validationSchema={schema}
      >
        {(formik) => (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text variant="headlineSmall">{t("add_measurements.title")}</Text>
              <Text variant="bodySmall" style={styles.headerSubtitle}>
                {t("add_measurements.subtitle")}
              </Text>
            </View>
            <CardSurface style={styles.inputSection}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <TextInput
                  placeholder={t("add_measurements.weight")}
                  value={formik.values.weight?.toString() ?? ""}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue("weight", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  inputMode="numeric"
                />
                <SegmentedButtons
                  onValueChange={(value) => {
                    formik.setFieldValue("weight_mesure", value);
                  }}
                  value={formik.values.weight_mesure}
                  style={{ flex: 1 }}
                  buttons={[
                    {
                      value: "g",
                      label: "g",
                    },
                    {
                      value: "kg",
                      label: "kg",
                    },
                  ]}
                />
              </View>
              <Divider style={{ marginHorizontal: 8 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                  flexWrap: "nowrap",
                }}
              >
                <TextInput
                  placeholder={t("add_measurements.size")}
                  value={formik.values.size?.toString() ?? ""}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue("size", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  inputMode="numeric"
                />
                <SegmentedButtons
                  onValueChange={(value) => {
                    formik.setFieldValue("size_mesure", value);
                  }}
                  value={formik.values.size_mesure}
                  buttons={[
                    {
                      value: "cm",
                      label: "cm",
                    },
                    {
                      value: "m",
                      label: "m",
                    },
                    {
                      value: "mm",
                      label: "mm",
                    },
                  ]}
                  style={{ flex: 1 }}
                />
              </View>
              <Divider style={{ marginHorizontal: 8 }} />

              <DatePickerInput
                mode="outlined"
                style={styles.pickerInput}
                dense
                outlineStyle={styles.outlineStyle}
                locale={locale}
                label={t("add_measurements.date")}
                saveLabel={t("common.confirm")}
                withDateFormatInLabel={false}
                value={inputDate}
                onChange={(data) => {
                  setInputDate(data);
                  formik.setFieldValue("date", formatYYYYMMDD(data));
                }}
                inputMode="start"
              />
            </CardSurface>
            <View style={styles.button}>
              <Button mode="contained" onPress={formik.submitForm}>
                {t("add_measurements.add")}
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  outlineStyle: {
    borderWidth: 0,
  },
  pickerInput: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    // backgroundColor: "red",
    position: "relative",
  },
  input: {
    padding: 10,
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
    // flex: 1,
  },
  button: {
    gap: 10,
    marginHorizontal: 40,
  },
  inputSection: {
    margin: 10,
    flex: 1,
  },
});

export default AddMesuarements;
// TODO: refactor this screen, it's getting too big. Maybe split into multiple smaller components?
