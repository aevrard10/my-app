import useMutation from "@shared/graphql/useMutation";
import {
  AddReptilesMutation,
  AddReptilesMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";
const mutation = gql`
  mutation addReptilesMutation($input: AddReptileInput!) {
    addReptile(input: $input) {
      name
    }
  }
`;
const useAddReptilesMutation = () => {
  return useMutation<AddReptilesMutation, AddReptilesMutationVariables>({
    mutation,
  });
};

export default useAddReptilesMutation;
