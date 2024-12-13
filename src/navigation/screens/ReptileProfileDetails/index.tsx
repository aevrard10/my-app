import { StaticScreenProps } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  TextInput,
  Text,
} from "react-native-paper";
import useReptileQuery from "../Home/hooks/queries/useReptileQuery";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";

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
  return (
    <>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={150}
            source={{
              uri: "https://lapauseinfo.fr/wp-content/uploads/2024/02/26771140-une-bleu-serpent-naturel-contexte-gratuit-photo-scaled.jpeg",
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
    </>
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
});

export default ReptileProfileDetails;
