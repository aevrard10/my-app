import { gql } from "graphql-request";
import useQuery from "@shared/graphql/hooks/useQuery";
import QueriesKeys from "@shared/declarations/queriesKeys";

type DashboardSummary = {
  reptiles_count: number;
  events_today: number;
  unread_notifications: number;
  upcoming_events: {
    id: string;
    event_date: string;
    event_name: string;
    event_time: string;
    notes?: string;
  }[];
};

type DashboardSummaryQuery = {
  dashboardSummary: DashboardSummary;
};

const query = gql`
  query DashboardSummaryQuery {
    dashboardSummary {
      reptiles_count
      events_today
      unread_notifications
      upcoming_events {
        id
        event_date
        event_name
        event_time
        notes
      }
    }
  }
`;

const queryKey = [QueriesKeys.DASHBOARD_SUMMARY];

const useDashboardSummaryQuery = Object.assign(
  () => {
    return useQuery<DashboardSummaryQuery, void, DashboardSummary>({
      queryKey,
      query,
      options: {
        select: (data) => data.dashboardSummary,
        staleTime: 1000 * 60 * 2,
      },
    });
  },
  { query, queryKey }
);

export default useDashboardSummaryQuery;
