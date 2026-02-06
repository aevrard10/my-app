import dayjs, { Dayjs } from "dayjs";
import calendar from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/fr";
export type DateFormatInput = string | number | Date | Dayjs | null | undefined;

dayjs.extend(calendar);
dayjs.extend(customParseFormat);
dayjs.locale("fr");

const strictFormats = [
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY/MM/DDTHH:mm:ss",
  "DD/MM/YYYY",
  "DD-MM-YYYY",
  "DD/MM/YYYY HH:mm:ss",
  "DD-MM-YYYY HH:mm:ss",
];

const month: Record<string, string> = {
  janvier: "01",
  février: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  août: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  décembre: "12",
};

const parseLongFrenchDate = (value: string) => {
  const cleaned = value
    .replace(",", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const parts = cleaned.split(" ");
  if (parts.length < 4) return null;

  const dayNumber = parts[1];
  const monthName = parts[2];
  const year = parts[3];

  if (!/^\d{1,2}$/.test(dayNumber) || !/^\d{4}$/.test(year)) {
    return null;
  }

  const monthIndex = month[monthName];
  if (!monthIndex) return null;

  return dayjs(
    new Date(Number(year), Number(monthIndex) - 1, Number(dayNumber))
  );
};

const parseDateInput = (date?: DateFormatInput) => {
  if (!date) return null;

  if (typeof date === "string") {
    const trimmed = date.trim();
    if (!trimmed) return null;

    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      const ms = trimmed.length <= 10 ? numeric * 1000 : numeric;
      return dayjs(ms);
    }

    const strictParsed = dayjs(trimmed, strictFormats, "fr", true);
    if (strictParsed.isValid()) {
      return strictParsed;
    }

    const longParsed = parseLongFrenchDate(trimmed);
    if (longParsed) {
      return longParsed;
    }

    return dayjs(trimmed);
  }

  if (typeof date === "number") {
    const ms = date.toString().length <= 10 ? date * 1000 : date;
    return dayjs(ms);
  }

  return dayjs(date);
};

/**
 * @example
 * formatDDMMYYYY('2022-08-01 14:31:47') // => '01/08/2022'
 * @param date
 */
export function formatDDMMYYYY(date?: DateFormatInput) {
  const parsed = parseDateInput(date);
  return parsed ? parsed.format("DD/MM/YYYY") : "";
}

export function formatYYYYMMDD(date?: DateFormatInput) {
  const parsed = parseDateInput(date);
  return parsed ? parsed.format("YYYY-MM-DD") : "";
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
  const parsed = parseDateInput(date);
  if (!parsed) {
    return "";
  }

  const diffSeconds = dayjs().diff(parsed, "seconds");

  if (diffSeconds < 60) {
    return "À l'instant";
  }

  const formattedDate = parsed.format("DD/MM/YYYY");
  const HHmm = parsed.format("HH:mm");
  if (formattedDate === dayjs().subtract(1, "day").format("DD/MM/YYYY")) {
    return "Hier " + HHmm;
  }

  const diffMinutes = dayjs().diff(parsed, "minutes");
  if (diffMinutes < 60) {
    return "Il y a " + diffMinutes + " min";
  }

  const diffHours = dayjs().diff(parsed, "hours");
  if (diffHours < 4) {
    return "Il y a " + diffHours + " h";
  }

  const diffDays = dayjs().diff(parsed, "days");
  if (diffDays < 1) {
    return HHmm;
  }

  const ddd = parsed.format("ddd");
  if (diffDays < 7) {
    return ddd + " " + HHmm;
  }

  return formattedDate;
}


export function formatDateToYYYYMMDD(dateStr: string): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  const matchYMD = trimmed.match(/^(\d{4})[/-](\d{2})[/-](\d{2})/);
  if (matchYMD) {
    return `${matchYMD[1]}-${matchYMD[2]}-${matchYMD[3]}`;
  }
  const matchDMY = trimmed.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (matchDMY) {
    return `${matchDMY[3]}-${matchDMY[2]}-${matchDMY[1]}`;
  }
  const longParsed = parseLongFrenchDate(trimmed);
  if (longParsed && longParsed.isValid()) {
    return longParsed.format("YYYY-MM-DD");
  }
  return trimmed;
}

// format date "samedi 15 février 2025" => "2025-02-15"
export const formatLongDateToYYYYMMDD = (date: string) => {
  if (!date) return "";
  const parsed = parseLongFrenchDate(date);
  if (!parsed || !parsed.isValid()) return "";
  return parsed.format("YYYY-MM-DD");
};
