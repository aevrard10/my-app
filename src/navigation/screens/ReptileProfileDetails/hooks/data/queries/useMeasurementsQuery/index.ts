import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getMeasurements, LocalMeasurement } from "@shared/local/measurementsStore";

const baseKey = [QueriesKeys.MESUAREMENTS];

const useMeasurementsQuery = Object.assign(
  (id: string, limit = 200) =>
    useQuery<LocalMeasurement[]>({
      queryKey: [...baseKey, id, limit],
      queryFn: () => getMeasurements(id, { limit }),
    }),
  { queryKey: baseKey }
);

export default useMeasurementsQuery;
