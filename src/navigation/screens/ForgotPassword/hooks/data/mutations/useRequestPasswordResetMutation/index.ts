import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

const mutation = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
      resetToken
    }
  }
`;

const useRequestPasswordResetMutation = () => {
  return useMutation<any, { email: string }>({
    mutation,
  });
};

export default useRequestPasswordResetMutation;
