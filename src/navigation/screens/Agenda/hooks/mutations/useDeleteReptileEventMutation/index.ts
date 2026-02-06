import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptileEvent } from "@shared/local/reptileEventsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useDeleteReptileEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteReptileEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKeys.REPTILES_EVENTS] });
    },
  });
};

export default useDeleteReptileEventMutation;
