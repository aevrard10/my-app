import useMutation from "@shared/graphql/useMutation";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  LogoutMutation,
  LogoutMutationVariables,
} from "@shared/graphql/utils/types/types.generated";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@shared/contexts/AuthContext";
import QueriesKeys from "@shared/declarations/queriesKeys";
import ScreenNames from "@shared/declarations/screenNames";
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
  const { navigate } = useNavigation();
  const { setToken } = useAuth(); // Accéder au setter pour modifier le contexte

  return useMutation<LogoutMutation, LogoutMutationVariables>({
    mutation,
    options: {
      onSuccess: async () => {
        AsyncStorage.removeItem(QueriesKeys.USER_TOKEN);
        // Supprimer les données du cache React Query
        queryClient.clear();
        setToken(null);
        navigate(ScreenNames.LOGIN);
      },
      onError: (error) => {
        console.error("Erreur de déconnexion :", error);
      },
    },
  });
};

export default useLogoutMutation;
