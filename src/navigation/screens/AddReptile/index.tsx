import {
  Avatar,
  Button,
  Divider,
  SegmentedButtons,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import useAddReptilesMutation from "../Home/hooks/mutations/useAddReptilesMutation";
import { Formik } from "formik";
import useReptilesQuery from "../Home/hooks/queries/useReptilesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
import TextInput from "@shared/components/TextInput";
import * as ImagePicker from "expo-image-picker";
import handleImageUpload from "@shared/utils/handleImageUpload";

const initialValues = {
  name: "",
  species: "",
  age: null,
  last_fed: "",
  snake: "snake",
  sex: "",
  feeding_schedule: "",
  diet: "",
  humidity_level: null,
  temperature_range: "",
  lighting_requirements: "",
  health_status: "",
  acquired_date: "",
  origin: "",
  location: "",
  next_vet_visit: "",
};
const schema = Yup.object().shape({
  name: Yup.string().required(),
  species: Yup.string().required(),
  age: Yup.number().required(),
  last_fed: Yup.string(),
  snake: Yup.string().oneOf(["snake", "lizard"]),
  feeding_schedule: Yup.string(),
  diet: Yup.string(),
  humidity_level: Yup.number(),
  temperature_range: Yup.string(),
  lighting_requirements: Yup.string(),
  health_status: Yup.string(),
  acquired_date: Yup.string(),
  origin: Yup.string(),
  location: Yup.string(),
  sex: Yup.string().oneOf(["male", "female"]),
  next_vet_visit: Yup.string().required(),
});

const AddReptile = () => {
  const { mutate: addReptile, isPending } = useAddReptilesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { goBack } = useNavigation();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [inputDateAcquired, setInputDateAcquired] = useState<Date | undefined>(
    undefined
  );
  const [inputDateNextVet, setInputDateNextVet] = useState<Date | undefined>(
    undefined
  );
  const [imageUri, setImageUri] = useState<string | null>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event: any) => {
          const file = event.target.files[0];
          if (file) {
            setImageUri(URL.createObjectURL(file)); // Prévisualisation
            setImageUrl(file);
          }
        };
        input.click();
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
          setImageUri(result.assets[0].uri); // Prévisualisation
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image.");
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <TouchableRipple
            style={{
              borderRadius: 100,
              overflow: "hidden",
            }}
            onPress={pickImage}
          >
            <Avatar.Image
              size={150}
              source={
                imageUri
                  ? { uri: imageUri }
                  : require("../../../assets/twoReptile/reptile2.png")
              }
            />
          </TouchableRipple>
        </View>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          addReptile(
            {
              input: {
                name: values.name,
                species: values.species,
                age: values.age,
                last_fed: values.last_fed,
                sort_of_species: values.snake,
                sex: values.sex,
                feeding_schedule: values.feeding_schedule,
                diet: values.diet,
                humidity_level: values.humidity_level,
                temperature_range: values.temperature_range,
                lighting_requirements: values.lighting_requirements,
                health_status: values.health_status,
                acquired_date: values.acquired_date,
                origin: values.origin,
                location: values.location,
                next_vet_visit: values.next_vet_visit,
              },
            },
            {
              onSuccess: async (data) => {
                if (imageUrl || imageUri) {
                  if (Platform.OS === "web") {
                    await handleImageUpload(imageUrl, data?.addReptile?.id); // Upload the image to backend
                  }
                  if (Platform.OS !== "web") {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    await handleImageUpload(blob, data?.addReptile?.id); // Envoi au backend
                  }
                }
                queryClient.invalidateQueries({
                  queryKey: useReptilesQuery.queryKey,
                });
                goBack();
                show("Reptile ajouté avec succès !", {
                  label: "Ok",
                });
              },
              onError: (e) => {
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
            <Surface style={styles.inputSection}>
              <TextInput
                placeholder="Nom"
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="Espèce"
                onBlur={formik.handleBlur("species")}
                value={formik.values.species}
                onChangeText={formik.handleChange("species")}
              />
            </Surface>
            <Surface style={styles.inputSection}>
              <TextInput
                placeholder="Origine"
                value={formik.values.origin}
                onChangeText={formik.handleChange("origin")}
                onBlur={formik.handleBlur("origin")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="Emplacement"
                value={formik.values.location}
                onChangeText={formik.handleChange("location")}
                onBlur={formik.handleBlur("location")}
              />
            </Surface>
            <Surface style={[styles.inputSection]}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
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
                <View style={styles.verticleLine} />
                <DatePickerInput
                  mode="outlined"
                  style={styles.pickerInput}
                  dense
                  outlineStyle={styles.outlineStyle}
                  locale="fr"
                  label="Date d'acquisition"
                  saveLabel="Confirmer"
                  withDateFormatInLabel={false}
                  value={inputDateAcquired}
                  onChange={(data) => {
                    setInputDateAcquired(data);
                    formik.setFieldValue("acquired_date", formatYYYYMMDD(data));
                  }}
                  inputMode="start"
                />
              </View>
            </Surface>

            <Surface style={styles.inputSection}>
              <TextInput
                placeholder="Régime alimentaire"
                value={formik.values.diet}
                onChangeText={formik.handleChange("diet")}
                onBlur={formik.handleBlur("diet")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="Fréquence de repas"
                value={formik.values.feeding_schedule}
                onChangeText={formik.handleChange("feeding_schedule")}
                onBlur={formik.handleBlur("feeding_schedule")}
              />

              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="État de santé"
                value={formik.values.health_status}
                onChangeText={formik.handleChange("health_status")}
                onBlur={formik.handleBlur("health_status")}
              />

              <Divider style={{ marginHorizontal: 8 }} />
              <DatePickerInput
                mode="outlined"
                style={styles.pickerInput}
                dense
                outlineStyle={styles.outlineStyle}
                locale="fr"
                label="Prochain rendez-vous chez le vétérinaire"
                saveLabel="Confirmer"
                withDateFormatInLabel={false}
                value={inputDateNextVet}
                onChange={(data) => {
                  setInputDateNextVet(data);
                  formik.setFieldValue("next_vet_visit", formatYYYYMMDD(data));
                }}
                inputMode="start"
              />

              <Divider style={{ marginHorizontal: 8 }} />
              <DatePickerInput
                mode="outlined"
                style={styles.pickerInput}
                dense
                outlineStyle={styles.outlineStyle}
                locale="fr"
                label="Dernier repas"
                saveLabel="Confirmer"
                withDateFormatInLabel={false}
                value={inputDate}
                onChange={(data) => {
                  setInputDate(data);
                  formik.setFieldValue("last_fed", formatYYYYMMDD(data));
                }}
                inputMode="start"
              />
              <Divider style={{ marginHorizontal: 8 }} />
            </Surface>
            <Surface style={styles.inputSection}>
              <TextInput
                placeholder="Niveau d'humidité"
                value={formik.values.humidity_level}
                onChangeText={(text) => {
                  const number = parseInt(text, 10);
                  formik.setFieldValue(
                    "humidity_level",
                    isNaN(number) ? "" : number
                  ); // Ne pas permettre un non-nombre
                }}
                onBlur={formik.handleBlur("humidity_level")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="Plage de température"
                value={formik.values.temperature_range}
                onChangeText={formik.handleChange("temperature_range")}
                onBlur={formik.handleBlur("temperature_range")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                placeholder="Exigences d'éclairage"
                value={formik.values.lighting_requirements}
                onChangeText={formik.handleChange("lighting_requirements")}
                onBlur={formik.handleBlur("lighting_requirements")}
              />
            </Surface>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <SegmentedButtons
                value={formik.values.snake}
                onValueChange={formik.handleChange("snake")}
                style={{ flex: 1 }}
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
              <SegmentedButtons
                style={{ flex: 1 }}
                value={formik.values.sex}
                onValueChange={formik.handleChange("sex")}
                buttons={[
                  {
                    value: "female",
                    label: "Femelle",
                  },
                  {
                    value: "male",
                    label: "Mâle",
                  },
                ]}
              />
            </View>

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
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: { padding: 10 },
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
  formContainer: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputSection: {
    // overflow: "hidden",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  verticleLine: {
    height: "70%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: 1,
    backgroundColor: "rgb(202, 196, 208)",
  },
  input: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});
export default AddReptile;
