import { useMutation } from "@tanstack/react-query";
import {
  addReptileHealthEvent,
  LocalReptileHealthEvent,
} from "@shared/local/reptileHealthStore";

const useAddReptileHealthEventMutation = () =>
  useMutation({
    mutationFn: async (input: Omit<LocalReptileHealthEvent, "id" | "created_at">) =>
      addReptileHealthEvent(input),
  });

export default useAddReptileHealthEventMutation;
