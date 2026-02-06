import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptileShed } from "@shared/local/reptileShedsStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useDeleteReptileShedMutation = (reptileId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, shed_date }: { id: string; shed_date: string }) =>
      deleteReptileShed(id, shed_date, reptileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE_SHEDS, reptileId],
      });
    },
  });
};

export default useDeleteReptileShedMutation;
