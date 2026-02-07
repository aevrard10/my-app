import { useMutation } from "@tanstack/react-query";
import { deleteReptileHealthEvent } from "@shared/local/reptileHealthStore";

const useDeleteReptileHealthEventMutation = () =>
  useMutation({
    mutationFn: async (id: string) => deleteReptileHealthEvent(id),
  });

export default useDeleteReptileHealthEventMutation;
