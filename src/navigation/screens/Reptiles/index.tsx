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
  Avatar,
  Text,
  Icon,
} from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import ScreenNames from "@shared/declarations/screenNames";

import useSearchFilter from "@shared/hooks/useSearchFilter";
import { useState } from "react";
import React from "react";
import useCurrentUserQuery from "@shared/hooks/queries/useCurrentUser";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";

const Reptiles = () => {
  const { navigate } = useNavigation();
  const { data, isPending: isLoading, refetch } = useReptilesQuery();
  const { data: summary } = useDashboardSummaryQuery();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [, user] = useCurrentUserQuery();
  const upcomingEvents = summary?.upcoming_events ?? [];
  const [filteredData] = useSearchFilter(
    data ?? [],
    searchText,
    ["name", "species"],
    undefined,
    3
  );
  return (
    <Screen>
      <Portal.Host>
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={Platform.select({
                android: SlideInDown,
                default: FadeInDown,
              }).delay(index * 50)}
              key={item?.id}
            >
              <CardComponent item={item} />
            </Animated.View>
          )}
          ListEmptyComponent={<ListEmptyComponent isLoading={isLoading} />}
          ListHeaderComponent={
            <>
              <CardSurface style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text variant="titleMedium">Aujourd&apos;hui</Text>
                  <Text variant="bodySmall" style={styles.summarySubtitle}>
                    Vos indicateurs clés en un coup d&apos;œil.
                  </Text>
                </View>
                <View style={styles.statsRow}>
                  <View
                    style={[
                      styles.statPill,
                      { backgroundColor: colors.secondaryContainer },
                    ]}
                  >
                    <Icon source="turtle" size={16} color={colors.secondary} />
                    <Text variant="titleMedium" style={styles.statValue}>
                      {summary?.reptiles_count ?? 0}
                    </Text>
                    <Text variant="labelSmall" style={styles.statLabel}>
                      Reptiles
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statPill,
                      { backgroundColor: colors.primaryContainer },
                    ]}
                  >
                    <Icon source="calendar" size={16} color={colors.primary} />
                    <Text variant="titleMedium" style={styles.statValue}>
                      {summary?.events_today ?? 0}
                    </Text>
                    <Text variant="labelSmall" style={styles.statLabel}>
                      Événements
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statPill,
                      { backgroundColor: colors.tertiaryContainer },
                    ]}
                  >
                    <Icon source="bell" size={16} color={colors.tertiary} />
                    <Text variant="titleMedium" style={styles.statValue}>
                      {summary?.unread_notifications ?? 0}
                    </Text>
                    <Text variant="labelSmall" style={styles.statLabel}>
                      Alertes
                    </Text>
                  </View>
                </View>
                <View style={styles.upcomingSection}>
                  <Text variant="labelLarge">Prochains événements</Text>
                  {upcomingEvents.length === 0 ? (
                    <Text variant="bodySmall" style={styles.upcomingEmpty}>
                      Aucun événement prévu pour le moment.
                    </Text>
                  ) : (
                    <View style={styles.upcomingList}>
                      {upcomingEvents.map((event) => {
                        const timeLabel = event.event_time
                          ? event.event_time.slice(0, 5)
                          : "";
                        return (
                          <View key={event.id} style={styles.upcomingItem}>
                            <View style={styles.upcomingDot} />
                            <View style={styles.upcomingText}>
                              <Text variant="bodyMedium">
                                {event.event_name}
                              </Text>
                              <Text
                                variant="bodySmall"
                                style={styles.upcomingMeta}
                              >
                                {formatDDMMYYYY(event.event_date)} · {timeLabel}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </CardSurface>
              <CardSurface style={styles.headerCard}>
                <View style={styles.headerRow}>
                  <Avatar.Icon size={40} icon="turtle" />
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText} variant="titleMedium">
                      Bonjour, @{user?.username} !
                    </Text>
                    <Text style={styles.headerSubtitle} variant="bodySmall">
                      Votre suivi quotidien en un coup d&apos;œil.
                    </Text>
                  </View>
                </View>
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
            </>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    paddingLeft: 0,
  },
  headerSubtitle: {
    opacity: 0.6,
    marginTop: 2,
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
