import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import { FAB, Text, useTheme, Icon } from "react-native-paper";
import useFoodQuery from "./hooks/data/queries/useStockQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "@rn-flix/snackbar";
import useFoodStockHistoryQuery from "../FeedHistory/hooks/data/queries/useStockQuery";
import FeedCard from "./components/FeedCard";
import FeedCardSkeleton from "./components/FeedCardSkeleton";
import HistoryChip from "./components/HistoryChip";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Skeleton from "@shared/components/Skeleton";
import { FlatList, View } from "react-native";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { executeVoid } from "@shared/local/db";

const Feed = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data, isPending: isFoodLoading, refetch } = useFoodQuery();
  const updateStockMutation = useMutation({
    mutationFn: async (vars: {
      name: string;
      delta: number;
      unit?: string | null;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      await executeVoid(
        `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, fed_at, notes)
         VALUES (?,?,?,?,?,?,?);`,
        [
          id,
          "stock",
          vars.name,
          vars.delta,
          vars.unit ?? null,
          new Date().toISOString(),
          "stock update",
        ],
      );
      return { id };
    },
  });
  const { show } = useSnackbar();
  const stockStats = useMemo(() => {
    const items = data ?? [];
    const lowStock = items.filter((item) => item.quantity <= 3).length;
    return {
      total: items.length,
      lowStock,
    };
  }, [data]);
  const isInitialLoading = isFoodLoading && (!data || data.length === 0);
  const skeletonItems = useMemo(
    () => Array.from({ length: 3 }, (_, index) => ({ id: `sk-${index}` })),
    []
  );

  const queryClient = useQueryClient();
  const handleUpdateStock = useCallback(
    (name: string, delta: number, unit?: string | null) => {
      updateStockMutation.mutate(
        { name, delta, unit },
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
        },
      );
    },
    [updateStockMutation, queryClient, show],
  );

  return (
    <Screen>
      <FlatList
        ListEmptyComponent={
          isInitialLoading ? null : <ListEmptyComponent isLoading={isFoodLoading} />
        }
        data={isInitialLoading ? skeletonItems : data}
        renderItem={({ item }) =>
          isInitialLoading ? (
            <FeedCardSkeleton />
          ) : (
            <FeedCard
              food={item}
              isLoading={updateStockMutation.isPending}
              handleUpdateStock={handleUpdateStock}
              colors={colors}
            />
          )
        }
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
              <Text variant="titleLarge">Stock alimentaire</Text>
              {isFoodLoading ? (
                <Skeleton height={12} width="70%" style={{ marginTop: 8 }} />
              ) : (
                <Text
                  variant="bodySmall"
                  style={{ opacity: 0.7, marginTop: 4 }}
                >
                  Ajustez rapidement les quantités et suivez l&apos;historique.
                </Text>
              )}
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
                  {isFoodLoading ? (
                    <Skeleton height={18} width={36} style={{ marginTop: 6 }} />
                  ) : (
                    <Text variant="titleMedium" style={{ marginTop: 6 }}>
                      {stockStats.total}
                    </Text>
                  )}
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
                  {isFoodLoading ? (
                    <Skeleton height={18} width={36} style={{ marginTop: 6 }} />
                  ) : (
                    <Text variant="titleMedium" style={{ marginTop: 6 }}>
                      {stockStats.lowStock}
                    </Text>
                  )}
                  <Text variant="labelSmall" style={{ opacity: 0.7 }}>
                    Faible stock
                  </Text>
                </View>
              </View>
              {/* Prévision stock retirée en mode local */}
            </CardSurface>
            <HistoryChip navigate={navigate} colors={colors} />
          </>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshing={isFoodLoading}
        onRefresh={refetch}
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
