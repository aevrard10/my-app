import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type GoveeDevice = {
  device: string;
  model: string;
  deviceName?: string | null;
};

const fetchDevices = async (apiKey: string): Promise<GoveeDevice[]> => {
  const res = await fetch(
    "https://openapi.api.govee.com/router/api/v1/user/devices",
    {
      headers: {
        "Content-Type": "application/json",
        "Govee-API-Key": apiKey,
      },
    },
  );

  if (!res.ok) throw new Error(`Govee devices ${res.status}`);
  const json = await res.json();
  const list = json.data?.devices ?? [];
  return list.map((d: any) => ({
    device: d.device,
    model: d.model,
    deviceName: d.deviceName || d.device_name || d.device, // fallback
  }));
};

const useGoveeDevicesQuery = (apiKey?: string) =>
  useQuery<GoveeDevice[]>({
    queryKey: [QueriesKeys.GOVEE_DEVICES, apiKey],
    enabled: Boolean(apiKey),
    staleTime: 1000 * 60 * 10,
    queryFn: () => fetchDevices(apiKey || ""),
  });

export default useGoveeDevicesQuery;
