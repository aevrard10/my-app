import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  Button,
  Divider,
  FAB,
  Modal,
  Portal,
  useTheme,
  Text,
  SegmentedButtons,
  List,
  Avatar,
} from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";
import { Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import { formatTime, formatYYYYMMDD } from "@shared/utils/formatedDate";
import TimePicker from "@shared/components/TimePicker";
import useAddReptileEventMutation from "./hooks/mutations/useAddReptileEventMutation";
import useDeleteReptileEventMutation from "./hooks/mutations/useDeleteReptileEventMutation";
import useExcludeReptileEventOccurrenceMutation from "./hooks/mutations/useExcludeReptileEventOccurrenceMutation";
import useUpdateReptileEventMutation from "./hooks/mutations/useUpdateReptileEventMutation";
import { useSnackbar } from "@rn-flix/snackbar";
import { useQueryClient } from "@tanstack/react-query";
import TextInput from "@shared/components/TextInput";
import AgendaItem from "./components/AgendaItem";
import TextInfo from "../ReptileProfileDetails/components/TextInfo";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useNavigation, useRoute } from "@react-navigation/native";
import AgendaSkeleton from "./components/AgendaSkeleton";
import useReptilesQuery from "../Reptiles/hooks/queries/useReptilesQuery";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
const NOTIF_KEY = "reptitrack_event_notifs"; // map eventId -> notificationId

