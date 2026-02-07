import QueriesKeys from "@shared/declarations/queriesKeys";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
  getReptileEvents,
  LocalReptileEvent,
} from "@shared/local/reptileEventsStore";

const queryKey = [QueriesKeys.REPTILES_EVENTS];

// Helper functions to format date and time
const formatDate = (value: string): string => {
  if (!value) {
    return dayjs().format("YYYY-MM-DD");
  }

  if (/^\d+$/.test(value)) {
    const numeric = Number(value);
    const ms = value.length <= 10 ? numeric * 1000 : numeric;
    return dayjs(ms).format("YYYY-MM-DD");
  }

  const normalized = value.replace(/\//g, "-");
  const parsed = dayjs(normalized);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
};

const formatTime = (time: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const parsed = dayjs()
    .hour(Number(hours ?? 0))
    .minute(Number(minutes ?? 0));
  return parsed.format("HH:mm");
};

type AgendaEventItem = {
  id: string;
  name: string;
  type?: string | null;
  time: string;
  notes?: string;
  date: string;
  recurrence_type?: string;
  recurrence_interval?: number;
  recurrence_until?: string;
  reptile_id?: string | null;
  reptile_name?: string | null;
  reptile_image_url?: string | null;
  reminder_minutes?: number | null;
  priority?: string | null;
};

// Modified hook with transformation logic
const parseExcludedDates = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const expandRecurrence = (
  event: LocalReptileEvent,
  horizonDays = 90,
): LocalReptileEvent[] => {
  const occurrences: LocalReptileEvent[] = [];
  const interval = event.recurrence_interval || 1;
  const type = (event.recurrence_type || "NONE").toUpperCase();
  const start = dayjs(event.event_date);
  const until = event.recurrence_until
    ? dayjs(event.recurrence_until)
    : start.add(horizonDays, "day");
  const excluded = parseExcludedDates(event.excluded_dates);

  let current = start;
  while (current.isBefore(until) || current.isSame(until, "day")) {
    const dateKey = current.format("YYYY-MM-DD");
    if (!excluded.includes(dateKey)) {
      occurrences.push({
        ...event,
        event_date: dateKey,
      });
    }
    if (type === "DAILY") {
      current = current.add(interval, "day");
    } else if (type === "WEEKLY") {
      current = current.add(interval, "week");
    } else if (type === "MONTHLY") {
      current = current.add(interval, "month");
    } else {
      break; // NONE
    }
    if (type === "NONE") break;
  }

  return occurrences;
};

const useReptileEventsQuery = Object.assign(
  () =>
    useQuery<Record<string, AgendaEventItem[]>>({
      queryKey,
      queryFn: async () => {
        const events = await getReptileEvents();
        const expanded = events.flatMap((ev) => expandRecurrence(ev));
        return expanded.reduce((acc, event) => {
          const formattedDate = formatDate(event.event_date);
          const formattedTime = formatTime(event.event_time || "");
          const item: AgendaEventItem = {
            id: event.id,
            name: event.event_name,
            type: event.event_type ?? null,
            time: formattedTime,
            notes: event.notes || "",
            date: formattedDate,
            recurrence_type: event.recurrence_type,
            recurrence_interval: event.recurrence_interval,
            recurrence_until: event.recurrence_until,
            reptile_id: event.reptile_id,
            reptile_name: event.reptile_name,
            reptile_image_url: event.reptile_image_url,
            reminder_minutes: event.reminder_minutes ?? 0,
            priority: event.priority ?? "NORMAL",
          };
          if (!acc[formattedDate]) acc[formattedDate] = [];
          acc[formattedDate].push(item);
          return acc;
        }, {} as Record<string, AgendaEventItem[]>);
      },
      staleTime: 1000 * 60 * 5,
    }),
  { queryKey }
);

export default useReptileEventsQuery;
