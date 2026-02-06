import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

const mutation = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
      token
      user {
        id
        email
        username
      }
    }
  }
`;

const useResetPasswordMutation = () => {
  return useMutation<any, { input: { token: string; newPassword: string } }>(
    {
      mutation,
    }
  );
};

export default useResetPasswordMutation;
