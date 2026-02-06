import { useMutation } from "@tanstack/react-query";

type Variables = {
  input: { email: string; password: string; username?: string };
};

type RegisterResult = {
  register: {
    success: boolean;
    message?: string;
    token?: string;
    user?: { id: string; username: string; email: string };
  };
};

const useRegisterMutation = () =>
  useMutation<RegisterResult, Error, Variables>({
    mutationFn: async () => {
      throw new Error(
        "Inscription par email désactivée. Utilise \"Se connecter avec Apple\".",
      );
    },
  });

export default useRegisterMutation;
