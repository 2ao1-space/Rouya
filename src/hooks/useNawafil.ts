import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { PrayerName } from "@/types/prayer";
import { PRAYER_ORDER } from "@/lib/prayer";
import { getCurrentUserId } from "@/lib/supabase/auth";

type Phase = "before" | "after";

export function useNawafilDay(dateKey: string) {
  return useQuery({
    queryKey: ["nawafilLogs", dateKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nawafil_logs")
        .select("*")
        .eq("date", dateKey);
      if (error) throw error;

      const before = Object.fromEntries(
        PRAYER_ORDER.map((p) => [p, 0]),
      ) as Record<PrayerName, number>;
      const after = Object.fromEntries(
        PRAYER_ORDER.map((p) => [p, 0]),
      ) as Record<PrayerName, number>;

      data.forEach((row) => {
        if (row.phase === "before")
          before[row.prayer as PrayerName] = row.rakats_prayed;
        else after[row.prayer as PrayerName] = row.rakats_prayed;
      });

      return { before, after };
    },
  });
}

export function useSetNawafil(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      prayer: PrayerName;
      phase: Phase;
      rakatsPrayed: number;
    }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { error } = await supabase.from("nawafil_logs").upsert({
        user_id: userId,
        date: dateKey,
        prayer: input.prayer,
        phase: input.phase,
        rakats_prayed: input.rakatsPrayed,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nawafilLogs", dateKey] });
      queryClient.invalidateQueries({ queryKey: ["prayerMonthDetailed"] });
    },
  });
}
