import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";

export interface QiyamData {
  rakats: number;
  shafa: boolean;
  witr: boolean;
}

export function useQiyamDay(dateKey: string) {
  return useQuery({
    queryKey: ["qiyamLog", dateKey],
    queryFn: async (): Promise<QiyamData> => {
      const { data, error } = await supabase
        .from("qiyam_logs")
        .select("*")
        .eq("date", dateKey)
        .maybeSingle();
      if (error) throw error;
      return {
        rakats: data?.rakats ?? 0,
        shafa: data?.shafa ?? false,
        witr: data?.witr ?? false,
      };
    },
  });
}

export function useSetQiyam(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: QiyamData) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { error } = await supabase.from("qiyam_logs").upsert({
        user_id: userId,
        date: dateKey,
        rakats: input.rakats,
        shafa: input.shafa,
        witr: input.witr,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qiyamLog", dateKey] });
      queryClient.invalidateQueries({ queryKey: ["prayerMonthDetailed"] });
    },
  });
}
