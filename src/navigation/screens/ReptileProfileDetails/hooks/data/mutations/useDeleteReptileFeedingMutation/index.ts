import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptileFeeding } from "@shared/local/reptileFeedingsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useDeleteReptileFeedingMutation = (reptileId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteReptileFeeding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE_FEEDINGS, reptileId],
      });
    },
  });
};

export default useDeleteReptileFeedingMutation;
