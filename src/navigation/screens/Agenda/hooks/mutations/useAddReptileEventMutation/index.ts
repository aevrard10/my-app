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
    reptile_id?: string | null;
    reptile_name?: string | null;
    reptile_image_url?: string | null;
  };
};

const useAddReptileEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: AddReptileEventMutationVariables) =>
      upsertReptileEvent(variables.input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES_EVENTS] });
      return data;
    },
  });
};

export default useAddReptileEventMutation;
