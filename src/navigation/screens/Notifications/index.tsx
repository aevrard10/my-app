import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import NotifItem from "./components/NotifItem";
import useGetNotificationsQuery from "./hooks/queries/GetNotificationsQuery";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import Screen from "@shared/components/Screen";
import { Button, Text, useTheme } from "react-native-paper";
import useMarkAllNotificationsAsReadMutation from "./hooks/mutations/useMarkAllNotificationsAsReadMutation";
import { useQueryClient } from "@tanstack/react-query";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
import NotifItemSkeleton from "./components/NotifItemSkeleton";

const renderItem = ({ item }) => <NotifItem item={item} />;

const Notifications = () => {
  const { colors } = useTheme();
  const { data, isPending, refetch } = useGetNotificationsQuery();
  const queryClient = useQueryClient();
  const { mutate, isPending: isMarking } =
    useMarkAllNotificationsAsReadMutation();
  const unreadCount = data?.filter((notif) => !notif.read).length ?? 0;
  const isInitialLoading = isPending && (!data || data.length === 0);
  const skeletonItems = useMemo(
    () => Array.from({ length: 4 }, (_, index) => ({ id: `sk-${index}` })),
    []
  );

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: useGetNotificationsQuery.queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: useDashboardSummaryQuery.queryKey,
        });
      },
    });
  };
  return (
    <Screen>
      <FlatList
        data={isInitialLoading ? skeletonItems : data}
        renderItem={
          isInitialLoading ? () => <NotifItemSkeleton /> : renderItem
        }
        keyExtractor={(item) => String(item.id)}
        refreshing={isPending}
        onRefresh={refetch}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text variant="titleLarge">Notifications</Text>
                <Text variant="bodySmall" style={styles.headerSubtitle}>
                  Restez informé des rappels et événements importants.
                </Text>
              </View>
              <Button
                mode="outlined"
                compact
                onPress={handleMarkAllAsRead}
                loading={isMarking}
                disabled={unreadCount === 0 || isMarking}
                style={styles.markAllButton}
                textColor={colors.primary}
              >
                Tout lire
              </Button>
            </View>
            {unreadCount > 0 ? (
              <Text variant="labelSmall" style={styles.unreadBadge}>
                {unreadCount} non lues
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
