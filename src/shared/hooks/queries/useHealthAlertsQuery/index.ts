import { useQuery } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import { getReptiles } from "@shared/local/reptileStore";
import { getReptileFeedings } from "@shared/local/reptileFeedingsStore";
import { getReptileSheds } from "@shared/local/reptileShedsStore";
import { getMeasurements } from "@shared/local/measurementsStore";
import dayjs from "dayjs";

export type HealthAlert = {
  reptile_id: string;
  name: string;
  weight_delta_pct?: number | null;
  days_since_feed?: number | null;
  days_since_shed?: number | null;
  alerts: string[];
};

const DAYS_FEED_ALERT = 14;
const DAYS_SHED_ALERT = 90;
const WEIGHT_DROP_ALERT = 10; // en %

const useHealthAlertsQuery = () =>
  useQuery<HealthAlert[]>({
    queryKey: [QueriesKeys.HEALTH_ALERTS],
    queryFn: async () => {
      const reptiles = await getReptiles();
      const results: HealthAlert[] = [];

      for (const reptile of reptiles) {
        const feedings = await getReptileFeedings(reptile.id, {
          limit: 30,
          offset: 0,
        });
        const sheds = await getReptileSheds(reptile.id, { limit: 10, offset: 0 });
        const measurements = await getMeasurements(reptile.id, {
          limit: 12,
          offset: 0,
        });

        const alerts: string[] = [];

        // Alimentation
        const lastFeeding = feedings[0]?.fed_at;
        const daysSinceFeed = lastFeeding
          ? dayjs().diff(dayjs(lastFeeding), "day")
          : null;
        if (daysSinceFeed !== null && daysSinceFeed > DAYS_FEED_ALERT) {
          alerts.push(`Aucun repas depuis ${daysSinceFeed} jours`);
        }

        // Mue
        const lastShed = sheds[0]?.shed_date;
        const daysSinceShed = lastShed ? dayjs().diff(dayjs(lastShed), "day") : null;
        if (daysSinceShed !== null && daysSinceShed > DAYS_SHED_ALERT) {
          alerts.push(`Aucune mue depuis ${daysSinceShed} jours`);
        }

        // Poids
        let weight_delta_pct: number | null = null;
        if (measurements.length >= 2) {
          const latest = measurements[0].weight ?? null;
          const previous = measurements[measurements.length - 1].weight ?? null;
          if (latest !== null && previous !== null && previous > 0) {
            weight_delta_pct = Math.round(((latest - previous) / previous) * 100);
            if (weight_delta_pct < -WEIGHT_DROP_ALERT) {
              alerts.push(`Perte de poids ${weight_delta_pct}% depuis la première mesure`);
            }
          }
        }

        results.push({
          reptile_id: reptile.id,
          name: reptile.name,
          weight_delta_pct,
          days_since_feed: daysSinceFeed,
          days_since_shed: daysSinceShed,
          alerts,
        });
      }

      return results;
    },
    staleTime: 1000 * 60 * 5,
  });

export default useHealthAlertsQuery;
