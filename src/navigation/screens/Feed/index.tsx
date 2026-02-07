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
import { execute, executeVoid } from "@shared/local/db";
import { useQuery } from "@tanstack/react-query";
import { List } from "react-native-paper";

const Feed = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data, isPending: isFoodLoading, refetch } = useFoodQuery();
  console.log("Stock data:", data); // Log pour vérifier les données du stock
  const { data: usageData, isPending: isUsageLoading } = useQuery({
    queryKey: ["stock-forecast"],
    queryFn: async () => {
      // consommation des 30 derniers jours sur les reptiles (hors stock)
      const rows = await execute(
        `SELECT food_name as name,
                type,
                ABS(SUM(quantity)) as qty_30d
         FROM feedings
         WHERE reptile_id <> 'stock'
           AND fed_at >= date('now','-30 day')
         GROUP BY food_name, type;`,
      );
      return rows as { name: string; qty_30d: number; type: string | null }[];
    },
    staleTime: 1000 * 60 * 5,
  });
  const updateStockMutation = useMutation({
    mutationFn: async (vars: {
      name: string;
      delta: number;
      unit?: string | null;
      type?: string | null;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      await executeVoid(
        `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, type, fed_at, notes)
         VALUES (?,?,?,?,?,?,?,?);`,
        [
          id,
          "stock",
          vars.name,
          vars.delta,
          vars.unit ?? null,
          vars.type ?? null,
          new Date().toISOString(),
          "stock update",
        ],
      );
      return { id };
    },
  });
  const deleteStockMutation = useMutation({
    mutationFn: async (vars: { name: string; unit?: string | null; type?: string | null }) => {
      // Supprime toutes les entrées stock pour cet aliment (même type/unit)
      await executeVoid(
        `DELETE FROM feedings WHERE reptile_id='stock' AND food_name=? AND (unit IS ? OR unit=?) AND (type IS ? OR type=?)`,
        [vars.name, vars.unit ?? null, vars.unit ?? null, vars.type ?? null, vars.type ?? null],
      );
      return { success: true };
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

  const forecast = useMemo(() => {
    const items = data ?? [];
    const usage = usageData ?? [];
    return items.map((item) => {
      const usageItem = usage.find(
        (u) => u.name === item.name && (u.type ?? null) === (item.type ?? null),
      );
      const daily = usageItem ? usageItem.qty_30d / 30 : 0;
      const rawDays = daily > 0 ? item.quantity / daily : Infinity;
      const daysLeft =
        rawDays === Infinity ? Infinity : Math.max(0, Math.ceil(rawDays)); // arrondi supérieur
      return {
        name: item.name,
        type: item.type ?? null,
        daysLeft,
        quantity: item.quantity,
        unit: item.unit,
        daily,
      };
    });
  }, [data, usageData]);
  const isInitialLoading = isFoodLoading && (!data || data.length === 0);
  const skeletonItems = useMemo(
    () => Array.from({ length: 3 }, (_, index) => ({ id: `sk-${index}` })),
    [],
  );

  const queryClient = useQueryClient();
  const handleUpdateStock = useCallback(
    (
      name: string,
      delta: number,
      unit?: string | null,
      type?: string | null,
    ) => {
      updateStockMutation.mutate(
        { name, delta, unit, type },
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
  const handleDeleteStock = useCallback(
    (name: string, unit?: string | null, type?: string | null) => {
      deleteStockMutation.mutate(
        { name, unit, type },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: useFoodQuery.queryKey });
            queryClient.invalidateQueries({ queryKey: useFoodStockHistoryQuery.queryKey });
            show("Aliment supprimé");
          },
          onError: () => show("Impossible de supprimer cet aliment"),
        },
      );
    },
    [deleteStockMutation, queryClient, show],
  );

  return (
    <Screen>
      <FlatList
        ListEmptyComponent={
          isInitialLoading ? null : (
            <ListEmptyComponent isLoading={isFoodLoading} />
          )
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
              handleDelete={(name, unit, type) =>
                handleDeleteStock(name, unit, type)
              }
              colors={colors}
            />
          )
        }
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <CardSurface
              style={{ marginTop: 4, marginBottom: 12, padding: 12 }}
            >
              <Text variant="titleLarge">Stock alimentaire</Text>
              <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
                Ajustez rapidement les quantités et suivez l&apos;historique.
              </Text>
            </CardSurface>

            <CardSurface style={{ marginBottom: 12, paddingVertical: 0 }}>
              <List.Section style={{ margin: 0 }}>
                <List.Accordion
                  title="Actions rapides"
                  titleStyle={{ fontWeight: "700" }}
                  style={{ backgroundColor: colors.surfaceVariant }}
                  left={(props) => (
                    <List.Icon {...props} icon="lightning-bolt" />
                  )}
                >
                  <View style={{ flexDirection: "row", gap: 10, padding: 12 }}>
                    <View
                      style={{
                        flex: 1,
                        minWidth: 120,
                        borderRadius: 14,
                        padding: 12,
                        backgroundColor: colors.secondaryContainer,
                      }}
                    >
                      <Icon
                        source="archive"
                        size={16}
                        color={colors.secondary}
                      />
                      {isFoodLoading ? (
                        <Skeleton
                          height={18}
                          width={36}
                          style={{ marginTop: 6 }}
                        />
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
                        <Skeleton
                          height={18}
                          width={36}
                          style={{ marginTop: 6 }}
                        />
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
                </List.Accordion>

                <List.Accordion
                  title="Prévision stock (30 jours)"
                  titleStyle={{ fontWeight: "700" }}
                  style={{ backgroundColor: colors.surfaceVariant }}
                  left={(props) => <List.Icon {...props} icon="chart-line" />}
                >
                  {isFoodLoading || isUsageLoading ? (
                    <Skeleton
                      height={18}
                      width={120}
                      style={{ marginTop: 8 }}
                    />
                  ) : forecast.length === 0 ? (
                    <Text style={{ opacity: 0.7, marginTop: 6, padding: 12 }}>
                      Pas assez de données de consommation pour prévoir.
                    </Text>
                  ) : (
                    forecast.map((f) => (
                      <View
                        key={f.name}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderBottomWidth: 0.5,
                          borderColor: colors.outlineVariant,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text variant="bodyMedium">{f.name}</Text>
                          <Text variant="labelSmall" style={{ opacity: 0.65 }}>
                            Stock : {f.quantity} {f.unit || ""} · Conso/j :
                            {f.daily ? ` ${f.daily.toFixed(2)}` : " —"}
                          </Text>
                        </View>
                        <Text
                          variant="labelLarge"
                          style={{
                            color:
                              f.daysLeft === Infinity
                                ? colors.outline
                                : f.daysLeft <= 7
                                  ? colors.error
                                  : colors.primary,
                          }}
                        >
                          {f.daysLeft === Infinity
                            ? "—"
                            : f.daysLeft > 60
                              ? ">60 j"
                              : `${f.daysLeft} j`}
                        </Text>
                      </View>
                    ))
                  )}
                </List.Accordion>
              </List.Section>
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
