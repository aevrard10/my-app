import { FlatList, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Chip,
  Icon,
  useTheme,
} from "react-native-paper";

import useFoodStockHistoryQuery from "./hooks/data/queries/useStockQuery";
import getFoodIcon from "../Feed/utils/getFoodIcon";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";

const FeedHistory = () => {
  const { colors } = useTheme();
  const { data, isPending } = useFoodStockHistoryQuery();

  if (isPending) {
    return <ActivityIndicator />;
  }

  return (

        <FlatList
          data={data}
          ListEmptyComponent={<ListEmptyComponent isLoading={isPending} />}
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
              <View style={{ margin: 16 }} key={food.id}>
                <Card>
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
                          margin: 9,
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

  );
};

export default FeedHistory;
