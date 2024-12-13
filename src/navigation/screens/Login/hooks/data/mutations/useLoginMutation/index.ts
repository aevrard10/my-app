import useMutation from "@shared/graphql/useMutation";
import {
  LoginMutation,
  LoginMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { gql } from "graphql-request";
const mutation = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
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
const useLoginMutation = () => {
  return useMutation<LoginMutation, LoginMutationVariables>({
    mutation,
  });
};

export default useLoginMutation;