const initialValues = {
  event_name: "",
  event_date: formatYYYYMMDD(new Date()),
  event_time: "",
  notes: "",
  recurrence_type: "NONE",
  recurrence_interval: 1,
  recurrence_until: "",
  reptile_id: "",
  reptile_name: "",
  reptile_image_url: "",
};
const Agenda = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { data, isPending: isLoading, refetch } = useReptileEventsQuery();
  const { data: reptiles } = useReptilesQuery();
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [inputRecurrenceUntil, setInputRecurrenceUntil] = useState<
    Date | undefined
  >(undefined);
  const [showSelectReptile, setShowSelectReptile] = useState(false);
  const [showSelectReptileEdit, setShowSelectReptileEdit] = useState(false);
  const [selectedReptile, setSelectedReptile] = useState<any>(null);
  const [selectedReptileEdit, setSelectedReptileEdit] = useState<any>(null);
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

  const scheduleNotification = async (eventId: string, values: any) => {
    if (Platform.OS === "web") return;
    const perms = await Notifications.getPermissionsAsync();
    if (!perms.granted) {
      await Notifications.requestPermissionsAsync();
    }
    const date = values.event_date || dayjs().format("YYYY-MM-DD");
    const time = values.event_time || "09:00";
    const [h, m] = time.split(":");
    const triggerDate = dayjs(date)
      .hour(Number(h) || 9)
      .minute(Number(m) || 0)
      .second(0);
    if (!triggerDate.isValid()) return;
    if (triggerDate.isBefore(dayjs())) return; // ne planifie pas dans le passé
    const notifId = await Notifications.scheduleNotificationAsync({
      content: {
        title: values.event_name || "Rappel",
        body: values.reptile_name
          ? `${values.reptile_name} • ${values.notes || "Événement"}`
          : values.notes || "Événement",
      },
      trigger: triggerDate.toDate(),
    });
    const next = { ...notifMap, [eventId]: notifId };
    await saveNotifMap(next);
  };
  const onPickReptile = (reptile: any, formik: any) => {
    formik.setFieldValue("reptile_id", reptile.id);
    formik.setFieldValue("reptile_name", reptile.name);
    formik.setFieldValue("reptile_image_url", reptile.image_url || "");
    setShowSelectReptile(false);
    setSelectedReptile(reptile);
  };

  const onPickReptileEdit = (reptile: any, formik: any) => {
    formik.setFieldValue("reptile_id", reptile.id);
    formik.setFieldValue("reptile_name", reptile.name);
    formik.setFieldValue("reptile_image_url", reptile.image_url || "");
    setShowSelectReptileEdit(false);
    setSelectedReptileEdit(reptile);
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
  const { colors } = useTheme();
  const [addEvent, setAddEvent] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showEditPicker, setShowEditPicker] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState<boolean>(false);
  const [event, setEvent] = useState<any>();
  const [editEvent, setEditEvent] = useState<any>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editRecurrenceUntil, setEditRecurrenceUntil] = useState<
    Date | undefined
  >(undefined);
  const { mutate, isPending } = useAddReptileEventMutation();
  const { mutate: deleteEvent, isPending: isDeleting } =
    useDeleteReptileEventMutation();
  const { mutate: excludeOccurrence, isPending: isExcluding } =
    useExcludeReptileEventOccurrenceMutation();
  const { mutate: updateEvent, isPending: isUpdating } =
    useUpdateReptileEventMutation();
  const customTheme = {
    agendaDayTextColor: colors.primary,
    agendaDayNumColor: colors.primary,
    agendaTodayColor: colors.primary,
    agendaKnobColor: colors.outlineVariant ?? colors.outline,
    calendarBackground: colors.surface,
    backgroundColor: "transparent",
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.onPrimary,
    todayBackgroundColor: colors.primaryContainer,
    todayTextColor: colors.primary,
    dotColor: colors.tertiary,
    selectedDotColor: colors.onPrimary,
    monthTextColor: colors.onSurface,
    dayTextColor: colors.onSurface,
    textSectionTitleColor: colors.secondary,
    textDisabledColor: colors.outline,
    arrowColor: colors.primary,
  };
  const { show } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (route.params?.openAddEvent) {
      setAddEvent(true);
      navigation.setParams({ openAddEvent: false });
    }
  }, [route.params?.openAddEvent, navigation]);

  const parseDateForPicker = (value?: string) => {
    if (!value) return undefined;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge">Agenda</Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          Organisez les événements et rappels de soins.
        </Text>
      </View>
      {isLoading && (!data || Object.keys(data).length === 0) ? (
        <AgendaSkeleton />
      ) : (
        <CardSurface style={styles.calendarCard}>
          <RNCAgenda
            displayLoadingIndicator={isLoading}
            items={data}
            onRefresh={refetch}
            refreshing={isLoading}
            showWeekNumbers={false}
            renderEmptyData={() => <EmptyList />}
            theme={customTheme}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() => {
                  setShowEventInfo(true);
                  setEvent(item);
                }}
              >
                <AgendaItem item={item} />
              </TouchableOpacity>
            )}
          />
        </CardSurface>
      )}
      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color={colors.primaryContainer}
        icon="plus"
        color="#fff"
        style={styles.fab}
        onPress={() => setAddEvent(true)}
      />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          if (!values.event_date) {
            show("La date est obligatoire.", { label: "Ok" });
            return;
          }

          mutate(
            {
              input: {
                event_name: values.event_name,
                event_date: values.event_date,
                event_time: values.event_time,
                notes: values.notes,
                recurrence_type: values.recurrence_type,
                recurrence_interval: values.recurrence_interval,
                recurrence_until: values.recurrence_until || null,
                reptile_id: values.reptile_id || null,
                reptile_name: values.reptile_name || null,
                reptile_image_url: values.reptile_image_url || null,
              },
            },
            {
              onSuccess: (created) => {
                scheduleNotification(created?.id ?? values.event_name, values);
                resetForm();
                setInputDate(new Date());
                setInputRecurrenceUntil(undefined);

                queryClient.invalidateQueries({
                  queryKey: useReptileEventsQuery.queryKey,
                });
                setAddEvent(false);
                show("Événement ajouté avec succès !", {
                  label: "Ok",
                });
              },
              onError: () => {
                show("Une erreur est survenue, Veuillez réessayer ...", {
                  label: "Ok",
                });
              },
            },
          );
        }}
        // validationSchema={schema}
      >
        {(formik) => (
          <Portal>
            <Modal
              visible={addEvent}
              onDismiss={() => setAddEvent(false)}
              contentContainerStyle={{
                backgroundColor: colors.surface,
                marginHorizontal: 20,
                padding: 18,
                // gap: 10,
                borderRadius: 50,
              }}
            >
              <Appbar.Header
                style={[
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Appbar.BackAction onPress={() => setAddEvent(false)} />
                <Appbar.Content title="Nouvel événement" />
              </Appbar.Header>

              <ScrollView>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  <CardSurface style={[styles.inputSection, { gap: 4 }]}>
                    <TextInput
                      placeholder="Titre"
                      value={formik.values.event_name}
                      onChangeText={formik.handleChange("event_name")}
                    />
                    <Divider style={{ marginHorizontal: 8 }} />
                    <TouchableOpacity onPress={() => setShowSelectReptile(true)}>
                      <TextInput
                        placeholder="Associer un reptile (optionnel)"
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
                        Choisir un reptile
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
                            onPress={() => onPickReptile(rep, formik)}
                          />
                        ))}
                      </ScrollView>
                      <Button
                        onPress={() => {
                          setShowSelectReptile(false);
                          setSelectedReptile(null);
                          formik.setFieldValue("reptile_id", "");
                          formik.setFieldValue("reptile_name", "");
                          formik.setFieldValue("reptile_image_url", "");
                        }}
                      >
                        Aucun reptile
                      </Button>
                    </Modal>
                  </Portal>
                  <CardSurface style={styles.inputSection}>
                    <View style={styles.rowSplit}>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setShowPicker(true)}
                      >
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          value={formik.values.event_time}
                          placeholder="Heure"
                          editable={false}
                        />
                      </TouchableOpacity>
                      <DatePickerInput
                        mode="outlined"
                        locale="fr"
                        label="Date"
                        saveLabel="Confirmer"
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
                  <CardSurface style={styles.inputSection}>
                    <TextInput
                      multiline
                      style={styles.input}
                      placeholder="Notes"
                      onChangeText={formik.handleChange("notes")}
                      onBlur={formik.handleBlur("notes")}
                    />
                  </CardSurface>
                  <CardSurface style={styles.inputSection}>
                    <Text variant="labelLarge">Récurrence</Text>
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
                        { value: "NONE", label: "Aucune" },
                        { value: "DAILY", label: "Quotidien" },
                        { value: "WEEKLY", label: "Hebdo" },
                        { value: "MONTHLY", label: "Mensuel" },
                      ]}
                      style={{ marginTop: 8 }}
                    />
                    {formik.values.recurrence_type !== "NONE" ? (
                      <DatePickerInput
                        mode="outlined"
                        locale="fr"
                        label="Fin de récurrence (optionnel)"
                        saveLabel="Confirmer"
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
                        clearButtonLabel="Effacer"
                        withDateFormatInLabel={false}
                        inputMode="start"
                        dense
                      />
                    ) : null}
                  </CardSurface>
                  <Button
                    loading={isPending}
                    disabled={!formik.isValid}
                    icon={"plus"}
                    onPress={formik.submitForm}
                    mode="contained"
                  >
                    Ajouter
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
            </Modal>
          </Portal>
        )}
      </Formik>
      <Formik
        enableReinitialize
        initialValues={{
          event_name: editEvent?.name ?? "",
          event_date: editEvent?.date ?? formatYYYYMMDD(new Date()),
          event_time: editEvent?.time ?? "",
          notes: editEvent?.notes ?? "",
          recurrence_type: editEvent?.recurrence_type ?? "NONE",
          recurrence_interval: editEvent?.recurrence_interval ?? 1,
          recurrence_until: editEvent?.recurrence_until ?? "",
          reptile_id: editEvent?.reptile_id ?? "",
          reptile_name: editEvent?.reptile_name ?? "",
          reptile_image_url: editEvent?.reptile_image_url ?? "",
        }}
        onSubmit={(values) => {
          if (!editEvent?.id) return;
          if (!values.event_date) {
            show("La date est obligatoire.", { label: "Ok" });
            return;
          }

          updateEvent(
            {
              id: editEvent.id,
              input: {
                event_name: values.event_name,
                event_date: values.event_date,
                event_time: values.event_time,
                notes: values.notes,
                recurrence_type: values.recurrence_type,
                recurrence_interval: values.recurrence_interval,
                recurrence_until: values.recurrence_until || null,
                reptile_id: values.reptile_id || null,
                reptile_name: values.reptile_name || null,
                reptile_image_url: values.reptile_image_url || null,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: useReptileEventsQuery.queryKey,
                });
                scheduleNotification(values);
                setEditEvent(null);
                setEditDate(undefined);
                setEditRecurrenceUntil(undefined);
                show("Événement mis à jour", { label: "Ok" });
              },
              onError: () => {
                show("Impossible de modifier l'événement", { label: "Ok" });
              },
            },
          );
        }}
      >
        {(formik) => (
          <Portal>
            <Modal
              visible={!!editEvent}
              onDismiss={() => setEditEvent(null)}
              contentContainerStyle={{
                backgroundColor: colors.surface,
                marginHorizontal: 20,
                padding: 18,
                borderRadius: 50,
              }}
            >
              <Appbar.Header
                style={[
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Appbar.BackAction onPress={() => setEditEvent(null)} />
                <Appbar.Content title="Modifier l'événement" />
              </Appbar.Header>
              <ScrollView>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  {editEvent?.recurrence_type &&
                  editEvent?.recurrence_type !== "NONE" ? (
                    <Text variant="labelSmall" style={styles.editHint}>
                      Cette modification s&apos;applique à toute la série.
                    </Text>
                  ) : null}
                  <CardSurface style={styles.inputSection}>
                    <TextInput
                      placeholder="Titre"
                      value={formik.values.event_name}
                      onChangeText={formik.handleChange("event_name")}
                    />
                    <Divider style={{ marginHorizontal: 8 }} />
                    <TouchableOpacity
                      onPress={() => setShowSelectReptileEdit(true)}
                    >
                      <TextInput
                        placeholder="Associer un reptile (optionnel)"
                        value={formik.values.reptile_name}
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                  </CardSurface>
                  <Portal>
                    <Modal
                      visible={showSelectReptileEdit}
                      onDismiss={() => setShowSelectReptileEdit(false)}
                      contentContainerStyle={{
                        backgroundColor: colors.surface,
                        marginHorizontal: 20,
                        padding: 12,
                        borderRadius: 18,
                      }}
                    >
                      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                        Choisir un reptile
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
                            onPress={() => onPickReptileEdit(rep, formik)}
                          />
                        ))}
                      </ScrollView>
                      <Button
                        onPress={() => {
                          setShowSelectReptileEdit(false);
                          setSelectedReptileEdit(null);
                          formik.setFieldValue("reptile_id", "");
                          formik.setFieldValue("reptile_name", "");
                          formik.setFieldValue("reptile_image_url", "");
                        }}
                      >
                        Aucun reptile
                      </Button>
                    </Modal>
                  </Portal>
                  <CardSurface style={styles.inputSection}>
                    <View style={styles.rowSplit}>
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setShowEditPicker(true)}
                      >
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          value={formik.values.event_time}
                          placeholder="Heure"
                          editable={false}
                        />
                      </TouchableOpacity>
                      <DatePickerInput
                        mode="outlined"
                        locale="fr"
                        label="Date"
                        saveLabel="Confirmer"
                        outlineStyle={{ borderWidth: 0 }}
                        style={styles.dateInput}
                        value={editDate}
                        onChange={(data) => {
                          setEditDate(data);
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
                  <CardSurface style={styles.inputSection}>
                    <TextInput
                      multiline
                      style={styles.input}
                      placeholder="Notes"
                      onChangeText={formik.handleChange("notes")}
                      onBlur={formik.handleBlur("notes")}
                      value={formik.values.notes}
                    />
                  </CardSurface>
                  <CardSurface style={styles.inputSection}>
                    <Text variant="labelLarge">Récurrence</Text>
                    <SegmentedButtons
                      value={formik.values.recurrence_type}
                      onValueChange={(value) => {
                        formik.setFieldValue("recurrence_type", value);
                        if (value === "NONE") {
                          setEditRecurrenceUntil(undefined);
                          formik.setFieldValue("recurrence_until", "");
                        }
                      }}
                      buttons={[
                        { value: "NONE", label: "Aucune" },
                        { value: "DAILY", label: "Quotidien" },
                        { value: "WEEKLY", label: "Hebdo" },
                        { value: "MONTHLY", label: "Mensuel" },
                      ]}
                      style={{ marginTop: 8 }}
                    />
                    {formik.values.recurrence_type !== "NONE" ? (
                      <DatePickerInput
                        mode="outlined"
                        locale="fr"
                        label="Fin de récurrence (optionnel)"
                        saveLabel="Confirmer"
                        outlineStyle={{ borderWidth: 0 }}
                        style={styles.recurrenceInput}
                        value={editRecurrenceUntil}
                        onChange={(date) => {
                          setEditRecurrenceUntil(date);
                          formik.setFieldValue(
                            "recurrence_until",
                            date ? formatYYYYMMDD(date) : "",
                          );
                        }}
                        clearButtonLabel="Effacer"
                        withDateFormatInLabel={false}
                        inputMode="start"
                        dense
                      />
                    ) : null}
                  </CardSurface>
                  <Button
                    loading={isUpdating}
                    icon={"content-save"}
                    onPress={formik.submitForm}
                    mode="contained"
                  >
                    Enregistrer
                  </Button>
                  <TimePicker
                    showPicker={showEditPicker}
                    setShowPicker={setShowEditPicker}
                    onConfirm={(pickedDuration) => {
                      formik.setFieldValue(
                        "event_time",
                        formatTime(pickedDuration),
                      );
                      setShowEditPicker(false);
                    }}
                  />
                </KeyboardAvoidingView>
              </ScrollView>
            </Modal>
          </Portal>
        )}
      </Formik>
      <Portal>
        <Modal
          visible={showEventInfo}
          onDismiss={() => setShowEventInfo(false)}
          contentContainerStyle={{
            backgroundColor: colors.surface,
            marginHorizontal: 20,
            padding: 20,
            gap: 10,
          }}
        >
          <Appbar.Header
            style={[
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Appbar.BackAction onPress={() => setShowEventInfo(false)} />
            <Appbar.Content title={event?.name} />
          </Appbar.Header>
          <ScrollView>
            <View>
              <TextInfo title="Nom" value={event?.name} />
              <TextInfo title="Date" value={event?.date} />
              <TextInfo title="Heure" value={event?.time} />
              {event?.reptile_name ? (
                <TextInfo title="Reptile" value={event?.reptile_name} />
              ) : null}
              {event?.reptile_image_url ? (
                <View style={{ paddingVertical: 8, alignItems: "center" }}>
                  <Avatar.Image
                    size={80}
                    source={{ uri: event.reptile_image_url }}
                  />
                </View>
              ) : null}
              <TextInfo title="Notes" value={event?.notes} />
              {event?.recurrence_type && event?.recurrence_type !== "NONE" ? (
                <TextInfo title="Récurrence" value={event?.recurrence_type} />
              ) : null}
            </View>
          </ScrollView>
          <Button
            mode="contained"
            icon="pencil"
            onPress={() => {
              setEditEvent(event);
              setEditDate(parseDateForPicker(event?.date));
              setEditRecurrenceUntil(
                parseDateForPicker(event?.recurrence_until),
              );
              setShowEventInfo(false);
            }}
          >
            Modifier l&apos;événement
          </Button>
          {event?.recurrence_type && event?.recurrence_type !== "NONE" ? (
            <View style={styles.deleteRow}>
              <Button
                mode="outlined"
                loading={isExcluding}
                onPress={() => {
                  if (!event?.id || !event?.date) return;
                  excludeOccurrence(
                    { id: event.id, date: event.date },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: useReptileEventsQuery.queryKey,
                        });
                        setShowEventInfo(false);
                        show("Occurrence supprimée");
                      },
                      onError: () => {
                        show("Impossible de supprimer l'occurrence");
                      },
                    },
                  );
                }}
              >
                Supprimer cette occurrence
              </Button>
              <Button
                mode="outlined"
                loading={isDeleting}
                textColor={colors.error}
                onPress={() => {
                  if (!event?.id) return;
                  deleteEvent(
                    { id: event.id },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: useReptileEventsQuery.queryKey,
                        });
                        setShowEventInfo(false);
                        show("Série supprimée");
                      },
                      onError: () => {
                        show("Impossible de supprimer la série");
                      },
                    },
                  );
                }}
              >
                Supprimer toute la série
              </Button>
            </View>
          ) : (
            <Button
              mode="outlined"
              loading={isDeleting}
              textColor={colors.error}
              onPress={() => {
                if (!event?.id) return;
                deleteEvent(
                  { id: event.id },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: useReptileEventsQuery.queryKey,
                      });
                      setShowEventInfo(false);
                      show("Événement supprimé");
                    },
                    onError: () => {
                      show("Impossible de supprimer l'événement");
                    },
                  },
                );
              }}
            >
              Supprimer l&apos;événement
            </Button>
          )}
        </Modal>
      </Portal>
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
  calendarCard: {
    flex: 1,
    padding: 0,
    overflow: "hidden",
  },
  verticleLine: {
    height: "70%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: 1,
    backgroundColor: "rgb(202, 196, 208)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  inputSection: {
    marginVertical: 8,
  },
  input: {
    padding: 10,
    // borderRadius: 30,
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
  reptileButton: {
    width: "100%",
    justifyContent: "center",
    borderRadius: 14,
  },
  recurrenceInput: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
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
  reptileButton: {
    width: "100%",
    justifyContent: "center",
    borderRadius: 14,
  },
  editHint: {
    marginBottom: 8,
    opacity: 0.7,
  },
  deleteRow: {
    gap: 10,
  },
});
export default Agenda;
// TODO: refactor this component
