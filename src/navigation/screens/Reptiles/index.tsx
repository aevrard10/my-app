import {
  FlatList,
  StyleSheet,
  View,
  Platform,
  RefreshControl,
} from "react-native";
import {
  FAB,
  Portal,
  Searchbar,
  useTheme,
  Text,
} from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import ScreenNames from "@shared/declarations/screenNames";

import useSearchFilter from "@shared/hooks/useSearchFilter";
import React, { useMemo, useState } from "react";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import ReptileCardSkeleton from "./components/ReptileCardSkeleton";

const Reptiles = () => {
  const { navigate } = useNavigation();
  const { data, isPending: isLoading, refetch } = useReptilesQuery();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [filteredData] = useSearchFilter(
    data ?? [],
    searchText,
    ["name", "species"],
    undefined,
    3
  );
  const isInitialLoading = isLoading && (!data || data.length === 0);
  const skeletonItems = useMemo(
    () => Array.from({ length: 3 }, (_, index) => ({ id: `sk-${index}` })),
    []
  );
  return (
    <Screen>
      <Portal.Host>
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={isInitialLoading ? skeletonItems : filteredData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) =>
            isInitialLoading ? (
              <ReptileCardSkeleton />
            ) : (
              <Animated.View
                entering={Platform.select({
                  android: SlideInDown,
                  default: FadeInDown,
                }).delay(index * 50)}
                key={item?.id}
              >
                <CardComponent item={item} />
              </Animated.View>
            )
          }
          ListEmptyComponent={
            isInitialLoading ? null : <ListEmptyComponent isLoading={isLoading} />
          }
          ListHeaderComponent={
            <CardSurface style={styles.headerCard}>
              <Text style={styles.headerTitle} variant="titleLarge">
                Mes reptiles
              </Text>
              <Text style={styles.headerSubtitle} variant="bodySmall">
                Retrouvez l&apos;ensemble de vos reptiles et leurs détails.
              </Text>
              <Searchbar
                elevation={0}
                mode="bar"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Rechercher un reptile"
                clearButtonMode="always"
                style={styles.searchbar}
                inputStyle={styles.searchInput}
              />
            </CardSurface>
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
        <FAB
          theme={{ colors: { primaryContainer: colors.primary } }}
          variant="primary"
          color="#fff"
          icon="plus"
          style={styles.fab}
          onPress={() => navigate(ScreenNames.ADD_REPTILE)}
        />
      </Portal.Host>
    </Screen>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  summaryCard: {
    marginTop: 4,
    marginBottom: 12,
    gap: 12,
  },
  quickActionsCard: {
    marginTop: 4,
    marginBottom: 12,
    gap: 10,
  },
  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    minWidth: 120,
    borderRadius: 16,
    padding: 12,
  },
  quickActionContent: {
    gap: 8,
  },
  quickActionText: {
    opacity: 0.9,
  },
  summaryHeader: {
    gap: 4,
  },
  summarySubtitle: {
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flex: 1,
    minWidth: 90,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
    alignItems: "flex-start",
  },
  statValue: {
    marginTop: 6,
  },
  statLabel: {
    opacity: 0.7,
  },
  summaryError: {
    marginTop: 6,
    opacity: 0.7,
  },
  upcomingSection: {
    gap: 6,
  },
  upcomingList: {
    gap: 8,
  },
  upcomingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  upcomingText: {
    flex: 1,
  },
  upcomingMeta: {
    opacity: 0.6,
    marginTop: 2,
  },
  upcomingEmpty: {
    opacity: 0.6,
  },
  headerCard: {
    marginTop: 4,
    marginBottom: 12,
    gap: 12,
  },
  headerTitle: {
    paddingLeft: 0,
  },
  headerSubtitle: {
    opacity: 0.6,
    marginTop: 4,
  },
  searchbar: {
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  searchInput: {
    fontSize: 14,
  },
});

export { Reptiles };
