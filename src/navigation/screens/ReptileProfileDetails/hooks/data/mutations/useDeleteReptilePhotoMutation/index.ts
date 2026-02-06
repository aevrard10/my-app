import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { deleteReptilePhoto } from "@shared/local/reptilePhotosStore";

const useDeleteReptilePhotoMutation = (reptileId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; fed_at?: string }) =>
      deleteReptilePhoto(variables.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueriesKeys.REPTILE, reptileId, "photos"],
      });
    },
  });
};

export default useDeleteReptilePhotoMutation;
