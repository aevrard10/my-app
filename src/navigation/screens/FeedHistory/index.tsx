import { FlatList, Platform, View } from "react-native";
import { Avatar, Card, Chip, Icon, useTheme, Text } from "react-native-paper";

import useFoodStockHistoryQuery from "./hooks/data/queries/useStockQuery";
import getFoodIcon from "../Feed/utils/getFoodIcon";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Screen from "@shared/components/Screen";
import FeedHistorySkeleton from "./components/FeedHistorySkeleton";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";
import { getFoodLabel, getFoodTypeLabel } from "@shared/constants/foodCatalog";

const FeedHistory = () => {
  const { colors } = useTheme();
  const { t, locale } = useI18n();
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
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={9}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === "android"}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
            <Text variant="titleLarge">{t("feed.history")}</Text>
            <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
              {t("feed.history_subtitle")}
            </Text>
          </CardSurface>
        }
        renderItem={({ item: food }) => {
          const parsed = food.date ? new Date(food.date) : null;
          const formattedDate =
            parsed && !Number.isNaN(parsed.getTime())
              ? parsed.toLocaleDateString(locale, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : t("common.date_unavailable");
          return (
            <View style={{ marginVertical: 10 }} key={food.id}>
              <Card style={{ borderRadius: 18, overflow: "hidden" }}>
                <Card.Title
                  title={formattedDate}
                  subtitle={
                    food.type
                      ? `${getFoodLabel(food.reason, t)} · ${getFoodTypeLabel(
                          food.type,
                          t,
                        )}`
                      : getFoodLabel(food.reason, t)
                  }
                  left={({ size }) => (
                    <Avatar.Icon
                      size={size}
                      icon={getFoodIcon(food.type || food.reason)}
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
                          source={getFoodIcon(food.type || food.reason)}
                          size={16}
                          color="white"
                        />
                      )}
                    >
                      {food.quantity_change} {food.unit || t("feed.unit_default")}
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
