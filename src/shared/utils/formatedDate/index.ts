import dayjs, { Dayjs } from "dayjs";
import calendar from "dayjs/plugin/calendar";
import "dayjs/locale/fr";
export type DateFormatInput = string | number | Date | Dayjs | null | undefined;

dayjs.extend(calendar);
dayjs.locale("fr");

/**
 * @example
 * formatDDMMYYYY('2022-08-01 14:31:47') // => '01/08/2022'
 * @param date
 */
export function formatDDMMYYYY(date?: DateFormatInput) {
  // Si le timestamp est en secondes, multipliez-le par 1000
  const timestamp =
    typeof date === "number" && date.toString().length <= 10
      ? date * 1000
      : date;
  return dayjs(timestamp).format("DD/MM/YYYY");
}

export function formatYYYYMMDD(date?: DateFormatInput) {
  // Si le timestamp est en secondes, multipliez-le par 1000
  const timestamp =
    typeof date === "number" && date.toString().length <= 10
      ? date * 1000
      : date;
  return dayjs(timestamp).format("YYYY/MM/DD");
}

export const formatTime = ({
  hours,
  minutes,
  seconds,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}) => {
  const timeParts = [];

  if (hours !== undefined) {
    timeParts.push(hours.toString().padStart(2, "0"));
  }
  if (minutes !== undefined) {
    timeParts.push(minutes.toString().padStart(2, "0"));
  }
  if (seconds !== undefined) {
    timeParts.push(seconds.toString().padStart(2, "0"));
  }

  return timeParts.join(":");
};
/** @example
 * // 1) À l'instant    ( en dessous de 1min exclus )
 * // 2) Hier 09:12     ( hier, peu importe le différentiel )
 * // 3) Il y a 1 min   ( de 1min inclus à 60min exclus )
 * // 4) Il y a 1 h     ( de 1h inclus à 4h exclus )
 * // 5) lun. 01:30     ( de 4h inclus à 7j exclus )
 * // 6) 13/02/2022     ( au delà de 7j inclus )
 * @param date
 */
export function notificationsMultiFormat(date: DateFormatInput) {
  if (!date) {
    return "";
  }

  const diffSeconds = dayjs().diff(date, "seconds");

  if (diffSeconds < 60) {
    return "À l'instant";
  }

  const formattedDate = dayjs(date).format("DD/MM/YYYY");
  const HHmm = dayjs(date).format("HH:mm");
  if (formattedDate === dayjs().subtract(1, "day").format("DD/MM/YYYY")) {
    return "Hier " + HHmm;
  }

  const diffMinutes = dayjs().diff(date, "minutes");
  if (diffMinutes < 60) {
    return "Il y a " + diffMinutes + " min";
  }

  const diffHours = dayjs().diff(date, "hours");
  if (diffHours < 4) {
    return "Il y a " + diffHours + " h";
  }

  const diffDays = dayjs().diff(date, "days");
  if (diffDays < 1) {
    return HHmm;
  }

  const ddd = dayjs(date).format("ddd");
  if (diffDays < 7) {
    return ddd + " " + HHmm;
  }

  return formattedDate;
}
