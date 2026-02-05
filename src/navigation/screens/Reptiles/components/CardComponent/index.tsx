import {
  Card,
  Button,
  Dialog,
  Portal,
  Text,
  Avatar,
} from "react-native-paper";
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
import { useSnackbar } from "@rn-flix/snackbar";
import { useTheme } from "react-native-paper";
import useLastFedUpdateMutation from "../../../ReptileProfileDetails/hooks/data/mutations/useLastFedUpdate";
import { formatYYYYMMDD } from "@shared/utils/formatedDate";
type CardComponentProps = {
  item?: Reptile;
};

const CardComponent: FC<CardComponentProps> = (props) => {
  const { item } = props;
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const { mutate } = useRemoveReptileMutation();
  const { mutate: updateLastFed, isPending: isUpdatingFed } =
    useLastFedUpdateMutation();
  const [showDialog, setShowDialog] = useState(false);
  const { show } = useSnackbar();
  const { colors } = useTheme();
  const iconSex = useMemo(() => getIcon(item?.sex), [item?.sex]);
  const backgroundColor = useMemo(
    () => getBackgroundColor(item?.sex),
    [item?.sex]
  );
  const removeReptile = useCallback(() => {
    if (!item?.id) {
      return;
    }
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
  }, [item?.id, mutate, queryClient, show]);

  const handleLastFedUpdate = useCallback(() => {
    if (!item?.id) return;
    updateLastFed(
      { id: item?.id, last_fed: formatYYYYMMDD(new Date()) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptilesQuery.queryKey,
          });
          show("Dernier repas mis à jour");
        },
        onError: () => {
          show("Erreur lors de la mise à jour");
        },
      }
    );
  }, [item?.id, updateLastFed, queryClient, show]);
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
        </View>
      )}
      <Card.Cover
        source={
          item?.image_url
            ? {
                uri: item?.image_url,
              }
            : require("../../../../../../assets/cobra.png")
        }
        resizeMode="cover"
        style={[styles.cover, { backgroundColor: colors.primary }]}
      />
      <Card.Title
        title={capitalize(item?.name)}
        subtitle={item?.age + " ans"}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      <Card.Actions style={styles.actions}>
        <Button
          onPress={() =>
            navigate(ScreenNames.REPTILE_PROFILE_DETAILS, {
              id: item?.id,
            })
          }
        >
          Voir plus
        </Button>
        <Button
          mode="outlined"
          onPress={handleLastFedUpdate}
          loading={isUpdatingFed}
        >
          Nourri aujourd&apos;hui
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
            <Text variant="bodyMedium">
              Êtes-vous sûr de vouloir supprimer ce reptile ?
            </Text>
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
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cover: {
    height: 180,
    backgroundColor: "#2F5D50",
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    opacity: 0.6,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
    flexWrap: "wrap",
  },
});
export default CardComponent;
