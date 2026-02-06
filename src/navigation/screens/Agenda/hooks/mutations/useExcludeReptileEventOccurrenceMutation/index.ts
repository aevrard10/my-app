import useMutation from "@shared/graphql/useMutation";
import { gql } from "graphql-request";

type ExcludeReptileEventOccurrenceMutation = {
  excludeReptileEventOccurrence: {
    success: boolean;
    message: string;
  };
};

type ExcludeReptileEventOccurrenceVariables = {
  id: string;
  date: string;
};

const mutation = gql`
  mutation ExcludeReptileEventOccurrenceMutation($id: ID!, $date: String!) {
    excludeReptileEventOccurrence(id: $id, date: $date) {
      success
      message
    }
  }
`;

const useExcludeReptileEventOccurrenceMutation = () => {
  return useMutation<
    ExcludeReptileEventOccurrenceMutation,
    ExcludeReptileEventOccurrenceVariables
  >({
    mutation,
  });
};

export default useExcludeReptileEventOccurrenceMutation;
