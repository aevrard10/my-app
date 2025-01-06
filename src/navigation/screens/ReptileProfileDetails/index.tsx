import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { FC, useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Modal, TextInput } from "react-native";
import { Avatar, Button, Chip, Divider, Text, Card } from "react-native-paper";
import useReptileQuery from "../Home/hooks/queries/useReptileQuery";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import { Calendar, LocaleConfig } from "react-native-calendars";
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";
type Props = StaticScreenProps<{
  id: string;
}>;

type TestProps = {
  title: string;
  value: string;
};
const Test: FC<TestProps> = (props) => {
  const { title, value } = props;
  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text variant="labelMedium">{title}</Text>
          <Text variant="bodyLarge">{value}</Text>
        </View>
      </View>
      {<Divider style={styles.divider} />}
    </View>
  );
};
const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { data } = useReptileQuery(id);
  const [notes, setNotes] = useState(data?.notes || "");
  const navigation = useNavigation();

  const { mutate } = useAddNotesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();

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
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={150}
            source={{
              uri: data?.image_url,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Chip
            icon={
              data?.sort_of_species === "snake"
                ? "snake"
                : require("../../../../assets/lizard.png")
            }
            onPress={() => console.log("Pressed")}
          >
            {data?.species}
          </Chip>
        </View>
      </View>
      <Test title="Âge" value={data?.age || ""} />
      <Test title="Espèce" value={data?.species || ""} />
      <Test title="Dernier repas" value={data?.last_fed || ""} />
      <Test title="Prochain repas" value={data?.next_feed || ""} />
      <Test value={data?.feeding_schedule || ""} title="Horaire de repas" />
      <Test value={data?.diet || ""} title="Régime alimentaire" />
      <Test value={data?.humidity_level || ""} title="Niveau d'humidité" />
      <Test
        value={data?.temperature_range || ""}
        title="Plage de température"
      />
      <Test
        value={data?.lighting_requirements || ""}
        title="Exigences d'éclairage"
      />
      <Test value={data?.health_status || ""} title="État de santé" />
      <Test
        value={data?.last_vet_visit || ""}
        title="Dernière visite chez le vétérinaire"
      />
      <Test
        value={data?.next_vet_visit || ""}
        title="Prochaine visite chez le vétérinaire"
      />
      {/* <Test title="Historique médical" value={data?.medical_history || ""} /> */}
      <Test title="Notes de comportement" value={data?.behavior_notes || ""} />
      <Test title="Notes de manipulation" value={data?.handling_notes || ""} />
      <Test title="Date d'acquisition" value={data?.acquired_date || ""} />
      <Test title="Origine" value={data?.origin || ""} />
      <Test title="Emplacement" value={data?.location || ""} />
      {/* <Test title="Enclos" value={data?.enclosure?.type || ""} /> */}

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
      <Card style={{ margin: 20 }}>
        <Calendar
          current={new Date()}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "blue",
              selectedTextColor: "white",
            },
          }}
        />
      </Card>

      {/* Formulaire pour ajouter un événement */}
      <Modal visible={!!selectedDate}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un événement</Text>
            <View style={styles.inputSection}>
              <TextInput
                placeholder="Description de l'événement"
                value={eventDescription}
                onChangeText={setEventDescription}
                style={styles.input}
              />
            </View>
            <View style={styles.button}>
              <Button mode="contained" onPress={handleAddEvent}>
                Ajouter
              </Button>
              <Button mode="contained" onPress={() => setSelectedDate("")}>
                Annuler
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    gap: 10,
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
    outlineStyle: "none",
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  avatarContainer: { padding: 10 },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  infoContainer: { marginVertical: 8, marginLeft: 16, marginRight: 24 },
  textContainer: { marginVertical: 8 },
  divider: {
    marginHorizontal: 16,
  },

  chip: { marginVertical: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ReptileProfileDetails;
