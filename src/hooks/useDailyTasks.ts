import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { DailyTask } from "@/types/habits";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useDailyTasks(dateKey: string) {
  return useQuery({
    queryKey: ["dailyTasks", dateKey],
    queryFn: async (): Promise<DailyTask[]> => {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("date", dateKey)
        .order("order", { ascending: true });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        date: row.date,
        text: row.text,
        done: row.done,
        order: row.order,
      }));
    },
  });
}

export function useAddDailyTask(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { data: existing } = await supabase
        .from("daily_tasks")
        .select("order")
        .eq("date", dateKey)
        .order("order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.order ?? -1) + 1;

      const { error } = await supabase
        .from("daily_tasks")
        .insert({ user_id: userId, date: dateKey, text, order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dailyTasks", dateKey] }),
  });
}

export function useToggleDailyTask(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { taskId: string; done: boolean }) => {
      const { error } = await supabase
        .from("daily_tasks")
        .update({ done: input.done })
        .eq("id", input.taskId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dailyTasks", dateKey] }),
  });
}

export function useDeleteDailyTask(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("daily_tasks")
        .delete()
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dailyTasks", dateKey] }),
  });
}
