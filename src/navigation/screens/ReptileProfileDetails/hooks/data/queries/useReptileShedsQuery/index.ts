import QueriesKeys from "@shared/declarations/queriesKeys";
import { useQuery } from "@tanstack/react-query";
import { getReptileSheds, LocalReptileShed } from "@shared/local/reptileShedsStore";

const useReptileShedsQuery = (reptileId: string, limit = 50) =>
  useQuery<LocalReptileShed[]>({
    queryKey: [QueriesKeys.REPTILE_SHEDS, reptileId, limit],
    queryFn: () => getReptileSheds(reptileId, { limit }),
  });

export default useReptileShedsQuery;
