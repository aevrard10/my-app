import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertReptileEvent } from "@shared/local/reptileEventsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

type AddReptileEventMutationVariables = {
  input: {
    event_name: string;
    event_date: string;
    event_time: string;
    recurrence_type: string;
    recurrence_interval: number;
    recurrence_until?: string | null;
    notes?: string | null;
  };
};

const useAddReptileEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: AddReptileEventMutationVariables) =>
      upsertReptileEvent(variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES_EVENTS] });
    },
  });
};

export default useAddReptileEventMutation;
