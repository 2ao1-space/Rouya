import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { PrayerName, PrayerStatus, PrayerLog } from "@/types/prayer";
import { PRAYER_ORDER } from "@/lib/prayer";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function usePrayerDay(dateKey: string) {
  return useQuery({
    queryKey: ["prayerLogs", dateKey],
    queryFn: async (): Promise<Record<PrayerName, PrayerStatus>> => {
      const { data, error } = await supabase
        .from("prayer_logs")
        .select("*")
        .eq("date", dateKey);
      if (error) throw error;

      const result = Object.fromEntries(
        PRAYER_ORDER.map((p) => [p, "pending" as PrayerStatus]),
      ) as Record<PrayerName, PrayerStatus>;

      data.forEach((row) => {
        result[row.prayer as PrayerName] = row.status;
      });
      return result;
    },
  });
}

export function useSetPrayerStatus(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { prayer: PrayerName; status: PrayerStatus }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { error } = await supabase.from("prayer_logs").upsert({
        user_id: userId,
        date: dateKey,
        prayer: input.prayer,
        status: input.status,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayerLogs", dateKey] });
      queryClient.invalidateQueries({ queryKey: ["prayerMonth"] });
    },
  });
}

export function usePrayerMonth(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["prayerMonth", monthStart],
    queryFn: async (): Promise<PrayerLog[]> => {
      const { data, error } = await supabase
        .from("prayer_logs")
        .select("*")
        .gte("date", monthStart)
        .lte("date", monthEnd);
      if (error) throw error;
      return data.map((row) => ({
        date: row.date,
        prayer: row.prayer,
        status: row.status,
      }));
    },
  });
}

export const nextStatus: Record<PrayerStatus, PrayerStatus> = {
  pending: "prayed",
  prayed: "missed",
  missed: "pending",
};
