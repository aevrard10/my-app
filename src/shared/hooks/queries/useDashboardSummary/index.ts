import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptiles } from "@shared/local/reptileStore";
import { getReptileEvents } from "@shared/local/reptileEventsStore";
import dayjs from "dayjs";

export type DashboardSummary = {
  reptiles_count: number;
  events_today: number;
  unread_notifications: number;
  upcoming_events: {
    id: string;
    event_date: string;
    event_name: string;
    event_time: string;
    notes?: string;
  }[];
};

const queryKey = [QueriesKeys.DASHBOARD_SUMMARY];

// Normalise différentes formes de dates (YYYY-MM-DD, timestamp, 06/02/2026…)
const parseDate = (value?: string | number | null) => {
  if (value === null || value === undefined) return null;
  // numérique ?
  if (typeof value === "number") {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }
  const raw = `${value}`.trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    const num = Number(raw);
    const ms = raw.length <= 10 ? num * 1000 : num;
    const d = dayjs(ms);
    return d.isValid() ? d : null;
  }
  const normalized = raw.replace(/\//g, "-");
  const d = dayjs(normalized);
  return d.isValid() ? d : null;
};

const useDashboardSummaryQuery = Object.assign(
  () =>
    useQuery<DashboardSummary>({
      queryKey,
      queryFn: async () => {
        const reptiles = await getReptiles();
        const events = (await getReptileEvents()) ?? [];

        const today = dayjs().format("YYYY-MM-DD");
        const todayStart = dayjs().startOf("day").valueOf();

        const toMillis = (value?: string | number | null) => {
          const d = parseDate(value);
          return d ? d.valueOf() : -Infinity;
        };

        const eventsToday = events.filter((e) => {
          const d = parseDate(e.event_date);
          return d?.format("YYYY-MM-DD") === today;
        });
        const upcoming_events = events
          .filter((e) => toMillis(e.event_date) >= todayStart)
          .sort((a, b) => toMillis(a.event_date) - toMillis(b.event_date))
          .slice(0, 5)
          .map((e) => ({
            id: e.id,
            event_date: e.event_date,
            event_name: e.event_name,
            event_time: e.event_time || "",
            notes: e.notes || "",
          }));

        return {
          reptiles_count: reptiles.length,
          events_today: eventsToday.length,
          unread_notifications: 0,
          upcoming_events,
        };
      },
      staleTime: 1000 * 60 * 2,
    }),
  { queryKey },
);

export default useDashboardSummaryQuery;
