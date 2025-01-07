import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  FAB,
  Surface,
  useTheme,
  Text,
} from "react-native-paper";
import useReptileQuery from "../Home/hooks/queries/useReptileQuery";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useMeasurementsQuery from "./hooks/data/queries/useMeasurementsQuery";
import TextInfo from "./components/TextInfo";
import WeightModal from "./components/WeightModal";
import EventModal from "./components/EventModal";
import GraphicChart from "./components/GraphicChart";
import ReptilePicture from "./components/ReptilePicture";
import EventCalendar from "./components/EventCalendar";
import useAddMeasurementMutation from "./hooks/data/mutations/useAddMeasurementsMutation";
import TemperatureChart from "./components/TemperatureChart";
import HumidityChart from "./components/HumidityChart";
import TextInput from "@shared/components/TextInput";
import SizeChart from "./components/SizeChart";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { data } = useReptileQuery(id);
  const [notes, setNotes] = useState(data?.notes || "");
  const navigation = useNavigation();

  const { mutate } = useAddNotesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const { data: measurements, isPending } = useMeasurementsQuery(id);

  useEffect(() => {
    navigation.setOptions({ title: data?.name ?? "Détails du reptile" });
  }, [data?.name]);

  const addNotes = useCallback(() => {
    mutate(
      { id, notes },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: useReptileQuery.queryKey });
          show("Notes enregistrées");
        },
      }
    );
  }, [id, notes, mutate]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const { mutate: addMeasurement } = useAddMeasurementMutation();

  const handleAddEvent = () => {
    if (selectedDate && eventDescription) {
      mutate(
        { reptileId: id, date: selectedDate, description: eventDescription },
        {
          onSuccess: () => {
            show("Événement ajouté avec succès!");
            setEventDescription("");
            setSelectedDate("");
          },
        }
      );
    } else {
      show("Veuillez remplir tous les champs.");
    }
  };
  const { colors } = useTheme();
  return (
    <>
      <ScrollView>
        <ReptilePicture data={data} />

        <Surface style={styles.inputSection}>
          <TextInfo title="Âge" value={data?.age + " ans" || "-"} />
          <TextInfo title="Espèce" value={data?.species || ""} />
          <TextInfo
            title="Date d'acquisition"
            value={data?.acquired_date || ""}
          />
          <TextInfo title="Origine" value={data?.origin || ""} />
          <TextInfo
            title="Emplacement"
            value={data?.location || ""}
            noDivider
          />
        </Surface>
        <Surface style={styles.inputSection}>
          <TextInfo title="Dernier repas" value={data?.last_fed || ""} />
          <TextInfo title="Prochain repas" value={data?.next_feed || ""} />
          <TextInfo
            value={data?.feeding_schedule || ""}
            title="Horaire de repas"
          />
          <TextInfo
            value={data?.diet || ""}
            title="Régime alimentaire"
            noDivider
          />
        </Surface>
        <Surface style={styles.inputSection}>
          <TextInfo
            value={data?.lighting_requirements || ""}
            title="Exigences d'éclairage"
            noDivider
          />
        </Surface>
        <Surface style={styles.inputSection}>
          <TextInfo value={data?.health_status || ""} title="État de santé" />
          <TextInfo
            value={data?.last_vet_visit || ""}
            title="Dernière visite chez le vétérinaire"
          />
          <TextInfo
            value={data?.next_vet_visit || ""}
            title="Prochaine visite chez le vétérinaire"
            noDivider
          />
        </Surface>
        {/* <TextInfo title="Historique médical" value={data?.medical_history || ""} /> */}
        <Surface style={styles.inputSection}>
          <TextInfo
            title="Notes de comportement"
            value={data?.behavior_notes || ""}
          />
          <TextInfo
            title="Notes de manipulation"
            value={data?.handling_notes || ""}
            noDivider
          />
        </Surface>

        {/* <TextInfo title="Enclos" value={data?.enclosure?.type || ""} /> */}
        <View style={{ margin: 20 }}>
          <TextInput
            multiline
            style={styles.input}
            value={notes}
            onChange={(e) => setNotes(e.nativeEvent.text)}
            placeholder="Informations"
          />

          <View style={{ marginTop: 10 }}>
            <Button mode="contained" onPress={addNotes}>
              Enregistrer les notes
            </Button>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TemperatureChart
            data={[
              {
                value: data?.temperature_range || "",
                color:
                  data?.temperature_range > 30
                    ? data?.temperature_range > 30
                      ? "#FF7F97"
                      : "#3BE9DE"
                    : "#3BE9DE",
                gradientCenterColor: "#006DFF",
                focused: true,
              },
            ]}
            temperature={data?.temperature_range || ""}
          />
          <HumidityChart
            data={[
              {
                value: data?.temperature_range || "",
                color:
                  data?.humidity_level > 30
                    ? data?.humidity_level > 30
                      ? "#FF7F97"
                      : "#3BE9DE"
                    : "#3BE9DE",
                gradientCenterColor: "#006DFF",
                focused: true,
              },
            ]}
            humidity={data?.humidity_level || ""}
          />
        </View>
        <View style={{ gap: 10 }}>
          <GraphicChart
            data={measurements?.map((m) => ({
              date: m.date,
              value: m.weight,
            }))}
            isPending={isPending}
          />
          <SizeChart
            data={measurements?.map((m) => ({
              date: m.date,
              value: m.size,
            }))}
            isPending={isPending}
          />
        </View>
        <EventCalendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "blue",
              selectedTextColor: "white",
            },
          }}
        />
      </ScrollView>

      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color="#fff"
        icon="weight-kilogram"
        onPress={() => setShowWeightModal(true)}
      />
      <WeightModal
        onSubmit={(values) => {
          console.log(values);
          addMeasurement(
            {
              input: {
                reptile_id: id,
                weight: values.weight,
                size: values.size,
                date: values.date,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: useMeasurementsQuery.queryKey,
                });
                show("Mesures ajoutées avec succès!");
                setShowWeightModal(false);
              },
              onError: () => {
                show("Une erreur s'est produite");
              },
            }
          );
        }}
        visible={!!showWeightModal}
        reptile_id={id}
        onPress={() => setShowWeightModal(false)}
      />
      <EventModal
        visible={!!selectedDate}
        value={eventDescription}
        onChangeText={setEventDescription}
        addPress={handleAddEvent}
        cancelPress={() => setSelectedDate("")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    outlineStyle: "none",
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  inputSection: {
    // overflow: "hidden",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});

export default ReptileProfileDetails;
