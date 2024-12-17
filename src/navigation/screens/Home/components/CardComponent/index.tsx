import { Card, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { FC, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/graphql/utils/types/types.generated";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";

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
      <Card.Cover
        source={{
          uri: item?.image_url,
        }}
      />
      <Card.Title title={item?.name} subtitle={item?.age + " ans"} />
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
        <Button mode="contained" onPress={removeReptile}>
          Supprimer
        </Button>
      </Card.Actions>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    margin: 20,
  },
});
export default CardComponent;
