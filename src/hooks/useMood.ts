import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Mood } from "@/types/habits";

export function useMoodMonthLogs(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["moodLogs", monthStart],
    queryFn: async (): Promise<Record<string, Mood>> => {
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .gte("date", monthStart)
        .lte("date", monthEnd);
      if (error) throw error;
      const result: Record<string, Mood> = {};
      data.forEach((row) => {
        result[row.date] = row.mood;
      });
      return result;
    },
  });
}

export function useSetMoodToday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mood: Mood) => {
      const { error } = await supabase.rpc("set_mood_log", { p_mood: mood });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["moodLogs"] }),
  });
}
