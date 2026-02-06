import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type AddReptileShedMutation = {
  addReptileShed: {
    id: string;
    reptile_id: string;
  };
};

type AddReptileShedVariables = {
  input: {
    reptile_id: string;
    shed_date: string;
    notes?: string;
  };
};

const mutation = gql`
  mutation AddReptileShedMutation($input: AddReptileShedInput!) {
    addReptileShed(input: $input) {
      id
      reptile_id
    }
  }
`;

const useAddReptileShedMutation = () => {
  return useMutation<AddReptileShedMutation, AddReptileShedVariables>({
    mutation,
  });
};

export default useAddReptileShedMutation;
