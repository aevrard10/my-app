import { useMutation } from "@tanstack/react-query";

type Variables = {
  input: { email: string; password: string };
};

type LoginResult = {
  login: {
    success: boolean;
    message?: string;
    token?: string;
    user?: { id: string; username: string; email: string };
  };
};

const useLoginMutation = () =>
  useMutation<LoginResult, Error, Variables>({
    mutationFn: async (vars) => {
      throw new Error("Connexion email désactivée. Utilise \"Se connecter avec Apple\".");
    },
  });

export default useLoginMutation;
