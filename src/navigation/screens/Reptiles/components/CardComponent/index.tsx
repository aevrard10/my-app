import { Card, Button, Dialog, Portal, Text, Avatar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/graphql/utils/types/types.generated";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";
import { capitalize } from "lodash";
import ScreenNames from "@shared/declarations/screenNames";
import { getBackgroundColor, getIcon } from "../../utils/getSex";
type CardComponentProps = {
  item?: Reptile;
};

const CardComponent: FC<CardComponentProps> = (props) => {
  const { item } = props;
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const { mutate } = useRemoveReptileMutation();
  const [showDialog, setShowDialog] = useState(false);
  const iconSex = useMemo(() => getIcon(item?.sex), [item?.sex]);
const backgroundColor = useMemo(() => getBackgroundColor(item?.sex), [item?.sex]);
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
    <Card style={styles.card} mode="elevated">
      {item?.sex && (
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
              backgroundColor: backgroundColor,
              borderTopLeftRadius: 24,
              borderBottomRightRadius: 24,
            }}
            icon={iconSex}
            color={"#fff"}
          />
          "
        </View>
      )}
      <Card.Cover
        source={{
          uri: item?.image_url,
        }}
        resizeMode="cover"
        style={{
          // prendre toute la largeur de la carte
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
