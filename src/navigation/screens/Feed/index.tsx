import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import { FAB, Text, useTheme, Icon } from "react-native-paper";
import useFoodQuery from "./hooks/data/queries/useStockQuery";
import useUpdateFoodStock from "./hooks/data/mutations/useUpdateFoodStock"; // Import de la mutation
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "@rn-flix/snackbar";
import useFoodStockHistoryQuery from "../FeedHistory/hooks/data/queries/useStockQuery";
import FeedCard from "./components/FeedCard";
import HistoryChip from "./components/HistoryChip";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import { FlatList, View } from "react-native";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";

const Feed = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data } = useFoodQuery();
  const { mutate: updateStock, isPending: isLoading } = useUpdateFoodStock(); // Utilisation de la mutation
  const { show } = useSnackbar();
  const [quantity, setQuantity] = useState(1);
  const stockStats = useMemo(() => {
    const items = data ?? [];
    const lowStock = items.filter((item) => item.quantity <= 3).length;
    return {
      total: items.length,
      lowStock,
    };
  }, [data]);

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
    <Screen>
      <FlatList
        ListEmptyComponent={<ListEmptyComponent isLoading={isLoading} />}
        data={data}
        renderItem={({ item }) => (
          <FeedCard
            food={item}
            isLoading={isLoading}
            handleUpdateStock={handleUpdateStock}
            quantity={quantity}
            setQuantity={setQuantity}
            colors={colors}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
              <Text variant="titleLarge">Stock alimentaire</Text>
              <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
                Ajustez rapidement les quantités et suivez l&apos;historique.
              </Text>
            </CardSurface>
            <CardSurface style={{ marginBottom: 12 }}>
              <Text variant="labelLarge">Aperçu rapide</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    minWidth: 120,
                    borderRadius: 14,
                    padding: 12,
                    backgroundColor: colors.secondaryContainer,
                  }}
                >
                  <Icon source="archive" size={16} color={colors.secondary} />
                  <Text variant="titleMedium" style={{ marginTop: 6 }}>
                    {stockStats.total}
                  </Text>
                  <Text variant="labelSmall" style={{ opacity: 0.7 }}>
                    Articles
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    minWidth: 120,
                    borderRadius: 14,
                    padding: 12,
                    backgroundColor: colors.primaryContainer,
                  }}
                >
                  <Icon source="alert" size={16} color={colors.primary} />
                  <Text variant="titleMedium" style={{ marginTop: 6 }}>
                    {stockStats.lowStock}
                  </Text>
                  <Text variant="labelSmall" style={{ opacity: 0.7 }}>
                    Faible stock
                  </Text>
                </View>
              </View>
            </CardSurface>
            <HistoryChip navigate={navigate} colors={colors} />
          </>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
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
    </Screen>
  );
};

export default Feed;
