import useMutation from "@shared/graphql/useMutation";
import {
  RemoveReptileMutation,
  RemoveReptileMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";
const mutation = gql`
  mutation RemoveReptileMutation($id: ID!) {
    deleteReptile(id: $id) {
      success
      message
    }
  }
`;
const useRemoveReptileMutation = () => {
  return useMutation<RemoveReptileMutation, RemoveReptileMutationVariables>({
    mutation,
  });
};

export default useRemoveReptileMutation;
