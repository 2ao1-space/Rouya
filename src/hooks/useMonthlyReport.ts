import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Mood } from "@/types/habits";
import { toDateKey, getHabitBadge } from "@/lib/habits";

export interface HabitReportRow {
  habitId: string;
  name: string;
  doneDays: number;
  totalDays: number;
  badge: { emoji: string; label: string } | null;
}

export interface DayTaskSummary {
  date: string;
  total: number;
  done: number;
}

export interface MonthlyReport {
  monthLabel: string;
  habits: HabitReportRow[];
  moodCounts: Record<Mood, number>;
  dominantMood: Mood | null;
  taskDays: DayTaskSummary[];
  totalTasksDone: number;
  totalTasksCreated: number;
}

export function useMonthlyReport() {
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthStart = toDateKey(new Date(year, month, 1));
  const monthEnd = toDateKey(new Date(year, month, totalDays));

  return useQuery({
    queryKey: ["monthlyReport", monthStart],
    queryFn: async (): Promise<MonthlyReport> => {
      const [habitsRes, habitLogsRes, moodLogsRes, tasksRes] =
        await Promise.all([
          supabase.from("habits").select("*").is("archived_at", null),
          supabase
            .from("habit_logs")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
          supabase
            .from("mood_logs")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
          supabase
            .from("daily_tasks")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
        ]);
      if (habitsRes.error) throw habitsRes.error;
      if (habitLogsRes.error) throw habitLogsRes.error;
      if (moodLogsRes.error) throw moodLogsRes.error;
      if (tasksRes.error) throw tasksRes.error;

      const habits: HabitReportRow[] = habitsRes.data.map((habit) => {
        const doneDays = habitLogsRes.data.filter(
          (l) => l.habit_id === habit.id && l.done,
        ).length;
        return {
          habitId: habit.id,
          name: habit.name,
          doneDays,
          totalDays,
          badge: getHabitBadge(doneDays, totalDays),
        };
      });

      const moodCounts: Record<Mood, number> = {
        great: 0,
        good: 0,
        okay: 0,
        tired: 0,
        bad: 0,
      };
      moodLogsRes.data.forEach((row) => {
        moodCounts[row.mood as Mood] += 1;
      });
      const dominantMood =
        (Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0) >
        0
          ? (Object.entries(moodCounts).sort(
              (a, b) => b[1] - a[1],
            )[0][0] as Mood)
          : null;

      const taskDaysMap: Record<string, DayTaskSummary> = {};
      tasksRes.data.forEach((task) => {
        if (!taskDaysMap[task.date])
          taskDaysMap[task.date] = { date: task.date, total: 0, done: 0 };
        taskDaysMap[task.date].total += 1;
        if (task.done) taskDaysMap[task.date].done += 1;
      });
      const taskDays = Object.values(taskDaysMap).sort((a, b) =>
        a.date < b.date ? 1 : -1,
      );

      return {
        monthLabel: lastMonthDate.toLocaleDateString("ar-EG", {
          month: "long",
          year: "numeric",
        }),
        habits,
        moodCounts,
        dominantMood,
        taskDays,
        totalTasksDone: tasksRes.data.filter((t) => t.done).length,
        totalTasksCreated: tasksRes.data.length,
      };
    },
  });
}
