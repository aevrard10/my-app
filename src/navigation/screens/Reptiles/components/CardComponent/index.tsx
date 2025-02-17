import { Card, Button, Dialog, Portal, Text, Avatar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { FC, useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/graphql/utils/types/types.generated";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";
import { capitalize } from "lodash";
import ScreenNames from "@shared/declarations/screenNames";
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
      {item.sex && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <Avatar.Icon
            size={40}
            style={{
              borderRadius: 0,
              backgroundColor: item?.sex === "Mâle" ? "#6c998d" : "#a17884",
              borderTopLeftRadius: 24,
              borderBottomRightRadius: 24,
            }}
            icon={item?.sex === "Mâle" ? "gender-male" : "gender-female"}
            color={"#fff"}
          />
          "
        </View>
      )}
      <Card.Cover
        source={{
          uri: item?.image_url,
        }}
        style={{
          backgroundColor: "#4CAF50",
        }}
      />
      <Card.Title
        title={capitalize(item?.name)}
        subtitle={item?.age + " ans"}
      />
      <Card.Actions>
        <Button
          onPress={() =>
            navigate(ScreenNames.REPTILE_PROFILE_DETAILS, {
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
    backgroundColor: "#fff",
  },
});
export default CardComponent;
