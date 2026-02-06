import {
  Avatar,
  Button,
  SegmentedButtons,
  TouchableRipple,
  Text,
  useTheme,
  Icon,
} from "react-native-paper";
import { Formik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
import TextInput from "@shared/components/TextInput";
import * as ImagePicker from "expo-image-picker";
import handleImageUpload from "@shared/utils/handleImageUpload";
import useAddReptilesMutation from "../Reptiles/hooks/mutations/useAddReptilesMutation";
import useReptilesQuery from "../Reptiles/hooks/queries/useReptilesQuery";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";

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
  health_status: "",
  acquired_date: "",
  origin: "",
  location: "",
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
  health_status: Yup.string(),
  acquired_date: Yup.string(),
  origin: Yup.string(),
  location: Yup.string(),
  sex: Yup.string().oneOf(["Mâle", "Femelle"]),
});

const AddReptile = () => {
  const { mutate: addReptile, isPending } = useAddReptilesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { goBack } = useNavigation();
  const { colors } = useTheme();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [inputDateAcquired, setInputDateAcquired] = useState<Date | undefined>(
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
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <CardSurface style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroText}>
              <Text variant="titleLarge">Nouveau reptile</Text>
              <Text variant="bodySmall" style={styles.headerSubtitle}>
                Ajoutez un compagnon et commencez le suivi.
              </Text>
            </View>
            <TouchableRipple style={styles.avatarTouch} onPress={pickImage}>
              <View>
                <Avatar.Image
                  size={120}
                  source={
                    imageUri
                      ? { uri: imageUri }
                      : require("../../../assets/twoReptile/reptile2.png")
                  }
                />
                <View style={styles.avatarBadge}>
                  <Icon source="camera" size={16} color={colors.onPrimary} />
                </View>
              </View>
            </TouchableRipple>
          </View>
          <Text variant="labelSmall" style={styles.avatarHint}>
            Appuyez pour ajouter une photo.
          </Text>
        </CardSurface>

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
                health_status: values.health_status,
                acquired_date: values.acquired_date,
                origin: values.origin,
                location: values.location,
              },
            },
            {
              onSuccess: async (data) => {
                if (imageUrl || imageUri) {
                  if (Platform.OS === "web") {
                    await handleImageUpload(imageUrl, data?.addReptile?.id); // Upload the image to backend
                  }
                  if (Platform.OS !== "web") {
                    await handleImageUpload(
                      { uri: imageUri },
                      data?.addReptile?.id
                    ); // Envoi au backend
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.formContainer}>
              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  Identité
                </Text>
                <TextInput
                  placeholder="Nom"
                  value={formik.values.name}
                  onChangeText={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                />
                <TextInput
                  placeholder="Espèce"
                  onBlur={formik.handleBlur("species")}
                  value={formik.values.species}
                  onChangeText={formik.handleChange("species")}
                />
                <View style={styles.row}>
                  <TextInput
                    placeholder="Âge"
                    value={formik.values.age?.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const number = parseInt(text, 10);
                      formik.setFieldValue("age", isNaN(number) ? "" : number);
                    }}
                    onBlur={formik.handleBlur("age")}
                    inputMode="numeric"
                    style={styles.rowInput}
                  />
                  <SegmentedButtons
                    value={formik.values.snake}
                    onValueChange={formik.handleChange("snake")}
                    style={[styles.rowInput, styles.segmentCompact]}
                    buttons={[
                      { value: "snake", label: "Serpent" },
                      { value: "lizard", label: "Varan" },
                    ]}
                  />
                </View>
                <SegmentedButtons
                  value={formik.values.sex}
                  onValueChange={formik.handleChange("sex")}
                  style={styles.segmentCompact}
                  buttons={[
                    { value: "Femelle", icon: "gender-female" },
                    { value: "Mâle", icon: "gender-male" },
                  ]}
                />
              </CardSurface>
              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  Origine
                </Text>
                <TextInput
                  placeholder="Origine"
                  value={formik.values.origin}
                  onChangeText={formik.handleChange("origin")}
                  onBlur={formik.handleBlur("origin")}
                />
                <TextInput
                  placeholder="Emplacement"
                  value={formik.values.location}
                  onChangeText={formik.handleChange("location")}
                  onBlur={formik.handleBlur("location")}
                />
                <View style={styles.row}>
                  <DatePickerInput
                    placeholderTextColor="gray" // Assurez-vous que la couleur est visible
                    mode="outlined"
                    style={[
                      styles.pickerInput,
                      styles.rowInput,
                      { backgroundColor: colors.surface },
                    ]}
                    dense
                    outlineStyle={[
                      styles.outlineStyle,
                      { borderColor: colors.outlineVariant ?? colors.outline },
                    ]}
                    locale="fr"
                    label="Acquisition"
                    saveLabel="Confirmer"
                    withDateFormatInLabel={false}
                    contentStyle={styles.dateContent}
                    value={inputDateAcquired}
                    onChange={(data) => {
                      setInputDateAcquired(data);
                      formik.setFieldValue(
                        "acquired_date",
                        formatYYYYMMDD(data)
                      );
                    }}
                    inputMode="start"
                  />
                </View>
              </CardSurface>

              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  Alimentation
                </Text>
                <TextInput
                  placeholder="Régime alimentaire"
                  value={formik.values.diet}
                  onChangeText={formik.handleChange("diet")}
                  onBlur={formik.handleBlur("diet")}
                />
                <TextInput
                  placeholder="Fréquence de repas"
                  value={formik.values.feeding_schedule}
                  onChangeText={formik.handleChange("feeding_schedule")}
                  onBlur={formik.handleBlur("feeding_schedule")}
                />
                <TextInput
                  placeholder="État de santé"
                  value={formik.values.health_status}
                  onChangeText={formik.handleChange("health_status")}
                  onBlur={formik.handleBlur("health_status")}
                />
                <DatePickerInput
                  mode="outlined"
                  style={[
                    styles.pickerInput,
                    { backgroundColor: colors.surface },
                  ]}
                  dense
                  outlineStyle={[
                    styles.outlineStyle,
                    { borderColor: colors.outlineVariant ?? colors.outline },
                  ]}
                  locale="fr"
                  label="Dernier repas"
                  saveLabel="Confirmer"
                  withDateFormatInLabel={false}
                  contentStyle={styles.dateContent}
                  value={inputDate}
                  onChange={(data) => {
                    setInputDate(data);
                    formik.setFieldValue("last_fed", formatYYYYMMDD(data));
                  }}
                  inputMode="start"
                />
              </CardSurface>
              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  Santé & environnement
                </Text>
                <TextInput
                  placeholder="Niveau d'humidité"
                  value={formik.values.humidity_level?.toString() ?? ""}
                  onChangeText={(text) => {
                    const number = parseInt(text, 10);
                    formik.setFieldValue(
                      "humidity_level",
                      isNaN(number) ? "" : number
                    ); // Ne pas permettre un non-nombre
                  }}
                  onBlur={formik.handleBlur("humidity_level")}
                />
                <TextInput
                  placeholder="Plage de température"
                  value={formik.values.temperature_range}
                  onChangeText={formik.handleChange("temperature_range")}
                  onBlur={formik.handleBlur("temperature_range")}
                />
                <TextInput
                  placeholder="État de santé"
                  value={formik.values.health_status}
                  onChangeText={formik.handleChange("health_status")}
                  onBlur={formik.handleBlur("health_status")}
                />
              </CardSurface>

              <Button
                icon={"plus"}
                loading={isPending}
                disabled={!formik.isValid}
                onPress={formik.submitForm}
                mode="contained"
                style={styles.submitButton}
              >
                AJOUTER
              </Button>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </ScrollView>
    </Screen>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  heroCard: {
    marginTop: 4,
    gap: 12,
  },
  heroHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  heroText: {
    flex: 1,
  },
  avatarTouch: { borderRadius: 16, overflow: "hidden" },
  avatarBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A5D52",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: {
    opacity: 0.6,
  },
  outlineStyle: {
    borderWidth: 1,
    borderRadius: 12,
  },
  dateContent: {
    fontSize: 13,
    paddingVertical: 6,
  },
  pickerInput: {
    position: "relative",
  },
  formContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionCard: {
    gap: 12,
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
  segmentCompact: {
    alignSelf: "stretch",
  },
  sectionTitle: {
    opacity: 0.7,
  },
  submitButton: {
    marginTop: 8,
  },
});
export default AddReptile;
