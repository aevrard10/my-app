import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React, { useState } from "react";
import {
  Appbar,
  Button,
  Divider,
  FAB,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";
import { Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import { formatTime, formatYYYYMMDD } from "@shared/utils/formatedDate";
import TimePicker from "@shared/components/TimePicker";
import useAddReptileEventMutation from "./hooks/mutations/useAddReptileEventMutation";
import { useSnackbar } from "@rn-flix/snackbar";
import { useQueryClient } from "@tanstack/react-query";
import TextInput from "@shared/components/TextInput";
import AgendaItem from "./components/AgendaItem";
import TextInfo from "../ReptileProfileDetails/components/TextInfo";

const initialValues = {
  event_name: "",
  event_date: "",
  event_time: "",
  notes: "",
};
const Agenda = () => {
  const { data, isLoading, refetch } = useReptileEventsQuery();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const { colors } = useTheme();
  const [addEvent, setAddEvent] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState<boolean>(false);
  const [event, setEvent] = useState<any>();
  const { mutate, isPending } = useAddReptileEventMutation();
  const customTheme = {
    agendaDayTextColor: colors.primary, // Custom color for agenda day text
    agendaDayNumColor: colors.primary, // Custom color for agenda day number
    agendaTodayColor: colors.primary, // Custom color for today's agenda
  };
  const { show } = useSnackbar();
  const queryClient = useQueryClient();

  return (
    <>
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <RNCAgenda
          displayLoadingIndicator={isLoading}
          items={data}
          onRefresh={refetch}
          refreshing={isLoading}
          showWeekNumbers
          renderEmptyData={EmptyList}
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
      </View>
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
          mutate(
            {
              input: {
                event_name: values.event_name,
                event_date: values.event_date,
                event_time: values.event_time,
                notes: values.notes,
              },
            },
            {
              onSuccess: () => {
                resetForm();

                queryClient.invalidateQueries({
                  queryKey: useReptileEventsQuery.queryKey,
                });
                setAddEvent(false);
                show("Reptile ajouté avec succès !", {
                  label: "Ok",
                });
              },
              onError: () => {
                show("Une erreur est survenue, Veuillez réessayer ...", {
                  label: "Ok",
                });
              },
            }
          );
        }}
        // validationSchema={schema}
      >
        {(formik) => (
          <Modal
            visible={addEvent}
            onDismiss={() => setAddEvent(false)}
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
              <Appbar.BackAction onPress={() => setAddEvent(false)} />
              <Appbar.Content title="Nouvel événement" />
            </Appbar.Header>
            <ScrollView>
              <Surface style={styles.inputSection}>
                <TextInput
                  placeholder="Titre"
                  value={formik.values.event_name}
                  onChangeText={formik.handleChange("event_name")}
                />
                <Divider style={{ marginHorizontal: 8 }} />
                <TextInput
                  placeholder="Lieu"
                  // onChange={() => formik.handleChange("eventName")}
                  // onBlur={formik.handleBlur("eventName")}
                />
              </Surface>
              <Surface style={styles.inputSection}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <TextInput
                      style={styles.input}
                      value={formik.values.event_time}
                      placeholder="Heure"
                      onPress={() => setShowPicker(true)}
                    />
                  </TouchableOpacity>
                  <View style={styles.verticleLine} />
                  <DatePickerInput
                    mode="outlined"
                    locale="fr"
                    label="Date"
                    saveLabel="Confirmer"
                    outlineStyle={{ borderWidth: 0 }}
                    style={{
                      borderWidth: 0,
                      borderColor: "#fff",
                      backgroundColor: "#fff",
                      borderTopColor: "#fff",
                    }}
                    value={inputDate}
                    onChange={(data) => {
                      setInputDate(data);
                      console.log(data, formatYYYYMMDD(data));
                      formik.setFieldValue("event_date", formatYYYYMMDD(data));
                    }}
                    dense
                    inputMode="start"
                  />
                </View>
              </Surface>
              <Surface style={styles.inputSection}>
                <TextInput
                  multiline
                  style={styles.input}
                  placeholder="Notes"
                  onChangeText={formik.handleChange("notes")}
                  onBlur={formik.handleBlur("notes")}
                />
              </Surface>
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
                  console.log(pickedDuration);
                  formik.setFieldValue(
                    "event_time",
                    formatTime(pickedDuration)
                  );
                  setShowPicker(false);
                }}
              />
            </ScrollView>
          </Modal>
        )}
      </Formik>
      <Modal
        visible={showEventInfo}
        onDismiss={() => setShowEventInfo(false)}
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
          <Appbar.BackAction onPress={() => setShowEventInfo(false)} />
          <Appbar.Content title={event?.name} />
        </Appbar.Header>
        <View>
          <TextInfo title="Nom" value={event?.name} />
          <TextInfo title="Date" value={event?.date} />
          <TextInfo title="Heure" value={event?.time} />
          <TextInfo title="Notes" value={event?.notes} />
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
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
    backgroundColor: "#fff",

    margin: 10,
    borderRadius: 10,
  },
  input: {
    padding: 10,
    // borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});
export default Agenda;
// TODO: refactor this component
