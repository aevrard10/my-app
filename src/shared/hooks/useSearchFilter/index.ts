import { useMemo } from "react";
import { filter, get } from "lodash";
import { normalizeToNFD } from "@shared/utils/texts";

type CustomSearchFilter<T> = (item: T) => string;

const defaultArray = [];

const useSearchFilter = <T>(
  data: T[] = defaultArray,
  currentSearchValue: string,
  searchFilterKeys?: string[],
  customSearchFilters?: CustomSearchFilter<T>[],
  searchFilterMinLength = 0
): [T[], number] => {
  // Do nothing if there's no keys to search on

  const filteredData = useMemo(
    () =>
      filter(data, (item) => {
        // Will store all available texts for user's search for this item
        let availableText = "";

        // region Compute searchFilterKeys
        if (searchFilterKeys?.length) {
          // Add value (string) for each passed key (searchFilterKey in searchFilterKeys)
          searchFilterKeys.forEach((searchFilterKey) => {
            // Value for searchFilterKey in item

            const SEARCH_FILTER_KEY_VALUE: string = get(item, searchFilterKey);
            // Add this value to availableText
            availableText += SEARCH_FILTER_KEY_VALUE;
          });
        }
        // endregion

        // region compute customSearchFilters
        if (customSearchFilters?.length) {
          // Add value (string) for each passed function (customSearchFilter in customSearchFilters)
          customSearchFilters.forEach((customSearchFilter) => {
            // Value = execute customSearchFilter that looks like (item: T) => string
            const CUSTOM_SEARCH_FILTER_VALUE = customSearchFilter(item);
            // Add this value to availableText
            availableText += CUSTOM_SEARCH_FILTER_VALUE;
          });
        }

        // region Normalize all texts (availableText & currentSearchValue)
        const AVAILABLE_TEXT_NORMALIZED = normalizeToNFD(availableText);
        const CURRENT_SEARCH_VALUE_NORMALIZED =
          normalizeToNFD(currentSearchValue);
        // endregion

        // Returns items with at least one value from passed keys (searchFilterKeys) that matches with user's search (currentSearchValue)
        return (
          AVAILABLE_TEXT_NORMALIZED.indexOf(CURRENT_SEARCH_VALUE_NORMALIZED) >
          -1
        );
      }),
    [currentSearchValue, customSearchFilters, data, searchFilterKeys]
  );

  if (
    currentSearchValue?.length < searchFilterMinLength ||
    (!searchFilterKeys?.length && !customSearchFilters?.length)
  ) {
    return [data, data.length];
  }

  return [filteredData, filteredData.length];
};

export { CustomSearchFilter };
export default useSearchFilter;
