import { StaticScreenProps } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { ScrollView, StyleSheet, View, Modal } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  TextInput,
  Text,
  Card,
} from "react-native-paper";
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

  const { mutate } = useAddNotesMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
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
          <Chip icon="snake" onPress={() => console.log("Pressed")}>
            {data?.species}
          </Chip>
        </View>
      </View>
      <Test title="Âge" value={data?.age || ""} />
      <Test title="Espèce" value={data?.species || ""} />

      <View style={{ margin: 20 }}>
        <TextInput
          label="Informations"
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
            <TextInput
              label="Description de l'événement"
              value={eventDescription}
              onChangeText={setEventDescription}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddEvent}>
              Ajouter
            </Button>
            <Button mode="contained" onPress={() => setSelectedDate("")}>
              Annuler
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  input: {
    marginBottom: 10,
  },
});

export default ReptileProfileDetails;
