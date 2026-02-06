import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type UpdateReptileEventMutation = {
  updateReptileEvent: {
    id: string;
    event_name: string;
    event_date: string;
    event_time: string;
    notes?: string | null;
    recurrence_type?: string | null;
    recurrence_interval?: number | null;
    recurrence_until?: string | null;
  };
};

type UpdateReptileEventMutationVariables = {
  id: string;
  input: {
    event_name: string;
    event_date: string;
    event_time: string;
    notes?: string | null;
    recurrence_type?: string | null;
    recurrence_interval?: number | null;
    recurrence_until?: string | null;
  };
};

const mutation = gql`
  mutation UpdateReptileEventMutation(
    $id: ID!
    $input: UpdateReptileEventInput!
  ) {
    updateReptileEvent(id: $id, input: $input) {
      id
      event_name
      event_date
      event_time
      notes
      recurrence_type
      recurrence_interval
      recurrence_until
    }
  }
`;

const useUpdateReptileEventMutation = () => {
  return useMutation<
    UpdateReptileEventMutation,
    UpdateReptileEventMutationVariables
  >({
    mutation,
  });
};

export default useUpdateReptileEventMutation;
