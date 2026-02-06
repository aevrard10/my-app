import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type GoveeReading = {
  temperature: number | null;
  humidity: number | null;
  battery: number | null;
  retrieved_at: string;
};

type GoveeStateResponse = {
  goveeDeviceState: GoveeReading;
};

const query = gql`
  query GoveeDeviceState($apiKey: String!, $device: String!, $model: String!) {
    goveeDeviceState(apiKey: $apiKey, device: $device, model: $model) {
      temperature
      humidity
      battery
      retrieved_at
    }
  }
`;

const useGoveeDeviceStateQuery = (
  apiKey?: string,
  device?: string,
  model?: string
) => {
  const enabled = Boolean(apiKey && device && model);
  return useQuery<GoveeStateResponse, { apiKey: string; device: string; model: string }, GoveeReading | null>(
    {
      queryKey: [QueriesKeys.GOVEE_STATE, apiKey, device, model],
      query,
      variables: {
        apiKey: apiKey || "",
        device: device || "",
        model: model || "",
      },
      options: {
        enabled,
        select: (data) => data?.goveeDeviceState ?? null,
      },
    }
  );
};

export default useGoveeDeviceStateQuery;
