import { Card, Button, Dialog, Portal, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { FC, useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/graphql/utils/types/types.generated";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";
import { capitalize } from "lodash";
type CardComponentProps = {
  item?: Reptile;
};

const CardComponent: FC<CardComponentProps> = (props) => {
  const { item } = props;
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const { mutate } = useRemoveReptileMutation();
  const [showDialog, setShowDialog] = useState(false);
  // TODO: hover retourne cardComponent et affiche les infos du reptile

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
      <Card.Title
        title={capitalize(item?.name)}
        subtitle={item?.age + " ans"}
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
        <Button mode="contained" onPress={() => setShowDialog(true)}>
          Supprimer
        </Button>
      </Card.Actions>
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={{ borderRadius: 20 }}
        >
          <Dialog.Title>Suppression</Dialog.Title>
          <Dialog.Content>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Êtes-vous sûr de vouloir supprimer ce reptile ?
              </Text>
            </Dialog.Content>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Annuler</Button>
            <Button onPress={removeReptile}>Supprimer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    margin: 20,
  },
});
export default CardComponent;
