import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Modal,
  Portal,
  useTheme,
  Text,
  SegmentedButtons,
  List,
  Avatar,
} from "react-native-paper";
import { Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import { formatTime, formatYYYYMMDD } from "@shared/utils/formatedDate";
import TimePicker from "@shared/components/TimePicker";
import useAddReptileEventMutation from "../Agenda/hooks/mutations/useAddReptileEventMutation";
import { useSnackbar } from "@rn-flix/snackbar";
import { useQueryClient } from "@tanstack/react-query";
import TextInput from "@shared/components/TextInput";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import useReptilesQuery from "../Reptiles/hooks/queries/useReptilesQuery";
import useReptileEventsQuery from "../Agenda/hooks/queries/useReptileEventsQuery";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useI18n } from "@shared/i18n";
import { useNavigation } from "@react-navigation/native";
const NOTIF_KEY = "reptitrack_event_notifs"; // map eventId -> notificationId

const initialValues = {
  event_name: "",
  event_date: formatYYYYMMDD(new Date()),
  event_time: "",
  notes: "",
  event_type: "OTHER",
  recurrence_type: "NONE",
  recurrence_interval: 1,
  recurrence_until: "",
  reptile_id: "",
  reptile_name: "",
  reptile_image_url: "",
  reminder_minutes: 0,
  priority: "NORMAL",
};

