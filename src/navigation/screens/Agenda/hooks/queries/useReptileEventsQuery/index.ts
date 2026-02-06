import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  ReptileEventQuery,
  ReptileEventQueryVariables,
} from "@shared/graphql/utils/types/types.generated";
import QueriesKeys from "@shared/declarations/queriesKeys";
import dayjs from "dayjs";

const query = gql`
  query ReptileEventQuery {
    reptileEvent {
      id
      event_date
      event_name
      event_time
      notes
      recurrence_type
      recurrence_interval
      recurrence_until
    }
  }
`;
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
  () => {
    return useQuery<
      ReptileEventQuery,
      ReptileEventQueryVariables,
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
      query,
      options: {
        select: (data: ReptileEventQuery) => {
          // Transform the response into the desired format
          return data?.reptileEvent?.reduce((acc, event) => {
            const formattedDate = formatDate(event.event_date);
            const formattedTime = formatTime(event.event_time);
            const item = {
              id: event?.id,
              name: event?.event_name,
              time: formattedTime,
              notes: event?.notes,
              date: formattedDate,
              recurrence_type: event?.recurrence_type,
              recurrence_interval: event?.recurrence_interval,
              recurrence_until: event?.recurrence_until,
            };

            if (!acc[formattedDate]) {
              acc[formattedDate] = [];
            }
            acc[formattedDate].push(item);

            return acc;
          }, {} as Record<string, { name: string; time: string }[]>);
        },
      },
    });
  },
  { query, queryKey }
);

export default useReptileEventsQuery;
