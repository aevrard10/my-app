import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type GoveeDevice = {
  device: string;
  model: string;
  deviceName?: string | null;
};

type GoveeDevicesResponse = {
  goveeDevices: GoveeDevice[];
};

const query = gql`
  query GoveeDevices($apiKey: String!) {
    goveeDevices(apiKey: $apiKey) {
      device
      model
      deviceName
    }
  }
`;

const useGoveeDevicesQuery = (apiKey?: string) => {
  return useQuery<GoveeDevicesResponse, { apiKey: string }, GoveeDevice[]>({
    queryKey: [QueriesKeys.GOVEE_DEVICES, apiKey],
    query,
    variables: { apiKey: apiKey || "" },
    options: {
      enabled: Boolean(apiKey),
      select: (data) => data?.goveeDevices ?? [],
    },
  });
};

export default useGoveeDevicesQuery;
