import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React, { useState } from "react";
import {
  Appbar,
  Button,
  Divider,
  FAB,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";
import { Formik } from "formik";
import { TimerPickerModal } from "react-native-timer-picker";

const Agenda = () => {
  const { data, isLoading } = useReptileEventsQuery();

  const { colors } = useTheme();
  const [addEvent, setAddEvent] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const formatTime = ({
    hours,
    minutes,
    seconds,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const timeParts = [];

    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
      timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
  };
  const customTheme = {
    agendaDayTextColor: colors.primary, // Custom color for agenda day text
    agendaDayNumColor: colors.primary, // Custom color for agenda day number
    agendaTodayColor: colors.primary, // Custom color for today's agenda
  };
  return (
    <Portal.Host>
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <RNCAgenda
          displayLoadingIndicator={isLoading}
          items={data}
          showWeekNumbers
          renderEmptyData={EmptyList}
          theme={customTheme}
          renderItem={(item) => (
            <View
              style={{
                marginVertical: 10,
                marginTop: 30,
                backgroundColor: "white",
                marginHorizontal: 10,
                padding: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.time}</Text>
            </View>
          )}
        />
      </View>
      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color={colors.primaryContainer}
        icon="plus"
        style={styles.fab}
        onPress={() => setAddEvent(true)}
      />
      <Formik
        initialValues={{ eventName: "", eventDate: "", eventTime: "" }}
        onSubmit={(values) => console.log(values)}
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
            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                placeholder="Titre"
                onChange={() => formik.handleChange("eventName")}
                onBlur={formik.handleBlur("eventName")}
              />
              <Divider style={{ marginHorizontal: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Lieu"
                onChange={() => formik.handleChange("eventName")}
                onBlur={formik.handleBlur("eventName")}
              />
            </View>
            <View style={styles.inputSection}>
              <TextInput
                placeholder="Date"
                style={styles.input}
                onChange={() => formik.handleChange("eventDate")}
                onBlur={formik.handleBlur("eventDate")}
              />
              <Divider style={{ marginHorizontal: 8 }} />

              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <TextInput
                  style={styles.input}
                  value={formik.values.eventTime}
                  placeholder="Heure de l'événement"
                  onPress={() => setShowPicker(true)}
                />
              </TouchableOpacity>
              <TimerPickerModal
                visible={showPicker}
                cancelButtonText="Annuler"
                confirmButtonText="Confirmer"
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                  console.log(pickedDuration);
                  formik.setFieldValue("eventTime", formatTime(pickedDuration));
                  setShowPicker(false);
                }}
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                Audio={Audio}
                styles={{
                  theme: "light",
                }}
                modalProps={{
                  overlayOpacity: 0.2,
                }}
              />
            </View>
            <Button
              icon={"plus"}
              onPress={() => window.location.reload()}
              mode="contained"
            >
              Ajouter
            </Button>
          </Modal>
        )}
      </Formik>
    </Portal.Host>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
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
  input: {
    padding: 10,
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});
export default Agenda;
