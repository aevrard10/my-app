import { FC, useCallback, useState } from "react";
import useUpdateFoodStock from "../../../Feed/hooks/data/mutations/useUpdateFoodStock";
import useLastFedUpdateMutation from "../../hooks/data/mutations/useLastFedUpdate";
import { useQueryClient } from "@tanstack/react-query";
import useReptileQuery from "../../../Reptiles/hooks/queries/useReptileQuery";
import useFoodQuery from "../../../Feed/hooks/data/queries/useStockQuery";
import { useSnackbar } from "@rn-flix/snackbar";
import { Button, Checkbox, Dialog, Portal, useTheme } from "react-native-paper";
import { View } from "react-native";
import TextInput from "@shared/components/TextInput";
import QueriesKeys from "@shared/declarations/queriesKeys";
import useAddReptileFeedingMutation from "../../hooks/data/mutations/useAddReptileFeedingMutation";
type FeedPortalProps = {
  id: string;
  data: any;
  food: any;
};
const FeedPortal: FC<FeedPortalProps> = (props) => {
  const { id, data, food } = props;
  const [selectedFood, setSelectedFood] = useState<any | null>(null); // Pour gérer l'aliment sélectionné
  const [foodQuantity, setFoodQuantity] = useState(1); // Quantité de base (pour chaque aliment)
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { mutate: updateLastFed } = useLastFedUpdateMutation();
  const { mutate: addFeeding } = useAddReptileFeedingMutation();
  const { mutate: updateStock } = useUpdateFoodStock(); // Utilisation de la mutation
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { colors } = useTheme();
  const handleNourrissage = useCallback(() => {
    if (selectedFood) {
      // Mettre à jour le nourrissage et le stock pour chaque aliment sélectionné
      updateLastFed(
        { id, last_fed: new Date().toISOString().split("T")[0] }, // Format YYYY-MM-DD
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: useReptileQuery.queryKey(id),
            });
            show("Nourrissage enregistré");

            // Mettre à jour le stock pour chaque aliment
            updateStock(
              {
                input: {
                  food_id: selectedFood?.id,
                  quantity_change: -foodQuantity, // Réduire la quantité dans le stock
                  reason: `Nourrissage de ${data?.name}`,
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: useFoodQuery.queryKey,
                  });
                  addFeeding(
                    {
                      input: {
                        reptile_id: id,
                        food_id: selectedFood?.id,
                        food_name: selectedFood?.name,
                        quantity: foodQuantity,
                        unit: selectedFood?.unit || "restant(s)",
                        fed_at: new Date().toISOString(),
                        notes: `Nourrissage de ${data?.name}`,
                      },
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: [QueriesKeys.REPTILE_FEEDINGS, id],
                        });
                      },
                    },
                  );
                  setModalIsVisible(false);
                },
                onError: () => {
                  show("Erreur lors de la mise à jour du stock");
                },
              },
            );
          },
          onError: () => {
            show("Erreur lors de l'enregistrement du nourrissage");
          },
        },
      );
    } else {
      show("Veuillez sélectionner au moins un aliment.");
    }
  }, [
    id,
    selectedFood,
    foodQuantity,
    updateLastFed,
    updateStock,
    queryClient,
    show,
  ]);
  return (
    <>
      <Button
        mode="contained"
        onPress={() => setModalIsVisible(true)}
        style={{ marginTop: 8 }}
      >
        Nourrissage
      </Button>
      {/* Afficher un modal ou un sélecteur pour choisir l'aliment */}
      <Portal>
        <Dialog
          visible={modalIsVisible}
          onDismiss={() => setModalIsVisible(false)}
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
                    } // Vérification si cet aliment est sélectionné
                    onPress={() => {
                      // Si cet aliment est déjà sélectionné, le désélectionner
                      if (selectedFood?.id === foodItem.id) {
                        setSelectedFood(null); // Désélectionner l'aliment
                      } else {
                        setSelectedFood(foodItem); // Sélectionner un seul aliment
                      }
                    }}
                  />
                  <Button
                    mode="text"
                    textColor={colors.onSurface}
                    onPress={() => {
                      // Si cet aliment est déjà sélectionné, le désélectionner
                      if (selectedFood?.id === foodItem.id) {
                        setSelectedFood(null); // Désélectionner l'aliment
                      } else {
                        setSelectedFood(foodItem); // Sélectionner un seul aliment
                      }
                    }}
                  >
                    {foodItem.name} - {foodItem.quantity}{" "}
                    {foodItem.unit || "restant(s)"}
                  </Button>
                </View>
              ))}
              <TextInput
                placeholder="Quantité (par aliment)"
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
              }}
            >
              Annuler
            </Button>
            <Button onPress={handleNourrissage}>Confirmer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default FeedPortal;
