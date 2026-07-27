import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { PRAYER_ORDER, TOTAL_NAWAFIL_RAKATS } from "@/lib/prayer";

export type DayTier = "complete" | "fardOnly" | "partial" | "missed" | "empty";

export function usePrayerMonthDetailed(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["prayerMonthDetailed", monthStart],
    queryFn: async (): Promise<Record<string, DayTier>> => {
      const [prayerRes, nawafilRes, qiyamRes] = await Promise.all([
        supabase
          .from("prayer_logs")
          .select("*")
          .gte("date", monthStart)
          .lte("date", monthEnd),
        supabase
          .from("nawafil_logs")
          .select("*")
          .gte("date", monthStart)
          .lte("date", monthEnd),
        supabase
          .from("qiyam_logs")
          .select("*")
          .gte("date", monthStart)
          .lte("date", monthEnd),
      ]);
      if (prayerRes.error) throw prayerRes.error;
      if (nawafilRes.error) throw nawafilRes.error;
      if (qiyamRes.error) throw qiyamRes.error;

      const result: Record<string, DayTier> = {};
      const dates = new Set([
        ...prayerRes.data.map((r) => r.date),
        ...nawafilRes.data.map((r) => r.date),
        ...qiyamRes.data.map((r) => r.date),
      ]);

      dates.forEach((date) => {
        const dayPrayers = prayerRes.data.filter((r) => r.date === date);
        const dayNawafil = nawafilRes.data.filter((r) => r.date === date);
        const dayQiyam = qiyamRes.data.find((r) => r.date === date);

        const hasMissed = dayPrayers.some((r) => r.status === "missed");
        const prayedCount = dayPrayers.filter(
          (r) => r.status === "prayed",
        ).length;
        const nawafilTotal = dayNawafil.reduce(
          (sum, r) => sum + r.rakats_prayed,
          0,
        );
        const qiyamDone = Boolean(
          dayQiyam && (dayQiyam.rakats > 0 || dayQiyam.shafa || dayQiyam.witr),
        );

        if (hasMissed) {
          result[date] = "missed";
        } else if (
          prayedCount === PRAYER_ORDER.length &&
          nawafilTotal === TOTAL_NAWAFIL_RAKATS &&
          qiyamDone
        ) {
          result[date] = "complete";
        } else if (prayedCount === PRAYER_ORDER.length) {
          result[date] = "fardOnly";
        } else if (prayedCount > 0) {
          result[date] = "partial";
        } else {
          result[date] = "empty";
        }
      });

      return result;
    },
  });
}
