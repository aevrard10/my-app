import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

type ReptileGenetics = {
  id: string;
  reptile_id: string;
  morph?: string | null;
  mutations?: string | null;
  hets?: string | null;
  traits?: string | null;
  lineage?: string | null;
  breeder?: string | null;
  hatch_date?: string | null;
  sire_name?: string | null;
  dam_name?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

type ReptileGeneticsQuery = {
  reptileGenetics: ReptileGenetics | null;
};

const query = gql`
  query ReptileGeneticsQuery($reptile_id: ID!) {
    reptileGenetics(reptile_id: $reptile_id) {
      id
      reptile_id
      morph
      mutations
      hets
      traits
      lineage
      breeder
      hatch_date
      sire_name
      dam_name
      notes
      created_at
      updated_at
    }
  }
`;

const useReptileGeneticsQuery = (reptileId: string) => {
  return useQuery<
    ReptileGeneticsQuery,
    { reptile_id: string },
    ReptileGenetics | null
  >({
    queryKey: [QueriesKeys.REPTILE_GENETICS, reptileId],
    query,
    variables: { reptile_id: reptileId },
    options: {
      select: (data) => data?.reptileGenetics ?? null,
    },
  });
};

export default useReptileGeneticsQuery;
