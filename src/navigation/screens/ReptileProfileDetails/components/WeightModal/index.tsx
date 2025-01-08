import React, { FC } from "react";
import { TextInput, View, StyleSheet, ScrollView, Modal } from "react-native";
import {
  // Modal,
  Button,
  Text,
  Surface,
  Divider,
  Portal,
  Appbar,
} from "react-native-paper";
import { ErrorMessage, Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
import * as Yup from "yup";
type WeightModalProps = {
  visible: boolean;
  onPress: () => void;
  onSubmit: () => void;
};

const initialValues = {
  weight: 0,
  size: 0,
  date: "",
};

const schema = {
  weight: Yup.number().required("Le poids est requis"),
  size: Yup.number().required("La taille est requise"),
  date: Yup.date().required("La date est requise"),
};
// TODO: transformer en page
const WeightModal: FC<WeightModalProps> = (props) => {
  const { visible, onPress, onSubmit } = props;
  const [inputDate, setInputDate] = React.useState<Date | undefined>(
    new Date()
  );
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
      // validationSchema={schema}
    >
      {(formik) => (
        <Modal
          visible={visible}
          onDismiss={onPress}
          contentContainerStyle={{
            backgroundColor: "white",
            marginHorizontal: 20,
            padding: 20,
            gap: 10,
          }}
        >
          <Appbar.Header
            style={[
              {
                backgroundColor: "#fff",
              },
            ]}
          >
            <Appbar.BackAction onPress={onPress} />
            <Appbar.Content title="Ajouter une mesure" />
          </Appbar.Header>
          <ScrollView>
            <Surface style={styles.inputSection}>
              <TextInput
                placeholder="Poids"
                value={formik.values.weight}
                onChangeText={(text) => {
                  const number = parseInt(text, 10);
                  formik.setFieldValue("weight", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                }}
                style={styles.input}
              />
              <Divider style={{ marginHorizontal: 8 }} />

              <TextInput
                placeholder="Taille"
                value={formik.values.size}
                onChangeText={(text) => {
                  const number = parseInt(text, 10);
                  formik.setFieldValue("size", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                }}
                style={styles.input}
              />
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
              <Button mode="contained" onPress={onPress}>
                Annuler
              </Button>
            </View>
          </ScrollView>
        </Modal>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
export default WeightModal;
