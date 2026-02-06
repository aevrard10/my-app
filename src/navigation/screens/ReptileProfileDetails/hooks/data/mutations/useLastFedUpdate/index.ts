import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReptileFields } from "@shared/local/reptileStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useLastFedUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, last_fed }: { id: string; last_fed: string }) =>
      updateReptileFields(id, { last_fed }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE, variables.id],
      });
    },
  });
};

export default useLastFedUpdateMutation;
