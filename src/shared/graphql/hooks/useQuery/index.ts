import {
  useQuery as useTanstackQuery,
  UseQueryResult as UseTanstackQueryResult,
  QueryKey,
  UseQueryOptions as UseTanstackQueryOptions,
  InitialDataFunction,
} from "@tanstack/react-query";
import request from "../request";
import { Variables } from "../request/types";
export type GraphQLError = {
  message: string;
  details: string;
  code: number;
  identifier: string | { identifier: string };
  source?: string;
};

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
  const { queryKey, query, variables, options } = props;

  return useTanstackQuery<TQueryFnData, GraphQLError[], TData>({
    queryKey: queryKey,
    queryFn: async () =>
      await request<TQueryFnData, TVariables>({
        query,
        variables,
      }),
    ...options,
  });
};

export default useQuery;
