import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptileEvent } from "@shared/local/reptileEventsStore";

const useReptileEventQuery = Object.assign(
  (id?: string) =>
    useQuery({
      queryKey: [QueriesKeys.REPTILES_EVENTS, id],
      queryFn: async () => {
        if (!id) return null;
        return getReptileEvent(id);
      },
      enabled: !!id,
    }),
  {
    queryKey: (id?: string) => [QueriesKeys.REPTILES_EVENTS, id],
  },
);

export default useReptileEventQuery;
