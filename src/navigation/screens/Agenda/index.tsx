import { View } from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";

const Agenda = () => {
  const { data, isLoading } = useReptileEventsQuery();

  const { colors } = useTheme();
  const customTheme = {
    agendaDayTextColor: colors.primary, // Custom color for agenda day text
    agendaDayNumColor: colors.primary, // Custom color for agenda day number
    agendaTodayColor: colors.primary, // Custom color for today's agenda
  };
  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <RNCAgenda
        displayLoadingIndicator={isLoading}
        items={data}
        showWeekNumbers
        renderEmptyData={EmptyList}
        theme={customTheme}
        renderItem={(item) => (
          <View
            style={{
              marginVertical: 10,
              marginTop: 30,
              backgroundColor: "white",
              marginHorizontal: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Agenda;
