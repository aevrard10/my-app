import {
  useQuery as useTanstackQuery,
  UseQueryResult as UseTanstackQueryResult,
  QueryKey,
  UseQueryOptions as UseTanstackQueryOptions,
  InitialDataFunction,
} from "@tanstack/react-query";
import request from "../request";
import { GraphQLError, Variables } from "../request/types";

export type UseQueryResult<TData> = UseTanstackQueryResult<
  TData,
  GraphQLError[]
>;

export type UseQueryOptions<TQueryFnData, TData = TQueryFnData> = Omit<
  UseTanstackQueryOptions<TQueryFnData, GraphQLError[], TData, QueryKey>,
  "queryKey" | "queryFn" | "initialData"
> & {
  initialData?: TQueryFnData | InitialDataFunction<TQueryFnData>;
};

type UseQueryProps<TQueryFnData, TVariables, TData> = {
  queryKey: QueryKey;
  query: string;
  variables?: TVariables;
  options?: UseQueryOptions<TQueryFnData, TData>;
};

const useQuery = <
  TQueryFnData,
  TVariables extends Variables | void = void,
  TData = TQueryFnData
>(
  props: UseQueryProps<TQueryFnData, TVariables, TData>
) => {
  const { queryKey, options } = props as any;
  return useTanstackQuery<TQueryFnData, GraphQLError[], TData>({
    queryKey,
    queryFn: async () => ({} as TQueryFnData),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export default useQuery;
