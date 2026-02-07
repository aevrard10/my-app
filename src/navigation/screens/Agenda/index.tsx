import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React from "react";
import { FAB, useTheme, Text } from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";
import AgendaItem from "./components/AgendaItem";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import { useNavigation } from "@react-navigation/native";
import AgendaSkeleton from "./components/AgendaSkeleton";
import { useI18n } from "@shared/i18n";
import ScreenNames from "@shared/declarations/screenNames";

const Agenda = () => {
  const navigation = useNavigation();
  const { data, isPending: isLoading, refetch } = useReptileEventsQuery();
  const { t } = useI18n();
  const { colors } = useTheme();
  const customTheme = {
    agendaDayTextColor: colors.primary,
    agendaDayNumColor: colors.primary,
    agendaTodayColor: colors.primary,
    agendaKnobColor: colors.outlineVariant ?? colors.outline,
    calendarBackground: colors.surface,
    backgroundColor: "transparent",
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.onPrimary,
    todayBackgroundColor: colors.primaryContainer,
    todayTextColor: colors.primary,
    dotColor: colors.tertiary,
    selectedDotColor: colors.onPrimary,
    monthTextColor: colors.onSurface,
    dayTextColor: colors.onSurface,
    textSectionTitleColor: colors.secondary,
    textDisabledColor: colors.outline,
    arrowColor: colors.primary,
  };
  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge">{t("agenda.title")}</Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          {t("agenda.subtitle")}
        </Text>
      </View>
      {isLoading && (!data || Object.keys(data).length === 0) ? (
        <AgendaSkeleton />
      ) : (
        <CardSurface style={styles.calendarCard}>
          <RNCAgenda
            displayLoadingIndicator={isLoading}
            items={data}
            onRefresh={refetch}
            refreshing={isLoading}
            showWeekNumbers={false}
            renderEmptyData={() => <EmptyList />}
            theme={customTheme}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    ScreenNames.EVENT_DETAILS as never,
                    {
                      id: item.id,
                      date: item.date,
                    } as never,
                  )
                }
              >
                <AgendaItem item={item} />
              </TouchableOpacity>
            )}
          />
        </CardSurface>
      )}
      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color={colors.primaryContainer}
        icon="plus"
        color="#fff"
        style={styles.fab}
        onPress={() => navigation.navigate(ScreenNames.ADD_EVENT as never)}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  header: {
    marginTop: 4,
    marginBottom: 12,
    gap: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  calendarCard: {
    flex: 1,
    padding: 0,
    overflow: "hidden",
  },
  verticleLine: {
    height: "70%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: 1,
    backgroundColor: "rgb(202, 196, 208)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default Agenda;
