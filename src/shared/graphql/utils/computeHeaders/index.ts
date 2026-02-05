import { RequestHeaders } from "@shared/graphql/hooks/request/types";
import { assign, clone, isNil, omitBy } from "lodash";

const defaultHeaders = { "Content-Type": "application/json" };

function computeHeaders(requestHeaders?: RequestHeaders): HeadersInit {
  const headers = assign(clone(defaultHeaders), requestHeaders) as Record<
    string,
    string | undefined | null
  >;

  if (headers.token && !headers.authorization) {
    headers.authorization = `Bearer ${headers.token}`;
  }

  return omitBy(headers, isNil) as HeadersInit;
}

export { defaultHeaders };

export default computeHeaders;
