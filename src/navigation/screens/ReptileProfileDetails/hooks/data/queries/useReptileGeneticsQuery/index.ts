import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptileGenetics } from "@shared/local/reptileGeneticsStore";

const useReptileGeneticsQuery = (reptileId: string) =>
  useQuery({
    queryKey: [QueriesKeys.REPTILE_GENETICS, reptileId],
    queryFn: () => getReptileGenetics(reptileId),
  });

export default useReptileGeneticsQuery;
