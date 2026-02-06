import QueriesKeys from "@shared/declarations/queriesKeys";
import { useQuery } from "@tanstack/react-query";
import { getReptilePhotos } from "@shared/local/reptilePhotosStore";
import { LocalReptilePhoto } from "@shared/local/reptilePhotosStore";

const useReptilePhotosQuery = (reptileId: string) =>
  useQuery<LocalReptilePhoto[]>({
    queryKey: [QueriesKeys.REPTILE, reptileId, "photos"],
    queryFn: () => getReptilePhotos(reptileId),
  });

export default useReptilePhotosQuery;
