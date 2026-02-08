import React, { useMemo } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import NotifItem from "./components/NotifItem";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Screen from "@shared/components/Screen";
import { Button, Text, useTheme } from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
import NotifItemSkeleton from "./components/NotifItemSkeleton";
import { useI18n } from "@shared/i18n";
import useLocalNotificationsQuery from "./hooks/queries/useLocalNotificationsQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READ_KEY = "reptitrack_notifications_read";

const Notifications = () => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { data, isPending, refetch } = useLocalNotificationsQuery();
  const queryClient = useQueryClient();
  const [readMap, setReadMap] = React.useState<Record<string, boolean>>({});
  const unreadCount = data?.filter((notif) => !readMap[notif.id]).length ?? 0;
  const isInitialLoading = isPending && (!data || data.length === 0);
  const skeletonItems = useMemo(
    () => Array.from({ length: 4 }, (_, index) => ({ id: `sk-${index}` })),
    []
  );

  React.useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(READ_KEY);
      if (raw) {
        try {
          setReadMap(JSON.parse(raw));
        } catch {
          setReadMap({});
        }
      }
    })();
  }, []);

  const persistReadMap = async (map: Record<string, boolean>) => {
    setReadMap(map);
    await AsyncStorage.setItem(READ_KEY, JSON.stringify(map));
  };

  const markAllAsRead = async () => {
    if (!data || data.length === 0) return;
    const next: Record<string, boolean> = { ...readMap };
    data.forEach((item) => {
      next[item.id] = true;
    });
    await persistReadMap(next);
    queryClient.invalidateQueries({
      queryKey: useLocalNotificationsQuery.queryKey,
    });
  };

  const markOne = async (id: string) => {
    if (readMap[id]) return;
    const next = { ...readMap, [id]: true };
    await persistReadMap(next);
  };

  const viewData = (data ?? []).map((item) => ({
    ...item,
    read: !!readMap[item.id],
  }));

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    void markAllAsRead();
  };
  return (
    <Screen>
      <FlatList
        data={isInitialLoading ? skeletonItems : viewData}
        renderItem={
          isInitialLoading
            ? () => <NotifItemSkeleton />
            : ({ item }) => (
                <NotifItem item={item} onPress={() => markOne(item.id)} />
              )
        }
        keyExtractor={(item) => String(item.id)}
        refreshing={isPending}
        onRefresh={refetch}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={9}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === "android"}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text variant="titleLarge">{t("notifications.title")}</Text>
                <Text variant="bodySmall" style={styles.headerSubtitle}>
                  {t("notifications.subtitle")}
                </Text>
              </View>
              <Button
                mode="outlined"
                compact
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                style={styles.markAllButton}
                textColor={colors.primary}
              >
                {t("notifications.mark_all")}
              </Button>
            </View>
            {unreadCount > 0 ? (
              <Text variant="labelSmall" style={styles.unreadBadge}>
                {t("notifications.unread", { count: unreadCount })}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isInitialLoading ? null : <ListEmptyComponent isLoading={isPending} />
        }
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  header: {
    marginTop: 4,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  markAllButton: {
    borderRadius: 999,
  },
  unreadBadge: {
    marginTop: 8,
    opacity: 0.7,
  },
});

export default Notifications;
