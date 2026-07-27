import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Habit } from "@/types/habits";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async (): Promise<Habit[]> => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .is("archived_at", null)
        .order("order", { ascending: true });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        order: row.order,
      }));
    },
  });
}

export function useAddHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { data: existing } = await supabase
        .from("habits")
        .select("order")
        .order("order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.order ?? -1) + 1;

      const { error } = await supabase
        .from("habits")
        .insert({ user_id: userId, name, order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useEditHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { habitId: string; name: string }) => {
      const { error } = await supabase
        .from("habits")
        .update({ name: input.name })
        .eq("id", input.habitId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from("habits")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useHabitMonthLogs(monthStart: string, monthEnd: string) {
  return useQuery({
    queryKey: ["habitLogs", monthStart],
    queryFn: async (): Promise<Record<string, boolean>> => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .gte("date", monthStart)
        .lte("date", monthEnd);
      if (error) throw error;
      const result: Record<string, boolean> = {};
      data.forEach((row) => {
        result[`${row.habit_id}:${row.date}`] = row.done;
      });
      return result;
    },
  });
}

export function useToggleHabitToday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { habitId: string; done: boolean }) => {
      const { error } = await supabase.rpc("set_habit_log", {
        p_habit_id: input.habitId,
        p_done: input.done,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habitLogs"] }),
  });
}
