import useMutation from "@shared/graphql/useMutation";
import { UpdateReptileMutation, UpdateReptileMutationVariables } from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";

const mutation = gql`
  mutation UpdateReptileMutation($id: ID!, $input: ReptileInput!) {
    updateReptile(id: $id, input: $input) {
      success
      message
    }
  }
`;
const useUpdateReptileMutation = () => {
  return useMutation<UpdateReptileMutation, UpdateReptileMutationVariables>({
    mutation,
  });
};

export default useUpdateReptileMutation;
