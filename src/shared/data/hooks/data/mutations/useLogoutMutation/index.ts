import { useMutation } from "@tanstack/react-query";

const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => ({ success: true }),
  });

export default useLogoutMutation;
