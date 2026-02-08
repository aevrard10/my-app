import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptileEvents } from "@shared/local/reptileEventsStore";

export type LocalNotificationItem = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  event_date: string;
  event_time?: string | null;
  event_type?: string | null;
  reptile_name?: string | null;
  reptile_image_url?: string | null;
  reminder_minutes?: number | null;
};

const parseExcludedDates = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const expandRecurrence = (event: any, horizonDays = 60) => {
  const occurrences: any[] = [];
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
      occurrences.push({ ...event, event_date: dateKey });
    }
    if (type === "DAILY") current = current.add(interval, "day");
    else if (type === "WEEKLY") current = current.add(interval, "week");
    else if (type === "MONTHLY") current = current.add(interval, "month");
    else break;
  }
  return occurrences;
};

const computeNotificationDate = (event: any) => {
  const date = event.event_date || dayjs().format("YYYY-MM-DD");
  const time = event.event_time || "09:00";
  const [h, m] = time.split(":");
  let dt = dayjs(date)
    .hour(Number(h) || 9)
    .minute(Number(m) || 0)
    .second(0);
  const reminder = Number(event.reminder_minutes ?? 0);
  if (Number.isFinite(reminder) && reminder > 0) {
    dt = dt.subtract(reminder, "minute");
  }
  return dt;
};

const useLocalNotificationsQuery = Object.assign(
  () =>
    useQuery<LocalNotificationItem[]>({
      queryKey: [QueriesKeys.LOCAL_NOTIFICATIONS],
      queryFn: async () => {
        const events = await getReptileEvents({ limit: 5000, offset: 0 });
        const expanded = events.flatMap((ev) => expandRecurrence(ev, 90));
        const start = dayjs().subtract(7, "day");
        const end = dayjs().add(7, "day");

        const items = expanded
          .map((event) => {
            const notifDate = computeNotificationDate(event);
            if (!notifDate.isValid()) return null;
            if (notifDate.isBefore(start) || notifDate.isAfter(end)) return null;
            const id = `${event.id}-${event.event_date}`;
            const title = event.event_name || "Événement";
            const message = event.reptile_name
              ? `${event.reptile_name} · ${event.notes || ""}`.trim()
              : event.notes || title;
            return {
              id,
              title,
              message,
              created_at: notifDate.toISOString(),
              event_date: event.event_date,
              event_time: event.event_time,
              event_type: event.event_type,
              reptile_name: event.reptile_name,
              reptile_image_url: event.reptile_image_url,
              reminder_minutes: event.reminder_minutes ?? 0,
            } as LocalNotificationItem;
          })
          .filter(Boolean) as LocalNotificationItem[];

        return items.sort((a, b) =>
          dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf(),
        );
      },
      staleTime: 1000 * 60 * 5,
    }),
  { queryKey: [QueriesKeys.LOCAL_NOTIFICATIONS] },
);

export default useLocalNotificationsQuery;
