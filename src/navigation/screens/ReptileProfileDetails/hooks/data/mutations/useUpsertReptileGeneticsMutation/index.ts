import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type UpsertReptileGeneticsMutation = {
  upsertReptileGenetics: {
    id: string;
    reptile_id: string;
  };
};

type UpsertReptileGeneticsVariables = {
  input: {
    reptile_id: string;
    morph?: string;
    mutations?: string;
    hets?: string;
    traits?: string;
    lineage?: string;
    breeder?: string;
    hatch_date?: string;
    sire_name?: string;
    dam_name?: string;
    notes?: string;
  };
};

const mutation = gql`
  mutation UpsertReptileGeneticsMutation($input: ReptileGeneticsInput!) {
    upsertReptileGenetics(input: $input) {
      id
      reptile_id
    }
  }
`;

const useUpsertReptileGeneticsMutation = () => {
  return useMutation<
    UpsertReptileGeneticsMutation,
    UpsertReptileGeneticsVariables
  >({
    mutation,
  });
};

export default useUpsertReptileGeneticsMutation;
