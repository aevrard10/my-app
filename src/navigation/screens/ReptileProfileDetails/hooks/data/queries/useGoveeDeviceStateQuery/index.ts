import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type GoveeReading = {
  temperature: number | null;
  humidity: number | null;
  battery: number | null;
  retrieved_at: string;
};

const fetchState = async (
  apiKey: string,
  device: string,
  model: string,
): Promise<GoveeReading | null> => {
  const url = new URL(
    "https://openapi.api.govee.com/router/api/v1/device/state",
  );
  url.searchParams.set("device", device);
  url.searchParams.set("model", model);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "Govee-API-Key": apiKey,
    },
  });

  if (!res.ok) throw new Error(`Govee state ${res.status}`);
  const json = await res.json();
  const prop = json.data?.properties ?? [];

  const tempObj = prop.find((p: any) => p?.temperature?.value !== undefined);
  const humObj = prop.find((p: any) => p?.humidity?.value !== undefined);
  const battObj = prop.find((p: any) => p?.battery?.value !== undefined);

  const temperature = tempObj?.temperature?.value ?? null;
  const humidity = humObj?.humidity?.value ?? null;
  const battery = battObj?.battery?.value ?? null;

  return {
    temperature,
    humidity,
    battery,
    retrieved_at: new Date().toISOString(),
  };
};

const useGoveeDeviceStateQuery = (
  apiKey?: string,
  device?: string,
  model?: string,
) => {
  const enabled = Boolean(apiKey && device && model);
  return useQuery<GoveeReading | null>({
    queryKey: [QueriesKeys.GOVEE_STATE, apiKey, device, model],
    enabled,
    staleTime: 1000 * 60 * 2,
    queryFn: () => fetchState(apiKey || "", device || "", model || ""),
  });
};

export default useGoveeDeviceStateQuery;
