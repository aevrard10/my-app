import {
  useMutation as useTanstackMutation,
  UseMutationResult as UseTanstackMutationResult,
  UseMutationOptions as UseTanstackMutationOptions,
} from "@tanstack/react-query";
import { GraphQLError, Variables } from "../hooks/request/types";
import request from "../hooks/request";

export type UseMutationResult<
  TData,
  TVariables,
  TContext = unknown
> = UseTanstackMutationResult<TData, GraphQLError[], TVariables, TContext>;

export type UseMutationOptions<TData, TVariables> = Omit<
  UseTanstackMutationOptions<TData, GraphQLError[], TVariables>,
  "mutationFn"
>;

type UseMutationProps<TData, TVariables> = {
  mutation: string;
  options?: UseMutationOptions<TData, TVariables>;
};

const useMutation = <TData, TVariables extends Variables | void = void>(
  props: UseMutationProps<TData, TVariables>
) => {
  const { mutation, options } = props;

  return useTanstackMutation<TData, GraphQLError[], TVariables>({
    mutationFn: async (variables) => {
      return await request<TData, TVariables>(mutation, variables);
    },
    ...options,
  });
};

export default useMutation;
