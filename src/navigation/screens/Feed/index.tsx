import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Card,
  Chip,
  FAB,
  Icon,
  ProgressBar,
  useTheme,
  Button,
} from "react-native-paper";
import useFoodQuery from "./hooks/data/queries/useStockQuery";
import useUpdateFoodStock from "./hooks/data/mutations/useUpdateFoodStock"; // Import de la mutation
import getFoodIcon from "./utils/getFoodIcon";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useSnackbar } from "@rn-flix/snackbar";
import TextInput from "@shared/components/TextInput";
import useFoodStockHistoryQuery from "../FeedHistory/hooks/data/queries/useStockQuery";

const Feed = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data } = useFoodQuery();
  const { mutate: updateStock, isPending: isLoading } = useUpdateFoodStock(); // Utilisation de la mutation
  const { show } = useSnackbar();
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();
  const handleUpdateStock = useCallback(
    (foodId, change, reason) => {
      updateStock(
        {
          input: {
            food_id: foodId,
            quantity_change: change,
            reason: reason,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: useFoodQuery.queryKey,
            });
            queryClient.invalidateQueries({
              queryKey: useFoodStockHistoryQuery.queryKey,
            });
            show("Stock mis à jour avec succès");
          },
          onError: (error) => {
            show("Une erreur s'est produite");
            console.error("Erreur lors de la mise à jour du stock :", error);
          },
        }
      );
    },
    [updateStock, queryClient, show]
  );

  return (
    <>
      <ScrollView>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Chip
        onPress={() => navigate(ScreenNames.FEED_HISTORY)}
          icon="food-drink"
          style={{
            margin: 16,
            backgroundColor: colors.primary,
          }}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
        >

          Historique des stocks
        </Chip>
        </View>
        {data?.map((food) => {
          const stockLow = food.quantity < 10;
          const stockCritical = food.quantity === 0;

          const progress = Math.min(
            Math.floor(food.quantity) / 100,
            1
          )?.toFixed(1); // Par exemple 100 comme valeur max

          console.log("progress", progress);

          return (
            <View style={{ margin: 16 }} key={food.id}>
              <Card>
                <Card.Title
                  title={food.name}
                  subtitle={food.type || "Nourriture"}
                  left={({ size }) => (
                    <Avatar.Icon
                      size={size}
                      icon={getFoodIcon(food.type)}
                      color="#fff"
                    />
                  )}
                  right={() => (
                    <Chip
                      icon={() => (
                        <Icon source={getFoodIcon(food.type)} size={16} color="white" />
                      )}
                      style={{
                        marginRight: 8,
                        backgroundColor: stockCritical
                          ? "darkred"
                          : stockLow
                          ? "red"
                          : "green",
                      }}
                      textStyle={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {food.quantity} {food.unit || "restant(s)"}
                    </Chip>
                  )}
                />
                <Card.Content>
                  <ProgressBar
                    progress={progress}
                    color={stockLow ? "red" : colors.primary}
                  />
                </Card.Content>
               

                <Card.Actions style={{ justifyContent: "space-between" }}>
                <TextInput
                  label="Quantité"
                  keyboardType="numeric"
                  value={String(quantity)}
                  onChangeText={(text) => setQuantity(parseInt(text) || 1)}  // Mettre à jour la quantité
                  style={{ margin: 16 , backgroundColor: colors.surface}}
                />
                  <Button
                    mode="contained"
                    disabled={food.quantity === 0 || isLoading}
                    onPress={() => handleUpdateStock(food.id, -quantity, `Mise à jour de ${food.name}`)}
                    >
                    -
                  </Button>
                  <Button
                    mode="contained"
                    disabled={isLoading}
                    onPress={() => handleUpdateStock(food.id, quantity, `Ajout de ${food.name}`)}
                  >
                    +
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          );
        })}
      </ScrollView>

      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        color="#fff"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => navigate(ScreenNames.ADD_FEED)}
      />
    </>
  );
};

export default Feed;
