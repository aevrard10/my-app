import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

type ReptilePhoto = {
  id: string;
  reptile_id: string;
  url: string;
  created_at: string;
};

type ReptilePhotosQuery = {
  reptilePhotos: ReptilePhoto[];
};

const query = gql`
  query ReptilePhotosQuery($reptile_id: ID!) {
    reptilePhotos(reptile_id: $reptile_id) {
      id
      reptile_id
      url
      created_at
    }
  }
`;

const useReptilePhotosQuery = (reptileId: string) => {
  return useQuery<ReptilePhotosQuery, { reptile_id: string }, ReptilePhoto[]>({
    queryKey: [QueriesKeys.REPTILE, reptileId, "photos"],
    query,
    variables: { reptile_id: reptileId },
    options: {
      select: (data) => data?.reptilePhotos ?? [],
    },
  });
};

export default useReptilePhotosQuery;
