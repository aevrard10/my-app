import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type AddReptileFeedingMutation = {
  addReptileFeeding: {
    id: string;
    reptile_id: string;
  };
};

type AddReptileFeedingVariables = {
  input: {
    reptile_id: string;
    food_id?: string;
    food_name?: string;
    quantity?: number;
    unit?: string;
    fed_at: string;
    notes?: string;
  };
};

const mutation = gql`
  mutation AddReptileFeedingMutation($input: AddReptileFeedingInput!) {
    addReptileFeeding(input: $input) {
      id
      reptile_id
    }
  }
`;

const useAddReptileFeedingMutation = () => {
  return useMutation<AddReptileFeedingMutation, AddReptileFeedingVariables>({
    mutation,
  });
};

export default useAddReptileFeedingMutation;
