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
