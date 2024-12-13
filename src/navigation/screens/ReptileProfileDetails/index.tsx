import { StaticScreenProps } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Chip, TextInput } from "react-native-paper";
import useReptileQuery from "../Home/hooks/queries/useReptileQuery";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const [text, setText] = useState("");
  const id = route.params.id;
  const { data } = useReptileQuery(id);
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
      <View style={{ margin: 20 }}>
        <TextInput
          label="Informations"
          value={text}
          onChange={(e) => setText(e.nativeEvent.text)}
          placeholder="Informations"
        />
        <View style={{ marginTop: 10 }}>
          <Button mode="contained" onPress={() => console.log("Save")}>
            Save
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
});

export default ReptileProfileDetails;
