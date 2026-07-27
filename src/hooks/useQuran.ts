import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";

// 🔧 المصحف تقريبًا ٦٠٤ صفحة، كل جزء ٢٠ صفحة
const PAGES_PER_JUZ = 20;

export function pagesToJuzLabel(pages: number): string {
  if (pages === 0) return "لسه ما بدأتش";
  const juz = Math.min(30, Math.ceil(pages / PAGES_PER_JUZ));
  return `≈ جزء ${juz} من ٣٠`;
}

export function useQuranDay(dateKey: string) {
  return useQuery({
    queryKey: ["quranLog", dateKey],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from("quran_logs")
        .select("*")
        .eq("date", dateKey)
        .maybeSingle();
      if (error) throw error;
      return data?.pages_read ?? 0;
    },
  });
}

export function useSetQuranPages(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pages: number) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");
      const { error } = await supabase.from("quran_logs").upsert({
        user_id: userId,
        date: dateKey,
        pages_read: Math.max(0, pages),
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["quranLog", dateKey] }),
  });
}
