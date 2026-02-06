import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

type ReptileFeeding = {
  id: string;
  reptile_id: string;
  food_id?: string | null;
  food_name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  fed_at: string;
  notes?: string | null;
  created_at: string;
};

type ReptileFeedingsQuery = {
  reptileFeedings: ReptileFeeding[];
};

const query = gql`
  query ReptileFeedingsQuery($reptile_id: ID!) {
    reptileFeedings(reptile_id: $reptile_id) {
      id
      reptile_id
      food_id
      food_name
      quantity
      unit
      fed_at
      notes
      created_at
    }
  }
`;

const useReptileFeedingsQuery = (reptileId: string) => {
  return useQuery<
    ReptileFeedingsQuery,
    { reptile_id: string },
    ReptileFeeding[]
  >({
    queryKey: [QueriesKeys.REPTILE_FEEDINGS, reptileId],
    query,
    variables: { reptile_id: reptileId },
    options: {
      select: (data) => data?.reptileFeedings ?? [],
    },
  });
};

export default useReptileFeedingsQuery;
