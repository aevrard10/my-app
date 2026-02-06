import { useMutation } from "@tanstack/react-query";

type Variables = { email: string };
type Result = { requestPasswordReset: { success: boolean; message?: string } };

const useRequestPasswordResetMutation = () =>
  useMutation<Result, Error, Variables>({
    mutationFn: async () => {
      throw new Error(
        "Réinitialisation par email désactivée. Connexion via Apple uniquement.",
      );
    },
  });

export default useRequestPasswordResetMutation;
