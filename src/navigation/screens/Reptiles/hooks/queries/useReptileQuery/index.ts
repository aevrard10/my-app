import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptile } from "@shared/local/reptileStore";

const queryKey = (id: string) => [QueriesKeys.REPTILE, id];

const useReptileQuery = Object.assign(
  (id: string) =>
    useQuery({
      queryKey: queryKey(id),
      queryFn: () => getReptile(id),
      placeholderData: (prev) => prev,
      staleTime: 1000 * 60 * 2,
    }),
  { queryKey },
);

export default useReptileQuery;
