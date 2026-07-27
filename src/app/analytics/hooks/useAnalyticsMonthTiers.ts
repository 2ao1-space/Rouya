import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { PRAYER_ORDER } from "@/lib/prayer";

export type DayTier = "complete" | "partial" | "missed" | "empty";

export function useAnalyticsMonthTiers(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["analyticsMonthTiers", monthStart],
    queryFn: async (): Promise<Record<string, DayTier>> => {
      const { data, error } = await supabase
        .from("prayer_logs")
        .select("*")
        .gte("date", monthStart)
        .lte("date", monthEnd);
      if (error) throw error;

      const result: Record<string, DayTier> = {};
      const dates = new Set(data.map((r) => r.date));

      dates.forEach((date) => {
        const dayLogs = data.filter((r) => r.date === date);
        const hasMissed = dayLogs.some((r) => r.status === "missed");
        const prayedCount = dayLogs.filter((r) => r.status === "prayed").length;

        if (hasMissed) result[date] = "missed";
        else if (prayedCount === PRAYER_ORDER.length) result[date] = "complete";
        else if (prayedCount > 0) result[date] = "partial";
        else result[date] = "empty";
      });

      return result;
    },
  });
}
