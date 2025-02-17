import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import { ScrollView } from "react-native";
import {
  FAB,
  useTheme,
} from "react-native-paper";
import useFoodQuery from "./hooks/data/queries/useStockQuery";
import useUpdateFoodStock from "./hooks/data/mutations/useUpdateFoodStock"; // Import de la mutation
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useSnackbar } from "@rn-flix/snackbar";
import useFoodStockHistoryQuery from "../FeedHistory/hooks/data/queries/useStockQuery";
import FeedCard from "./components/FeedCard";
import HistoryChip from "./components/HistoryChip";

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
        <HistoryChip navigate={navigate} colors={colors} />
        {data?.map((food) => {
          return (
            <FeedCard
              food={food}
              isLoading={isLoading}
              handleUpdateStock={handleUpdateStock}
              quantity={quantity}
              setQuantity={setQuantity}
              colors={colors}
            />
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
