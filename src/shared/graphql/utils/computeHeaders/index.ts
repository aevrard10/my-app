import { RequestHeaders } from "@shared/graphql/hooks/request/types";
import { assign, clone, isNil, omitBy } from "lodash";

const defaultHeaders = { "Content-Type": "application/json" };

function computeHeaders(requestHeaders?: RequestHeaders): HeadersInit {
  return omitBy(
    assign(clone(defaultHeaders), requestHeaders),
    isNil
  ) as HeadersInit;
}

export { defaultHeaders };

export default computeHeaders;
