import { FlatList, View } from "react-native";
import { Avatar, Card, Chip, Icon, useTheme, Text } from "react-native-paper";

import useFoodStockHistoryQuery from "./hooks/data/queries/useStockQuery";
import getFoodIcon from "../Feed/utils/getFoodIcon";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Screen from "@shared/components/Screen";
import FeedHistorySkeleton from "./components/FeedHistorySkeleton";
import CardSurface from "@shared/components/CardSurface";

const FeedHistory = () => {
  const { colors } = useTheme();
  const { data, isPending } = useFoodStockHistoryQuery();

  const isInitialLoading = isPending && (!data || data.length === 0);

  return (
    <Screen>
      <FlatList
        data={isInitialLoading ? [] : data}
        ListEmptyComponent={
          isInitialLoading ? (
            <FeedHistorySkeleton />
          ) : (
            <ListEmptyComponent isLoading={isPending} />
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
            <Text variant="titleLarge">Historique</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
              Toutes les variations de stock en un coup d&apos;œil.
            </Text>
          </CardSurface>
        }
        renderItem={({ item: food }) => {
          const formattedDate = food.date
            ? new Date(Number(food.date)).toLocaleDateString("fr-FR", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : "Date non disponible";
          console.log("Food item:", food);
          return (
            <View style={{ marginVertical: 10 }} key={food.id}>
              <Card style={{ borderRadius: 18, overflow: "hidden" }}>
                <Card.Title
                  title={formattedDate}
                  subtitle={food.reason}
                  left={({ size }) => (
                    <Avatar.Icon
                      size={size}
                      icon={getFoodIcon(food.reason)}
                      color="#fff"
                    />
                  )}
                  right={() => (
                    <Chip
                      style={{
                        marginRight: 8,
                        backgroundColor: colors.primary,
                      }}
                      textStyle={{ color: "#fff", fontWeight: "bold" }}
                      icon={() => (
                        <Icon
                          source={getFoodIcon("")}
                          size={16}
                          color="white"
                        />
                      )}
                    >
                      {food.quantity_change} {"pcs"}
                    </Chip>
                  )}
                />
              </Card>
            </View>
          );
        }}
      />
    </Screen>
  );
};

export default FeedHistory;
