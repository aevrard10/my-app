import QueriesKeys from "@shared/declarations/queriesKeys";
import { useQuery } from "@tanstack/react-query";
import { getReptileFeedings } from "@shared/local/reptileFeedingsStore";
import { LocalReptileFeeding } from "@shared/local/reptileFeedingsStore";

const useReptileFeedingsQuery = (reptileId: string, limit = 50) =>
  useQuery<LocalReptileFeeding[]>({
    queryKey: [QueriesKeys.REPTILE_FEEDINGS, reptileId, limit],
    queryFn: () => getReptileFeedings(reptileId, { limit }),
  });

export default useReptileFeedingsQuery;
