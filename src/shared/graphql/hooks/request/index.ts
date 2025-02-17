import queryClient from "@shared/graphql/utils/queryClient";
import {
  ErrorPolicy,
  Options,
  Request,
  RequestHeaders,
  Result,
  RequestVariables,
} from "./types";
import useCurrentTokenQuery from "@shared/hooks/queries/useCurrentTokenQuery";
import computeHeaders from "@shared/graphql/utils/computeHeaders";
import { assign } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QueriesKeys from "@shared/declarations/queriesKeys";
function parseRequestExtendedArgs<TVariables extends RequestVariables>(
  queryOrOptions: string | Options<TVariables>,
  variables?: TVariables,
  requestHeaders?: RequestHeaders,
  errorPolicy?: ErrorPolicy
): Options<TVariables> {
  if (typeof queryOrOptions !== "string") return queryOrOptions;
  return {
    query: queryOrOptions,
    variables,
    requestHeaders,
    errorPolicy,
  };
}
async function getToken(): Promise<string | null> {
  try {
    const data = await queryClient.ensureQueryData({
      queryKey: useCurrentTokenQuery.queryKey,
      queryFn: async () => {
        return await AsyncStorage.getItem(QueriesKeys.USER_TOKEN);
      }, 
    });
    return data as string;
  } catch (e) {
    return null;
  }
}
function getEndpoint() {
  if (!process.env.EXPO_PUBLIC_API_URL)
    throw new Error("Request is missing API endpoint");
  console.log(`Requesting to ${process.env.EXPO_PUBLIC_API_URL}`);
  return `${process.env.EXPO_PUBLIC_API_URL}`;
}
const request: Request = async <
  TData,
  TVariables extends RequestVariables = void
>(
  _queryOrOptions: string | Options<TVariables>,
  _variables?: TVariables,
  _requestHeaders?: RequestHeaders,
  _errorPolicy: ErrorPolicy = "none"
): Promise<TData | Result<TData>["data"] | Result<TData>> => {
  const options = parseRequestExtendedArgs<TVariables>(
    _queryOrOptions,
    _variables,
    _requestHeaders,
    _errorPolicy
  );
  const { query, variables, errorPolicy, requestHeaders } = options;

  async function _fetch() {
    const body = JSON.stringify({ query, variables });

    const response = await fetch(getEndpoint(), {
      method: "POST",
      body,
      headers: computeHeaders(
        requestHeaders?.token !== undefined
          ? requestHeaders
          : assign({ token: await getToken() }, requestHeaders)
      ),
    });
    const result = await response.json();

    return result;
  }

  function handledResult(result) {
    switch (errorPolicy) {
      case "all":
        return result;
      case "ignore":
        return result.data;
      case undefined: // default to 'none'
      case "none":
        const { data, errors } = result;
        if (errors) {
          throw errors;
        }
        return data;
      default:
        throw new Error(`Unknown ErrorPolicy: ${errorPolicy}`);
    }
  }

  const result = await _fetch();

  return handledResult(result);
};

export default request;
