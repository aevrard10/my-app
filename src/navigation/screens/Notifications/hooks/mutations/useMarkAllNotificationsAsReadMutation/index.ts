import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type MarkAllNotificationsAsReadMutation = {
  markAllNotificationsAsRead: { id: number; read?: boolean | null }[];
};

const mutation = gql`
  mutation MarkAllNotificationsAsReadMutation {
    markAllNotificationsAsRead {
      id
      read
    }
  }
`;

const useMarkAllNotificationsAsReadMutation = () => {
  return useMutation<MarkAllNotificationsAsReadMutation, void>({
    mutation,
  });
};

export default useMarkAllNotificationsAsReadMutation;
