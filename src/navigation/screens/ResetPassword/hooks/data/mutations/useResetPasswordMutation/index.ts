import { useMutation } from "@tanstack/react-query";

type Variables = { token: string; password: string };
type Result = { resetPassword: { success: boolean; message?: string } };

const useResetPasswordMutation = () =>
  useMutation<Result, Error, Variables>({
    mutationFn: async () => {
      throw new Error(
        "Réinitialisation par email désactivée. Connexion via Apple uniquement.",
      );
    },
  });

export default useResetPasswordMutation;
