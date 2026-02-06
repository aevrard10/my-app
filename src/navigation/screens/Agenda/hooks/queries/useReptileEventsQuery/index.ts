import QueriesKeys from "@shared/declarations/queriesKeys";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getReptileEvents, LocalReptileEvent } from "@shared/local/reptileEventsStore";

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

// Modified hook with transformation logic
const useReptileEventsQuery = Object.assign(
  () =>
    useQuery<
      Record<
        string,
        {
          id: string;
          name: string;
          time: string;
          notes?: string;
          date: string;
          recurrence_type?: string;
          recurrence_interval?: number;
          recurrence_until?: string;
        }[]
      >
    >({
      queryKey,
      queryFn: async () => {
        const events = await getReptileEvents();
        return events.reduce((acc, event) => {
          const formattedDate = formatDate(event.event_date);
          const formattedTime = formatTime(event.event_time || "");
          const item = {
            id: event.id,
            name: event.event_name,
            time: formattedTime,
            notes: event.notes || "",
            date: formattedDate,
            recurrence_type: event.recurrence_type,
            recurrence_interval: event.recurrence_interval,
            recurrence_until: event.recurrence_until,
          };
          if (!acc[formattedDate]) acc[formattedDate] = [];
          acc[formattedDate].push(item);
          return acc;
        }, {} as Record<string, LocalReptileEvent[]>);
      },
    }),
  { queryKey }
);

export default useReptileEventsQuery;
