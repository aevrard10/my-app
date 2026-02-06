import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import request from "@shared/graphql/hooks/request";

type ExportFormat = "CSV" | "PDF";

type ExportReptileResponse = {
  exportReptile: {
    filename: string;
    mime: string;
    base64: string;
  };
};

const query = gql`
  query ExportReptile($id: ID!, $format: ExportFormat!) {
    exportReptile(id: $id, format: $format) {
      filename
      mime
      base64
    }
  }
`;

const useExportReptileQuery = (id: string | number | undefined, format: ExportFormat) => {
  return useQuery<ExportReptileResponse>({
    queryKey: ["exportReptile", id, format],
    enabled: !!id,
    queryFn: async () => {
      return await request(query, { id, format });
    },
  });
};

export default useExportReptileQuery;
