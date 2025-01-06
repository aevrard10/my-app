import useMutation from "@shared/graphql/useMutation";
import {
  RegisterMutation,
  RegisterMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";
const mutation = gql`
  mutation RegisterMutation($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      token
      user {
        id
        username
        email
      }
    }
  }
`;
const useRegisterMutation = () => {
  return useMutation<RegisterMutation, RegisterMutationVariables>({
    mutation,
  });
};

export default useRegisterMutation;
