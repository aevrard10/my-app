import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

export type HealthAlert = {
  reptile_id: string;
  name: string;
  weight_delta_pct?: number | null;
  days_since_feed?: number | null;
  days_since_shed?: number | null;
  alerts: string[];
};

type HealthAlertsResponse = {
  healthAlerts: HealthAlert[];
};

const query = gql`
  query HealthAlerts {
    healthAlerts {
      reptile_id
      name
      weight_delta_pct
      days_since_feed
      days_since_shed
      alerts
    }
  }
`;

const useHealthAlertsQuery = () =>
  useQuery<HealthAlertsResponse, void, HealthAlert[]>({
    queryKey: [QueriesKeys.HEALTH_ALERTS],
    query,
    options: {
      select: (data) => data?.healthAlerts ?? [],
    },
  });

export default useHealthAlertsQuery;
