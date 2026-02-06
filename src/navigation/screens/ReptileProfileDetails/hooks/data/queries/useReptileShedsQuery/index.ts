import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

type ReptileShed = {
  id: string;
  reptile_id: string;
  shed_date: string;
  notes?: string | null;
  created_at: string;
};

type ReptileShedsQuery = {
  reptileSheds: ReptileShed[];
};

const query = gql`
  query ReptileShedsQuery($reptile_id: ID!) {
    reptileSheds(reptile_id: $reptile_id) {
      id
      reptile_id
      shed_date
      notes
      created_at
    }
  }
`;

const useReptileShedsQuery = (reptileId: string) => {
  return useQuery<
    ReptileShedsQuery,
    { reptile_id: string },
    ReptileShed[]
  >({
    queryKey: [QueriesKeys.REPTILE_SHEDS, reptileId],
    query,
    variables: { reptile_id: reptileId },
    options: {
      select: (data) => data?.reptileSheds ?? [],
    },
  });
};

export default useReptileShedsQuery;
