import { FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Chip,
  Icon,
  useTheme,
  Text,
} from "react-native-paper";

import useFoodStockHistoryQuery from "./hooks/data/queries/useStockQuery";
import getFoodIcon from "../Feed/utils/getFoodIcon";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Screen from "@shared/components/Screen";

const FeedHistory = () => {
  const { colors } = useTheme();
  const { data, isPending } = useFoodStockHistoryQuery();

  if (isPending) {
    return (
      <Screen>
        <ActivityIndicator style={{ marginTop: 24 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={data}
        ListEmptyComponent={<ListEmptyComponent isLoading={isPending} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={{ marginTop: 4, marginBottom: 12 }}>
            <Text variant="titleLarge">Historique</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
              Toutes les variations de stock en un coup d&apos;œil.
            </Text>
          </View>
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

          return (
            <View style={{ marginVertical: 10 }} key={food.id}>
              <Card style={{ borderRadius: 18, overflow: "hidden" }}>
                <Card.Title
                  title={formattedDate}
                  subtitle={food.reason}
                  left={({ size }) => (
                    <Avatar.Icon
                      size={size}
                      icon={getFoodIcon("")}
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
