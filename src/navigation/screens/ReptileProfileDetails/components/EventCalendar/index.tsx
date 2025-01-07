import { FC } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Card } from "react-native-paper";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

type EventCalendarProps = {
  onDayPress: (day: any) => void;
  markedDates: any;
};
const EventCalendar: FC<EventCalendarProps> = (props) => {
  const { onDayPress, markedDates } = props;
  return (
    <Card style={{ margin: 20 }}>
      <Calendar
        current={new Date()}
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
    </Card>
  );
};

export default EventCalendar;
