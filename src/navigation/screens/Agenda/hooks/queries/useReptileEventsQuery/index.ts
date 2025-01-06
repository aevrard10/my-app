import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import {
  ReptileEventQuery,
  ReptileEventQueryVariables,
} from "@shared/graphql/utils/types/types.generated";

const query = gql`
  query ReptileEventQuery {
    reptileEvent {
      id
      event_date
      event_name
      event_time
      notes
    }
  }
`;
const queryKey = ["reptileEvents"];

// Helper functions to format date and time
const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleTimeString("fr", options); // Adjust to preferred locale
};

// Modified hook with transformation logic
const useReptileEventsQuery = Object.assign(
  () => {
    return useQuery<
      ReptileEventQuery,
      ReptileEventQueryVariables,
      Record<string, { name: string; time: string }[]>
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
              name: event?.event_name,
              time: formattedTime,
              notes: event?.notes,
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
