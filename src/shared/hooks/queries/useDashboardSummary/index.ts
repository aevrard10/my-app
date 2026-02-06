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

const useDashboardSummaryQuery = Object.assign(
  () =>
    useQuery<DashboardSummary>({
      queryKey,
      queryFn: async () => {
        const reptiles = await getReptiles();
        const events = (await getReptileEvents()) ?? [];

        const today = dayjs().format("YYYY-MM-DD");

        const toMillis = (value?: string) =>
          value ? dayjs(value).valueOf() : 0;

        const eventsToday = events.filter(
          (e) => dayjs(e.event_date || "").format("YYYY-MM-DD") === today,
        );

        const upcoming_events = events
          .filter((e) => toMillis(e.event_date) >= dayjs().valueOf())
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
  { queryKey }
);

export default useDashboardSummaryQuery;
