import { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Checkbox, Dialog, Portal, useTheme } from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useReptileQuery from "../../../Reptiles/hooks/queries/useReptileQuery";
import useFoodQuery from "../../../Feed/hooks/data/queries/useStockQuery";
import useLastFedUpdateMutation from "../../hooks/data/mutations/useLastFedUpdate";
import useAddReptileFeedingMutation from "../../hooks/data/mutations/useAddReptileFeedingMutation";
import QueriesKeys from "@shared/declarations/queriesKeys";
import TextInput from "@shared/components/TextInput";
import { executeVoid } from "@shared/local/db";

type FeedPortalProps = {
  id: string;
  data: any;
  food: any;
  visible: boolean;
  onClose: () => void;
};

const FeedPortal: FC<FeedPortalProps> = (props) => {
  const { id, data, food, visible, onClose } = props;
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { mutate: updateLastFed } = useLastFedUpdateMutation();
  const { mutate: addFeeding } = useAddReptileFeedingMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { colors } = useTheme();

  const handleNourrissage = useCallback(() => {
    if (!selectedFood) {
      show("Veuillez sélectionner au moins un aliment.");
      return;
    }

    const now = new Date().toISOString();

    updateLastFed(
      { id, last_fed: now.split("T")[0] },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          // décrémente le stock local (ligne 'stock')
          executeVoid(
            `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, fed_at, notes)
             VALUES (?,?,?,?,?,?,?);`,
            [
              `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              "stock",
              selectedFood?.name,
              -foodQuantity,
              selectedFood?.unit ?? null,
              now,
              `Nourrissage de ${data?.name}`,
            ],
          ).catch(() => {});

          // Ajoute le nourrissage sur le reptile
          addFeeding(
            {
              input: {
                reptile_id: id,
                food_name: selectedFood?.name,
                quantity: foodQuantity,
                unit: selectedFood?.unit || "restant(s)",
                fed_at: now,
                notes: `Nourrissage de ${data?.name}`,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [QueriesKeys.REPTILE_FEEDINGS, id],
                });
                queryClient.invalidateQueries({
                  queryKey: useFoodQuery.queryKey,
                });
                show("Nourrissage enregistré");
              },
            },
          );
          setModalIsVisible(false);
        },
        onError: () => {
          show("Erreur lors de l'enregistrement du nourrissage");
        },
      },
    );
  }, [
    addFeeding,
    data?.name,
    foodQuantity,
    id,
    queryClient,
    selectedFood,
    show,
    updateLastFed,
  ]);

  useEffect(() => {
    setModalIsVisible(visible);
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <Dialog
        visible={modalIsVisible}
        onDismiss={() => {
          setModalIsVisible(false);
          onClose();
        }}
        style={{ borderRadius: 20, backgroundColor: colors.surface }}
      >
        <Dialog.Title>Choisir un aliment</Dialog.Title>
        <Dialog.Content>
          <View>
            {food?.map((foodItem) => (
              <View
                key={foodItem.id}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox.Android
                  status={
                    selectedFood?.id === foodItem.id ? "checked" : "unchecked"
                  }
                  onPress={() =>
                    setSelectedFood((prev) =>
                      prev?.id === foodItem.id ? null : foodItem,
                    )
                  }
                />
                <Button
                  mode="text"
                  textColor={colors.onSurface}
                  onPress={() =>
                    setSelectedFood((prev) =>
                      prev?.id === foodItem.id ? null : foodItem,
                    )
                  }
                >
                  {foodItem.name} - {foodItem.quantity}{" "}
                  {foodItem.unit || "restant(s)"}
                </Button>
              </View>
            ))}
            <TextInput
              placeholder="Quantité"
              value={foodQuantity.toString()}
              onChangeText={(text) => {
                const number = parseInt(text, 10);
                setFoodQuantity(isNaN(number) ? 1 : number);
              }}
              keyboardType="numeric"
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setModalIsVisible(false);
              setSelectedFood(null);
              onClose();
            }}
          >
            Annuler
          </Button>
          <Button
            onPress={() => {
              handleNourrissage();
              onClose();
            }}
          >
            Confirmer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default FeedPortal;
