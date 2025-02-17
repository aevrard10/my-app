import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  FAB,
  Surface,
  useTheme,
} from "react-native-paper";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useMeasurementsQuery from "./hooks/data/queries/useMeasurementsQuery";
import TextInfo from "./components/TextInfo";
import GraphicChart from "./components/GraphicChart";
import ReptilePicture from "./components/ReptilePicture";
import TemperatureChart from "./components/TemperatureChart";
import HumidityChart from "./components/HumidityChart";
import TextInput from "@shared/components/TextInput";
import SizeChart from "./components/SizeChart";
import useReptileQuery from "../Reptiles/hooks/queries/useReptileQuery";
import ScreenNames from "@shared/declarations/screenNames";
import useLastFedUpdateMutation from "./hooks/data/mutations/useLastFedUpdate";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { data, error } = useReptileQuery(id);
  console.log('error', error)
  const [notes, setNotes] = useState(data?.notes || "");
  const navigation = useNavigation();

  const { mutate } = useAddNotesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { data: measurements, isPending } = useMeasurementsQuery(id);
const {mutate: updateLastFed} = useLastFedUpdateMutation()
  useEffect(() => {
    navigation.setOptions({ title: data?.name ?? "Détails du reptile" });
  }, [data?.name]);

  const addNotes = useCallback(() => {
    mutate(
      { id, notes },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          show("Notes enregistrées");
        },
      }
    );
  }, [id, notes, mutate]);

  const { colors } = useTheme();
  return (
    <>
      <ScrollView>
        <ReptilePicture data={data} />
        <Button
          mode="contained"
          onPress={() => {
            updateLastFed( {id,  last_fed: new Date().toISOString().split("T")[0] }, {  // Format YYYY-MM-DD
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: useReptileQuery.queryKey(id),
                });
                show("Nourrissage enregistré");
              },
              
                onError: () => {
                  show("Erreur lors de l'enregistrement du nourrissage");

              }
            
            })
          }}
        >
          Nourrissage
        </Button>
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
          <TextInfo value={data?.health_status || ""} title="État de santé" />
    
        </Surface>

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
                value: data?.temperature_range || "0",
                color:
                  data?.temperature_range > 30
                    ? data?.temperature_range > 30
                      ? "#FF7F97"
                      : "#3BE9DE"
                    : "#3BE9DE",
                gradientCenterColor:
                  data?.temperature_range > 30
                    ? data?.temperature_range > 30
                      ? "#FF7F97"
                      : "#006DFF"
                    : "#006DFF",
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
              weight_mesure: m.weight_mesure,
            }))}
            isPending={isPending}
          />
          <SizeChart
            data={measurements?.map((m) => ({
              date: m.date,
              value: m.size,
              size_mesure: m.size_mesure,
            }))}
            isPending={isPending}
          />
        </View>
        {/* <EventCalendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "blue",
              selectedTextColor: "white",
            },
          }}
        /> */}
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
        onPress={() => navigation.navigate(ScreenNames.ADD_MEASUREMENTS, { id })}
      />
      {/* <EventModal
        visible={!!selectedDate}
        value={eventDescription}
        onChangeText={setEventDescription}
        addPress={handleAddEvent}
        cancelPress={() => setSelectedDate("")}
      /> */}
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
