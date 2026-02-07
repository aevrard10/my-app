import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { Formik } from "formik";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import TextInput from "@shared/components/TextInput";
import TimePicker from "@shared/components/TimePicker";
import { formatTime, formatYYYYMMDD } from "@shared/utils/formatedDate";
import { useI18n } from "@shared/i18n";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import useAddReptileHealthEventMutation from "../ReptileProfileDetails/hooks/data/mutations/useAddReptileHealthEventMutation";
import { useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import useReptileQuery from "../Reptiles/hooks/queries/useReptileQuery";

type Props = StaticScreenProps<{
  id: string;
}>;

const initialValues = {
  event_date: formatYYYYMMDD(new Date()),
  event_time: "",
  event_type: "OTHER",
  event_type_custom: "",
  notes: "",
};

const AddHealthStatus = ({ route }: Props) => {
  const { id } = route.params;
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: reptile } = useReptileQuery(id);
  const { mutate, isPending } = useAddReptileHealthEventMutation();
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showType, setShowType] = useState(false);

  const typeOptions = useMemo(
    () => [
      { value: "ACARIEN", label: t("health.type_acarien"), icon: "bug" },
      {
        value: "REGURGITATION",
        label: t("health.type_regurgitation"),
        icon: "sync-alert",
      },
      { value: "REFUS", label: t("health.type_refus"), icon: "close-octagon" },
      {
        value: "UNDERWEIGHT",
        label: t("health.type_underweight"),
        icon: "scale-balance",
      },
      { value: "OBESITY", label: t("health.type_obesity"), icon: "scale" },
      {
        value: "SHED_ISSUE",
        label: t("health.type_shed_issue"),
        icon: "alert",
      },
      {
        value: "DIGESTIVE",
        label: t("health.type_digestive"),
        icon: "stomach",
      },
      {
        value: "HIBERNATION",
        label: t("health.type_hibernation"),
        icon: "snowflake",
      },
      {
        value: "MEDICATION",
        label: t("health.type_medication"),
        icon: "pill",
      },
      {
        value: "OVULATION",
        label: t("health.type_ovulation"),
        icon: "egg",
      },
      { value: "INJURY", label: t("health.type_injury"), icon: "bandage" },
      { value: "ABSCESS", label: t("health.type_abscess"), icon: "alert-circle" },
      { value: "OTHER", label: t("health.type_other"), icon: "dots-horizontal" },
    ],
    [t],
  );

  const selectedTypeLabel = (value?: string | null) => {
    const hit = typeOptions.find((opt) => opt.value === value);
    return hit ? hit.label : t("health.type_other");
  };

  return (
    <Screen>
      <CardSurface style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text variant="titleLarge">{t("health.add_title")}</Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {reptile?.name
                ? t("health.add_subtitle_named", { name: reptile.name })
                : t("health.add_subtitle")}
            </Text>
          </View>
        </View>
      </CardSurface>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          if (!values.event_date) {
            return;
          }
          const customType = values.event_type_custom?.trim();
          const finalType =
            values.event_type === "OTHER" && customType
              ? customType
              : values.event_type;
          mutate(
            {
              reptile_id: id,
              event_date: values.event_date,
              event_time: values.event_time,
              event_type: finalType,
              notes: values.notes,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [QueriesKeys.REPTILE_HEALTH, id],
                });
                resetForm();
                setInputDate(new Date());
                navigation.goBack();
              },
            },
          );
        }}
      >
        {(formik) => (
          <ScrollView contentContainerStyle={styles.content}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  {t("health.section_details")}
                </Text>
                <DatePickerInput
                  locale={locale}
                  label={t("health.date")}
                  value={inputDate}
                  onChange={(date) => {
                    setInputDate(date ?? undefined);
                    formik.setFieldValue(
                      "event_date",
                      date ? formatYYYYMMDD(date) : "",
                    );
                  }}
                  inputMode="start"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={{ flex: 1 }}
                >
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={formik.values.event_time}
                    placeholder={t("health.time")}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                <TimePicker
                  visible={showPicker}
                  onDismiss={() => setShowPicker(false)}
                  onConfirm={(hours, minutes) => {
                    const time = formatTime(hours, minutes);
                    formik.setFieldValue("event_time", time);
                    setShowPicker(false);
                  }}
                />
              </CardSurface>

              <CardSurface style={styles.sectionCard}>
                <List.Accordion
                  title={t("health.type")}
                  description={selectedTypeLabel(formik.values.event_type)}
                  expanded={showType}
                  onPress={() => setShowType((prev) => !prev)}
                  left={(props) => <List.Icon {...props} icon="heart-pulse" />}
                >
                  <View style={styles.typeGrid}>
                    {typeOptions.map((option) => {
                      const selected =
                        formik.values.event_type === option.value;
                      return (
                        <Button
                          key={option.value}
                          mode={selected ? "contained" : "outlined"}
                          icon={option.icon}
                          onPress={() => {
                            formik.setFieldValue("event_type", option.value);
                            if (option.value !== "OTHER") {
                              formik.setFieldValue("event_type_custom", "");
                            }
                          }}
                          style={styles.typeButton}
                          contentStyle={styles.typeButtonContent}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </View>
                  {formik.values.event_type === "OTHER" ? (
                    <View style={styles.customTypeWrap}>
                      <TextInput
                        placeholder={t("health.type_custom_placeholder")}
                        value={formik.values.event_type_custom}
                        onChangeText={(text) =>
                          formik.setFieldValue("event_type_custom", text)
                        }
                        style={styles.input}
                      />
                      <Text variant="labelSmall" style={styles.helperText}>
                        {t("health.type_custom_label")}
                      </Text>
                    </View>
                  ) : null}
                </List.Accordion>
              </CardSurface>

              <CardSurface style={styles.sectionCard}>
                <Text variant="labelLarge" style={styles.sectionTitle}>
                  {t("health.description")}
                </Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={t("health.description_placeholder")}
                  value={formik.values.notes}
                  onChangeText={(text) => formik.setFieldValue("notes", text)}
                  style={[styles.input, styles.textarea]}
                />
              </CardSurface>

              <Button
                mode="contained"
                loading={isPending}
                onPress={() => formik.handleSubmit()}
                style={styles.submit}
              >
                {t("common.save")}
              </Button>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Formik>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    marginTop: 4,
    marginBottom: 12,
    gap: 8,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroText: {
    flex: 1,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  content: {
    paddingBottom: 120,
  },
  sectionCard: {
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    opacity: 0.7,
  },
  input: {
    marginTop: 6,
  },
  textarea: {
    minHeight: 120,
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
  typeButtonContent: {
    paddingHorizontal: 8,
  },
  customTypeWrap: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  helperText: {
    opacity: 0.6,
    marginTop: 6,
  },
  submit: {
    marginTop: 6,
  },
});

export default AddHealthStatus;
// TODO: type d'évenement sous forme de picker avec des icones, et possibilité d'ajouter un type personnalisé (avec un champ de texte qui s'affiche si on choisit "autre")
