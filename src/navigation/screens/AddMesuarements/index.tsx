

import React, { FC, useState } from "react";
import { TextInput, View, StyleSheet, ScrollView, Modal } from "react-native";
import {
  
  Button,
  Surface,
  Divider,
  SegmentedButtons,
} from "react-native-paper";
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
  const [inputDate, setInputDate] = useState<Date | undefined>(
    new Date()
  );
    const queryClient = useQueryClient();
    const { mutate: addMeasurement } = useAddMeasurementMutation();
const {navigate} = useNavigation();
 return ( <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values) => {
        console.log('values',values);
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
                queryKey: useMeasurementsQuery.queryKey,
              });
              console.log("success");

              show("Mesures ajoutées avec succès!");
              navigate(ScreenNames.REPTILE_PROFILE_DETAILS, { id });
            },
            onError: () => {
              show("Une erreur s'est produite");
            },
          }
        );
      }}
      // validationSchema={schema}
    >
      {(formik) => (
  
        
          <ScrollView>
            <Surface style={styles.inputSection}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <TextInput
                  placeholder="Poids"
                  value={formik.values.weight}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue("weight", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                  }}
                  style={styles.input}
                />
                <SegmentedButtons
                  onValueChange={(value) => {
                    formik.setFieldValue("weight_mesure", value);
                  }}
                  value={formik.values.weight_mesure}
                  style={{ flex: 1}}
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
                  flexWrap: 'nowrap',
                }}
              >
                <TextInput
                  placeholder="Taille"
                  value={formik.values.size}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue("size", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                  }}
                  style={styles.input}
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
                locale="fr"
                label="Date"
                saveLabel="Confirmer"
                withDateFormatInLabel={false}
                value={inputDate}
                onChange={(data) => {
                  console.log(formatYYYYMMDD(data));
                  setInputDate(data);
                  formik.setFieldValue("date", formatYYYYMMDD(data));
                }}
                inputMode="start"
              />
            </Surface>
            <View style={styles.button}>
              <Button mode="contained" onPress={formik.submitForm}>
                Ajouter
              </Button>
            
            </View>
          </ScrollView>

      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  outlineStyle: {
    borderWidth: 0,
  },
  pickerInput: {
    borderWidth: 0,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderTopColor: "#fff",
    // backgroundColor: "red",
    position: "relative",
  },
  input: {
    padding: 10,
    outlineStyle: "none",
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
    flex:1,
  },
});


export default AddMesuarements;