import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertReptileEvent } from "@shared/local/reptileEventsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

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

const useUpdateReptileEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateReptileEventMutationVariables) =>
      upsertReptileEvent({ id: variables.id, ...variables.input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES_EVENTS] });
    },
  });
};

export default useUpdateReptileEventMutation;
