import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { assign } from "lodash";
import QueriesKeys from "@shared/declarations/queriesKeys";
const queryKey = [QueriesKeys.USER_TOKEN];
const queryFn = async () => await AsyncStorage.getItem(QueriesKeys.USER_TOKEN);

const useCurrentTokenQuery = assign(
  () => {
    const { data, isPending } = useQuery({
      queryKey,
      queryFn,
    });

    return [isPending, data] as const;
  },
  { queryKey, queryFn }
);

export default useCurrentTokenQuery;
