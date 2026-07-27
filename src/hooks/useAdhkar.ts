import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { AdhkarCategory, AdhkarItem } from "@/types/adhkar";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useAdhkarItems(category: AdhkarCategory) {
  return useQuery({
    queryKey: ["adhkarItems", category],
    queryFn: async (): Promise<AdhkarItem[]> => {
      const { data, error } = await supabase
        .from("adhkar_items")
        .select("*")
        .eq("category", category)
        .order("order", { ascending: true });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        category: row.category,
        text: row.text,
        targetCount: row.target_count,
        order: row.order,
      }));
    },
  });
}

export function useAdhkarProgress(dateKey: string, itemIds: string[]) {
  return useQuery({
    queryKey: ["adhkarProgress", dateKey, itemIds],
    enabled: itemIds.length > 0,
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase
        .from("adhkar_logs")
        .select("*")
        .eq("date", dateKey)
        .in("adhkar_item_id", itemIds);
      if (error) throw error;
      const result: Record<string, number> = {};
      data.forEach((row) => {
        result[row.adhkar_item_id] = row.remaining_count;
      });
      return result;
    },
  });
}

export function useTapAdhkar(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.rpc("tap_adhkar", {
        p_item_id: itemId,
        p_date: dateKey,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adhkarProgress", dateKey] }),
  });
}

export function useAddAdhkarItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      category: AdhkarCategory;
      text: string;
      targetCount: number;
    }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { data: existing } = await supabase
        .from("adhkar_items")
        .select("order")
        .eq("category", input.category)
        .order("order", { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.order ?? -1) + 1;

      const { error } = await supabase.from("adhkar_items").insert({
        user_id: userId,
        category: input.category,
        text: input.text,
        target_count: input.targetCount,
        order: nextOrder,
      });
      if (error) throw error;
    },
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["adhkarItems", variables.category],
      }),
  });
}

export function useEditAdhkarItem(category: AdhkarCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      itemId: string;
      text: string;
      targetCount: number;
    }) => {
      const { error } = await supabase
        .from("adhkar_items")
        .update({ text: input.text, target_count: input.targetCount })
        .eq("id", input.itemId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adhkarItems", category] }),
  });
}

export function useDeleteAdhkarItem(category: AdhkarCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("adhkar_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adhkarItems", category] }),
  });
}

const DEFAULT_ADHKAR: {
  category: AdhkarCategory;
  text: string;
  targetCount: number;
}[] = [
  {
    category: "morning",
    text: "أصبحنا وأصبح الملك لله، والحمد لله",
    targetCount: 1,
  },
  { category: "morning", text: "سبحان الله وبحمده", targetCount: 100 },
  { category: "morning", text: "أستغفر الله وأتوب إليه", targetCount: 100 },
  {
    category: "morning",
    text: "لا إله إلا الله وحده لا شريك له",
    targetCount: 10,
  },
  {
    category: "evening",
    text: "أمسينا وأمسى الملك لله، والحمد لله",
    targetCount: 1,
  },
  { category: "evening", text: "سبحان الله وبحمده", targetCount: 100 },
  { category: "evening", text: "أستغفر الله وأتوب إليه", targetCount: 100 },
  {
    category: "evening",
    text: "لا إله إلا الله وحده لا شريك له",
    targetCount: 10,
  },
];

export function useSeedDefaultAdhkar() {
  return useMutation({
    mutationFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { count } = await supabase
        .from("adhkar_items")
        .select("*", { count: "exact", head: true });

      if (count && count > 0) return;

      const rows = DEFAULT_ADHKAR.map((item, index) => ({
        user_id: userId,
        category: item.category,
        text: item.text,
        target_count: item.targetCount,
        order: index,
      }));
      const { error } = await supabase.from("adhkar_items").insert(rows);
      if (error) throw error;
    },
  });
}
