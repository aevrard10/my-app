import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptile } from "@shared/local/reptileStore";
import QueriesKeys from "@shared/declarations/queriesKeys";

const useRemoveReptileMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteReptile(id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILES] });
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILE, variables.id] });
    },
  });
};

export default useRemoveReptileMutation;
