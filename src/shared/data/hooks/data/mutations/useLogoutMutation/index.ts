import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { useAuth } from "@shared/contexts/AuthContext";

const useLogoutMutation = () => {
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(QueriesKeys.USER_TOKEN);
      return { success: true } as const;
    },
    onSuccess: () => {
      setToken(null);
    },
  });
};

export default useLogoutMutation;
