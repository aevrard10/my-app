import {
  Avatar,
  Button,
  SegmentedButtons,
  TouchableRipple,
  Text,
  useTheme,
  Icon,
  List,
  Dialog,
  Portal,
  RadioButton,
  Searchbar,
  Divider,
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
import React, { useMemo, useState } from "react";
import { DatePickerInput } from "react-native-paper-dates";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
import TextInput from "@shared/components/TextInput";
import * as ImagePicker from "expo-image-picker";
import useAddReptilesMutation from "../Reptiles/hooks/mutations/useAddReptilesMutation";
import useReptilesQuery from "../Reptiles/hooks/queries/useReptilesQuery";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
import { useI18n } from "@shared/i18n";
import { FOOD_ITEMS, getFoodLabel } from "@shared/constants/foodCatalog";
import useSearchFilter from "@shared/hooks/useSearchFilter";

const initialValues = {
  name: "",
  species: "",
  birth_date: "",
  last_fed: "",
  snake: "snake",
  sex: "",
  diet: "",
  humidity_level: null,
  temperature_range: "",
  danger_level: "",
  acquired_date: "",
  origin: "",
  location: "",
};
const schema = Yup.object().shape({
  name: Yup.string().required(),
  species: Yup.string().required(),
  birth_date: Yup.string(),
  last_fed: Yup.string(),
  snake: Yup.string().oneOf([
    "snake",
    "lizard",
    "gecko",
    "turtle",
    "amphibian",
    "monitor",
    "crocodilian",
    "other",
  ]),
  diet: Yup.string(),
  humidity_level: Yup.number(),
  temperature_range: Yup.string(),
  danger_level: Yup.string(),
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
  const { t, locale } = useI18n();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [inputDateAcquired, setInputDateAcquired] = useState<Date | undefined>(
    undefined,
  );
  const [inputDateBirth, setInputDateBirth] = useState<Date | undefined>(
    undefined,
  );
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [dietDialogOpen, setDietDialogOpen] = useState(false);
  const [dietSearch, setDietSearch] = useState("");
  const [filteredDietOptions] = useSearchFilter(
    FOOD_ITEMS,
    dietSearch,
    undefined,
    [(item) => t(item.labelKey)],
    1,
  );

  const reptileTypeOptions = useMemo(
    () => [
      { value: "snake", label: t("add_reptile.snake") },
      { value: "lizard", label: t("add_reptile.lizard") },
      { value: "gecko", label: t("add_reptile.gecko") },
      { value: "monitor", label: t("add_reptile.monitor") },
      { value: "crocodilian", label: t("add_reptile.crocodilian") },
      { value: "turtle", label: t("add_reptile.turtle") },
      { value: "amphibian", label: t("add_reptile.amphibian") },
      { value: "other", label: t("add_reptile.other") },
    ],
    [t],
  );

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
      Alert.alert(t("common.error"), t("add_reptile.image_error"));
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
              <Text variant="titleLarge">{t("add_reptile.title")}</Text>
              <Text variant="bodySmall" style={styles.headerSubtitle}>
                {t("add_reptile.subtitle")}
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
            {t("add_reptile.photo_hint")}
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
                  birth_date: values.birth_date,
                  last_fed: values.last_fed,
                  sort_of_species: values.snake,
                  sex: values.sex,
                  diet: values.diet,
                  humidity_level: values.humidity_level,
                  temperature_range: values.temperature_range,
                  danger_level: values.danger_level,
                  acquired_date: values.acquired_date,
                  origin: values.origin,
                  location: values.location,
                  image_url: imageUri ?? null,
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: useReptilesQuery.queryKey,
                  });
                  queryClient.invalidateQueries({
                    queryKey: useDashboardSummaryQuery.queryKey,
                  });
                  goBack();
                  show(t("add_reptile.success"), {
                    label: t("common.ok"),
                  });
                },
                onError: () => {
                  show(t("add_reptile.error"), {
                    label: t("common.ok"),
                  });
                },
              },
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
                    {t("add_reptile.section.identity")}
                  </Text>
                  <TextInput
                    placeholder={t("add_reptile.name")}
                    value={formik.values.name}
                    onChangeText={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                  />
                  <TextInput
                    placeholder={t("add_reptile.species")}
                    onBlur={formik.handleBlur("species")}
                    value={formik.values.species}
                    onChangeText={formik.handleChange("species")}
                  />
                  <View style={styles.row}>
                    <DatePickerInput
                      mode="outlined"
                      style={[
                        styles.pickerInput,
                        styles.rowInput,
                        { backgroundColor: colors.surface },
                      ]}
                      dense
                      outlineStyle={[
                        styles.outlineStyle,
                        {
                          borderColor: colors.outlineVariant ?? colors.outline,
                        },
                      ]}
                      locale={locale}
                      label={t("add_reptile.age")}
                      saveLabel={t("common.confirm")}
                      withDateFormatInLabel={false}
                      contentStyle={styles.dateContent}
                      value={inputDateBirth}
                      onChange={(data) => {
                        setInputDateBirth(data);
                        formik.setFieldValue(
                          "birth_date",
                          data ? formatYYYYMMDD(data) : "",
                        );
                      }}
                      inputMode="start"
                    />
                  </View>
                  <List.Accordion
                    title={t("add_reptile.type")}
                    description={
                      reptileTypeOptions.find(
                        (opt) => opt.value === formik.values.snake,
                      )?.label
                    }
                    expanded={showTypePicker}
                    onPress={() => setShowTypePicker((prev) => !prev)}
                    left={(props) => <List.Icon {...props} icon="paw" />}
                  >
                    <View style={styles.typeGrid}>
                      {reptileTypeOptions.map((option) => {
                        const selected = formik.values.snake === option.value;
                        return (
                          <Button
                            key={option.value}
                            mode={selected ? "contained" : "outlined"}
                            onPress={() =>
                              formik.setFieldValue("snake", option.value)
                            }
                            style={styles.typeButton}
                          >
                            {option.label}
                          </Button>
                        );
                      })}
                    </View>
                  </List.Accordion>
                  <SegmentedButtons
                    value={formik.values.sex}
                    onValueChange={formik.handleChange("sex")}
                    style={styles.segmentCompact}
                    buttons={[
                      {
                        value: "Femelle",
                        icon: "gender-female",
                        label: t("add_reptile.female"),
                      },
                      {
                        value: "Mâle",
                        icon: "gender-male",
                        label: t("add_reptile.male"),
                      },
                    ]}
                  />
                </CardSurface>
                <CardSurface style={styles.sectionCard}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("add_reptile.section.origin")}
                  </Text>
                  <TextInput
                    placeholder={t("add_reptile.origin")}
                    value={formik.values.origin}
                    onChangeText={formik.handleChange("origin")}
                    onBlur={formik.handleBlur("origin")}
                  />
                  <TextInput
                    placeholder={t("add_reptile.location")}
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
                        {
                          borderColor: colors.outlineVariant ?? colors.outline,
                        },
                      ]}
                      locale={locale}
                      label={t("add_reptile.acquired_date")}
                      saveLabel={t("common.confirm")}
                      withDateFormatInLabel={false}
                      contentStyle={styles.dateContent}
                      value={inputDateAcquired}
                      onChange={(data) => {
                        setInputDateAcquired(data);
                        formik.setFieldValue(
                          "acquired_date",
                          formatYYYYMMDD(data),
                        );
                      }}
                      inputMode="start"
                    />
                  </View>
                </CardSurface>

                <CardSurface style={styles.sectionCard}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("add_reptile.section.feeding")}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setDietDialogOpen(true)}
                  >
                    {formik.values.diet
                      ? getFoodLabel(formik.values.diet, t)
                      : t("add_feed.select_food")}
                  </Button>
                  <Portal>
                    <Dialog
                      visible={dietDialogOpen}
                      onDismiss={() => setDietDialogOpen(false)}
                      style={styles.dialog}
                    >
                      <Dialog.Title>{t("add_feed.choose_food")}</Dialog.Title>
                      <Dialog.Content>
                        <Searchbar
                          elevation={0}
                          mode="bar"
                          value={dietSearch}
                          onChangeText={setDietSearch}
                          placeholder={t("add_feed.search_food")}
                          clearButtonMode="always"
                          style={styles.searchbar}
                          inputStyle={styles.searchInput}
                        />
                        <ScrollView style={{ maxHeight: 300 }}>
                          <RadioButton.Group
                            onValueChange={(value) => {
                              formik.setFieldValue("diet", value);
                              setDietDialogOpen(false);
                            }}
                            value={formik.values.diet}
                          >
                            {filteredDietOptions.length > 0 ? (
                              filteredDietOptions.map((item) => (
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
                    locale={locale}
                    label={t("add_reptile.last_fed")}
                    saveLabel={t("common.confirm")}
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
                    {t("add_reptile.section.health_env")}
                  </Text>
                  <TextInput
                    placeholder={t("add_reptile.humidity")}
                    value={formik.values.humidity_level?.toString() ?? ""}
                    onChangeText={(text) => {
                      const number = parseFloat(text);
                      formik.setFieldValue(
                        "humidity_level",
                        isNaN(number) ? "" : number,
                      ); // Ne pas permettre un non-nombre
                    }}
                    onBlur={formik.handleBlur("humidity_level")}
                    keyboardType="numeric"
                    inputMode="numeric"
                  />
                  <TextInput
                    placeholder={t("add_reptile.temperature")}
                    value={formik.values.temperature_range}
                    onChangeText={formik.handleChange("temperature_range")}
                    onBlur={formik.handleBlur("temperature_range")}
                    keyboardType="numeric"
                    inputMode="numeric"
                  />
                  <TextInput
                    placeholder={t("add_reptile.danger_level")}
                    value={formik.values.danger_level}
                    onChangeText={formik.handleChange("danger_level")}
                    onBlur={formik.handleBlur("danger_level")}
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
                  {t("add_reptile.submit").toUpperCase()}
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
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  typeButton: {
    borderRadius: 14,
  },
  sectionTitle: {
    opacity: 0.7,
  },
  submitButton: {
    marginTop: 8,
  },
  dialog: {
    borderRadius: 20,
  },
  searchbar: {
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  searchInput: {
    fontSize: 14,
  },
  emptyText: {
    opacity: 0.6,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
});
export default AddReptile;
// TODO: refactor this screen, it's getting too big. Maybe split into multiple smaller components?
// Note: the image picking logic is currently in this screen, but it could be abstracted into a separate component for better reusability and separation of concerns.
