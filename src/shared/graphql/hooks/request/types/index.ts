import { QueryClient } from "@tanstack/react-query";

export type GraphQLError = {
  message: string;
  details: string;
  code: number;
  identifier: string | { identifier: string };
  source?: string;
};

export type Result<TData> =
  | { data: TData; errors?: undefined }
  | { data?: TData | null; errors: GraphQLError[] };

export type ErrorPolicy = "all" | "none" | "ignore";

export type RequestVariables = Record<string, unknown> | void;

export type RequestHeaders =
  | Record<string, string | undefined | null>
  | undefined;

export type Options<TVariables extends RequestVariables> = {
  query: string;
  variables?: TVariables;
  requestHeaders?: RequestHeaders;
  errorPolicy?: ErrorPolicy;
  queryClient?: QueryClient;
};

export type Request = {
  <TData, TVariables extends RequestVariables = void>(
    options: Options<TVariables> & {
      errorPolicy?: Extract<ErrorPolicy, "none">;
    }
  ): Promise<TData>;
  <TData, TVariables extends RequestVariables = void>(
    options: Options<TVariables> & { errorPolicy: Extract<ErrorPolicy, "all"> }
  ): Promise<Result<TData>>;
  <TData, TVariables extends RequestVariables = void>(
    options: Options<TVariables> & {
      errorPolicy: Extract<ErrorPolicy, "ignore">;
    }
  ): Promise<Result<TData>["data"]>;
  <TData, TVariables extends RequestVariables = void>(
    query: string,
    variables: TVariables,
    requestHeaders: RequestHeaders,
    errorPolicy: Extract<ErrorPolicy, "all">,
    queryClient?: QueryClient
  ): Promise<Result<TData>>;
  <TData, TVariables extends RequestVariables = void>(
    query: string,
    variables: TVariables,
    requestHeaders: RequestHeaders,
    errorPolicy: Extract<ErrorPolicy, "ignore">,
    queryClient?: QueryClient
  ): Promise<Result<TData>["data"]>;
  <TData, TVariables extends RequestVariables = void>(
    query: string,
    variables?: TVariables,
    requestHeaders?: RequestHeaders,
    errorPolicy?: Extract<ErrorPolicy, "none">,
    queryClient?: QueryClient
  ): Promise<TData>;
};

export type Variables = Record<string, unknown>;
