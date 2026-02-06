import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptiles } from "@shared/local/reptileStore";

const queryKey = [QueriesKeys.REPTILES];

const useReptilesQuery = Object.assign(
  () =>
    useQuery({
      queryKey,
      queryFn: () => getReptiles(),
    }),
  { queryKey },
);

export default useReptilesQuery;