const AddEvent = () => {
  const navigation = useNavigation();
  const { data: reptiles } = useReptilesQuery();
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const { show } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useAddReptileEventMutation();
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [inputRecurrenceUntil, setInputRecurrenceUntil] = useState<
    Date | undefined
  >(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [showSelectReptile, setShowSelectReptile] = useState(false);
  const [showSelectType, setShowSelectType] = useState(false);
  const [notifMap, setNotifMap] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(NOTIF_KEY);
      if (raw) {
        try {
          setNotifMap(JSON.parse(raw));
        } catch {
          setNotifMap({});
        }
      }
    })();
  }, []);

  const saveNotifMap = async (map: Record<string, string>) => {
    setNotifMap(map);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(map));
  };

  const cancelNotification = async (eventId: string) => {
    if (Platform.OS === "web") return;
    const notifId = notifMap[eventId];
    if (notifId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notifId);
      } catch {}
      const next = { ...notifMap };
      delete next[eventId];
      await saveNotifMap(next);
    }
  };

  const getEventTypeLabel = (value?: string | null) => {
    const normalized = (value || "OTHER").toUpperCase();
    if (normalized === "FEEDING") return t("agenda.type_feeding");
    if (normalized === "CLEANING") return t("agenda.type_cleaning");
    if (normalized === "MISTING") return t("agenda.type_misting");
    if (normalized === "VET") return t("agenda.type_vet");
    return t("agenda.type_other");
  };

  const scheduleNotification = async (eventId: string, values: any) => {
    if (Platform.OS === "web") return;
    await cancelNotification(eventId);
    const perms = await Notifications.getPermissionsAsync();
    if (!perms.granted) {
      await Notifications.requestPermissionsAsync();
    }
    const date = values.event_date || dayjs().format("YYYY-MM-DD");
    const time = values.event_time || "09:00";
    const [h, m] = time.split(":");
    let triggerDate = dayjs(date)
      .hour(Number(h) || 9)
      .minute(Number(m) || 0)
      .second(0);
    const reminderMinutes = Number(values.reminder_minutes ?? 0);
    if (Number.isFinite(reminderMinutes) && reminderMinutes > 0) {
      triggerDate = triggerDate.subtract(reminderMinutes, "minute");
    }
    if (!triggerDate.isValid()) return;
    if (triggerDate.isBefore(dayjs())) return;
    const notifId = await Notifications.scheduleNotificationAsync({
      content: {
        title:
          values.event_name ||
          getEventTypeLabel(values.event_type) ||
          t("agenda.notification_title"),
        body: values.reptile_name
          ? `${values.reptile_name} • ${values.notes || t("agenda.notification_event")}`
          : values.notes || t("agenda.notification_event"),
      },
      trigger: triggerDate.toDate(),
    });
    const next = { ...notifMap, [eventId]: notifId };
    await saveNotifMap(next);
  };

  const eventTypeOptions = [
    { value: "FEEDING", label: t("agenda.type_feeding") },
    { value: "CLEANING", label: t("agenda.type_cleaning") },
    { value: "MISTING", label: t("agenda.type_misting") },
    { value: "VET", label: t("agenda.type_vet") },
    { value: "OTHER", label: t("agenda.type_other") },
  ];
  const reminderOptions = [
    { value: 0, label: t("agenda.reminder_at_time") },
    { value: 10, label: t("agenda.reminder_10m") },
    { value: 60, label: t("agenda.reminder_1h") },
    { value: 1440, label: t("agenda.reminder_1d") },
  ];
  const priorityOptions = [
    { value: "LOW", label: t("agenda.priority_low") },
    { value: "NORMAL", label: t("agenda.priority_normal") },
    { value: "HIGH", label: t("agenda.priority_high") },
  ];

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge">{t("agenda.new_event_title")}</Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          {t("agenda.subtitle")}
        </Text>
      </View>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          if (!values.event_date) {
            show(t("agenda.date_required"), { label: t("common.ok") });
            return;
          }
          const finalName =
            values.event_name?.trim() || getEventTypeLabel(values.event_type);

          mutate(
            {
              input: {
                event_name: finalName,
                event_type: values.event_type,
                event_date: values.event_date,
                event_time: values.event_time,
                notes: values.notes,
                recurrence_type: values.recurrence_type,
                recurrence_interval: values.recurrence_interval,
                recurrence_until: values.recurrence_until || null,
                reptile_id: values.reptile_id || null,
                reptile_name: values.reptile_name || null,
                reptile_image_url: values.reptile_image_url || null,
                reminder_minutes: values.reminder_minutes ?? 0,
                priority: values.priority ?? "NORMAL",
              },
            },
            {
              onSuccess: (created) => {
                scheduleNotification(created?.id ?? finalName, {
                  ...values,
                  event_name: finalName,
                });
                resetForm();
                setInputDate(new Date());
                setInputRecurrenceUntil(undefined);

                queryClient.invalidateQueries({
                  queryKey: useReptileEventsQuery.queryKey,
                });
                queryClient.invalidateQueries({
                  queryKey: useDashboardSummaryQuery.queryKey,
                });
                show(t("agenda.add_success"), { label: t("common.ok") });
                navigation.goBack();
              },
              onError: () => {
                show(t("agenda.add_error"), { label: t("common.ok") });
              },
            },
          );
        }}
      >
        {(formik) => (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <CardSurface
                  style={[styles.sectionCard, styles.inputSection, { gap: 4 }]}
                >
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.title_placeholder")}
                  </Text>
                  <TextInput
                    placeholder={t("agenda.title_placeholder")}
                    value={formik.values.event_name}
                    onChangeText={formik.handleChange("event_name")}
                  />
                  <Divider style={{ marginHorizontal: 8 }} />
                  <TouchableOpacity onPress={() => setShowSelectReptile(true)}>
                    <TextInput
                      placeholder={t("agenda.reptile_optional")}
                      value={formik.values.reptile_name}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </CardSurface>
                <Portal>
                  <Modal
                    visible={showSelectReptile}
                    onDismiss={() => setShowSelectReptile(false)}
                    contentContainerStyle={{
                      backgroundColor: colors.surface,
                      marginHorizontal: 20,
                      padding: 12,
                      borderRadius: 18,
                    }}
                  >
                    <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                      {t("agenda.choose_reptile")}
                    </Text>
                    <ScrollView style={{ maxHeight: 320 }}>
                      {reptiles?.map((rep) => (
                        <List.Item
                          key={rep.id}
                          title={rep.name}
                          description={rep.species}
                          left={() =>
                            rep.image_url ? (
                              <Avatar.Image
                                size={42}
                                source={{ uri: rep.image_url }}
                              />
                            ) : (
                              <Avatar.Icon size={42} icon="turtle" />
                            )
                          }
                          onPress={() => {
                            formik.setFieldValue("reptile_id", rep.id);
                            formik.setFieldValue("reptile_name", rep.name);
                            formik.setFieldValue(
                              "reptile_image_url",
                              rep.image_url || "",
                            );
                            setShowSelectReptile(false);
                          }}
                        />
                      ))}
                    </ScrollView>
                    <Button
                      onPress={() => {
                        setShowSelectReptile(false);
                        formik.setFieldValue("reptile_id", "");
                        formik.setFieldValue("reptile_name", "");
                        formik.setFieldValue("reptile_image_url", "");
                      }}
                    >
                      {t("agenda.no_reptile")}
                    </Button>
                  </Modal>
                </Portal>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.event_type")}
                  </Text>
                  <TouchableOpacity onPress={() => setShowSelectType(true)}>
                    <TextInput
                      placeholder={t("agenda.event_type_placeholder")}
                      value={getEventTypeLabel(formik.values.event_type)}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </CardSurface>
                <Portal>
                  <Modal
                    visible={showSelectType}
                    onDismiss={() => setShowSelectType(false)}
                    contentContainerStyle={{
                      backgroundColor: colors.surface,
                      marginHorizontal: 20,
                      padding: 12,
                      borderRadius: 18,
                    }}
                  >
                    <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                      {t("agenda.choose_type")}
                    </Text>
                    {eventTypeOptions.map((option) => (
                      <List.Item
                        key={option.value}
                        title={option.label}
                        onPress={() => {
                          formik.setFieldValue("event_type", option.value);
                          setShowSelectType(false);
                        }}
                      />
                    ))}
                  </Modal>
                </Portal>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {`${t("agenda.time")} / ${t("agenda.date")}`}
                  </Text>
                  <View style={styles.rowSplit}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => setShowPicker(true)}
                    >
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={formik.values.event_time}
                        placeholder={t("agenda.time")}
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                    <DatePickerInput
                      mode="outlined"
                      locale={locale}
                      label={t("agenda.date")}
                      saveLabel={t("common.confirm")}
                      outlineStyle={{ borderWidth: 0 }}
                      style={styles.dateInput}
                      value={inputDate}
                      onChange={(data) => {
                        setInputDate(data);
                        formik.setFieldValue(
                          "event_date",
                          formatYYYYMMDD(data),
                        );
                      }}
                      dense
                      inputMode="start"
                    />
                  </View>
                </CardSurface>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.notes")}
                  </Text>
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder={t("agenda.notes")}
                    onChangeText={formik.handleChange("notes")}
                    onBlur={formik.handleBlur("notes")}
                  />
                </CardSurface>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.recurrence")}
                  </Text>
                  <SegmentedButtons
                    value={formik.values.recurrence_type}
                    onValueChange={(value) => {
                      formik.setFieldValue("recurrence_type", value);
                      if (value === "NONE") {
                        setInputRecurrenceUntil(undefined);
                        formik.setFieldValue("recurrence_until", "");
                      }
                    }}
                    buttons={[
                      { value: "NONE", label: t("agenda.recurrence_none") },
                      { value: "DAILY", label: t("agenda.recurrence_daily") },
                      { value: "WEEKLY", label: t("agenda.recurrence_weekly") },
                      {
                        value: "MONTHLY",
                        label: t("agenda.recurrence_monthly"),
                      },
                    ]}
                    style={{ marginTop: 8 }}
                  />
                  {formik.values.recurrence_type !== "NONE" ? (
                    <DatePickerInput
                      mode="outlined"
                      locale={locale}
                      label={t("agenda.recurrence_until")}
                      saveLabel={t("common.confirm")}
                      outlineStyle={{ borderWidth: 0 }}
                      style={styles.recurrenceInput}
                      value={inputRecurrenceUntil}
                      onChange={(date) => {
                        setInputRecurrenceUntil(date);
                        formik.setFieldValue(
                          "recurrence_until",
                          date ? formatYYYYMMDD(date) : "",
                        );
                      }}
                      clearButtonLabel={t("common.clear")}
                      withDateFormatInLabel={false}
                      inputMode="start"
                      dense
                    />
                  ) : null}
                </CardSurface>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.reminder")}
                  </Text>
                  <SegmentedButtons
                    value={String(formik.values.reminder_minutes ?? 0)}
                    onValueChange={(value) =>
                      formik.setFieldValue("reminder_minutes", Number(value))
                    }
                    buttons={reminderOptions.map((option) => ({
                      value: String(option.value),
                      label: option.label,
                    }))}
                    style={{ marginTop: 8 }}
                  />
                </CardSurface>
                <CardSurface style={[styles.sectionCard, styles.inputSection]}>
                  <Text variant="labelLarge" style={styles.sectionTitle}>
                    {t("agenda.priority")}
                  </Text>
                  <SegmentedButtons
                    value={formik.values.priority ?? "NORMAL"}
                    onValueChange={(value) =>
                      formik.setFieldValue("priority", value)
                    }
                    buttons={priorityOptions.map((option) => ({
                      value: option.value,
                      label: option.label,
                    }))}
                    style={{ marginTop: 8 }}
                  />
                </CardSurface>
                <Button
                  loading={isPending}
                  disabled={!formik.isValid}
                  icon={"plus"}
                  onPress={formik.submitForm}
                  mode="contained"
                  style={styles.primaryButton}
                >
                  {t("agenda.add_event")}
                </Button>
                <TimePicker
                  showPicker={showPicker}
                  setShowPicker={setShowPicker}
                  onConfirm={(pickedDuration) => {
                    formik.setFieldValue(
                      "event_time",
                      formatTime(pickedDuration),
                    );
                    setShowPicker(false);
                  }}
                />
              </KeyboardAvoidingView>
            </ScrollView>
          </>
        )}
      </Formik>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 4,
    marginBottom: 12,
    gap: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  content: {
    paddingBottom: 24,
  },
  sectionCard: {
    padding: 14,
  },
  sectionTitle: {
    opacity: 0.7,
    marginBottom: 6,
  },
  inputSection: {
    marginVertical: 8,
  },
  input: {
    padding: 10,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  rowSplit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateInput: {
    borderWidth: 0,
    borderColor: "#fff",
    backgroundColor: "#fff",
    flex: 1,
  },
  recurrenceInput: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  primaryButton: {
    marginTop: 8,
  },
});

export default AddEvent;
