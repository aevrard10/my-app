import QueriesKeys from "@shared/declarations/queriesKeys";
import { useQuery } from "@tanstack/react-query";
import {
  getReptileHealthEvents,
  LocalReptileHealthEvent,
} from "@shared/local/reptileHealthStore";

const useReptileHealthEventsQuery = (reptileId: string, limit = 50) =>
  useQuery<LocalReptileHealthEvent[]>({
    queryKey: [QueriesKeys.REPTILE_HEALTH, reptileId, limit],
    queryFn: () => getReptileHealthEvents(reptileId, { limit }),
  });

export default useReptileHealthEventsQuery;
