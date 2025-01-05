import { View } from "react-native";
import { Agenda as RNCAgenda } from "react-native-calendars";
import React, { useState } from "react";
import { Text, useTheme } from "react-native-paper";
import EmptyList from "@shared/components/EmptyList";
import useReptileEventsQuery from "./hooks/queries/useReptileEventsQuery";
// const DEFAULT_ITEMS = {
//   "2024-12-15": [{ name: "Nettoyage du terrarium", time: "10:00 AM" }],
//   "2024-12-16": [
//     { name: "Vérification de la température", time: "9:00 AM" },
//     { name: "Nourrir Python royal", time: "6:00 PM" },
//   ],
//   "2024-12-17": [{ name: "Observation comportementale", time: "3:00 PM" }],
//   "2024-12-18": [
//     { name: "Contrôle de l'humidité", time: "10:00 AM" },
//     { name: "Réunion vétérinaire : Gecko léopard", time: "4:00 PM" },
//   ],
//   "2024-12-19": [
//     { name: "Nourrir Boa constrictor", time: "8:00 AM" },
//     { name: "Changement du substrat", time: "2:00 PM" },
//   ],
//   "2024-12-20": [
//     { name: "Contrôle de l'éclairage UVB", time: "9:00 AM" },
//     { name: "Observation : Tortue de Hermann", time: "3:00 PM" },
//   ],
//   "2024-12-21": [
//     { name: "Nourrir Dragon barbu", time: "7:00 PM" },
//     { name: "Contrôle des équipements", time: "11:00 AM" },
//   ],
//   "2024-12-22": [
//     { name: "Nettoyage du terrarium", time: "10:00 AM" },
//     { name: "Observation comportementale", time: "3:00 PM" },
//     { name: "Nourrir Serpent des blés", time: "6:00 PM" },
//   ],
//   "2024-12-23": [
//     { name: "Changement de l'eau", time: "9:00 AM" },
//     { name: "Révision des équipements", time: "1:00 PM" },
//   ],
//   "2024-12-24": [
//     { name: "Contrôle de l'humidité", time: "8:00 AM" },
//     { name: "Vérification de la santé : Gecko à crête", time: "4:00 PM" },
//   ],
//   "2024-12-25": [
//     { name: "Nourrir Tortue aquatique", time: "9:00 AM" },
//     { name: "Observation comportementale", time: "5:00 PM" },
//   ],
//   "2024-12-26": [
//     { name: "Nettoyage général", time: "10:00 AM" },
//     { name: "Réunion vétérinaire : Python royal", time: "3:00 PM" },
//   ],
//   "2024-12-27": [
//     { name: "Nourrir Caméléon panthère", time: "8:00 AM" },
//     { name: "Changement du substrat", time: "2:00 PM" },
//   ],
// };

const Agenda = () => {
  const { data, isLoading } = useReptileEventsQuery();
  console.log("test", data);
  const [items, setItems] = useState(data);
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
        items={items}
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
