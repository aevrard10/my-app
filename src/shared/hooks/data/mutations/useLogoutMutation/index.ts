import useMutation from "@shared/graphql/useMutation";
import {
  AddReptilesMutation,
  AddReptilesMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
const mutation = gql`
  mutation LogoutMutation {
    logout {
      success
      message
    }
  }
`;
const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutation,
    options: {
      onSuccess: async () => {
        localStorage.removeItem("token");

        // Supprimer les données du cache React Query
        queryClient.clear();
      },
      onError: (error) => {
        console.error("Erreur de déconnexion :", error);
      },
    },
  });
};

export default useLogoutMutation;
