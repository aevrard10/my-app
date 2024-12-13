import {
  Text,
  Card,
  Button,
  Avatar,
  AvatarIconProps,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import { FC, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/graphql/utils/types/types.generated";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";

const LeftContent = (props: AvatarIconProps) => (
  <Avatar.Icon {...props} icon="snake" />
);
type CardComponentProps = {
  item?: Reptile;
};
const CardComponent: FC<CardComponentProps> = (props) => {
  const { item } = props;
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const { mutate } = useRemoveReptileMutation();
  const removeReptile = useCallback(() => {
    mutate(
      { id: item?.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptilesQuery.queryKey,
          });
          show("Reptile supprimé avec succès !", {
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
  }, [item, mutate]);
  return (
    <Card style={styles.card}>
      <Card.Title
        title={item?.name}
        subtitle={item?.age + " ans"}
        left={LeftContent}
      />
      <Card.Content>
        <Text variant="titleLarge">{item?.species}</Text>
        <Text variant="bodyMedium">{item?.last_fed}</Text>
      </Card.Content>
      <Card.Cover
        source={{
          uri: "https://lapauseinfo.fr/wp-content/uploads/2024/02/26771140-une-bleu-serpent-naturel-contexte-gratuit-photo-scaled.jpeg",
        }}
      />
      <Card.Actions>
        <Button
          onPress={() =>
            navigate("ReptileProfileDetails", {
              id: item?.id,
            })
          }
        >
          Voir plus
        </Button>
        <Button onPress={removeReptile}>Supprimer</Button>
      </Card.Actions>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    margin: 20,
  },
  container: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default CardComponent;
function show(arg0: string, arg1: { label: string }) {
  throw new Error("Function not implemented.");
}
