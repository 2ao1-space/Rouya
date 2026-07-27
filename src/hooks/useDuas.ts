import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Dua, DuaCategory } from "@/types/adhkar";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useDuaCategories() {
  return useQuery({
    queryKey: ["duaCategories"],
    queryFn: async (): Promise<DuaCategory[]> => {
      const { data, error } = await supabase.from("dua_categories").select("*");
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
      }));
    },
  });
}

export function useAddDuaCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; color: string }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");
      const { error } = await supabase.from("dua_categories").insert({
        user_id: userId,
        name: input.name,
        color: input.color,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["duaCategories"] }),
  });
}

// 🔧 الترتيب: المثبّتة فوق دايمًا، بعدين الأقدم فالأحدث (يعني الجديد ينزل تحت)
export function useDuas(categoryId: string | null) {
  return useQuery({
    queryKey: ["duas", categoryId],
    queryFn: async (): Promise<Dua[]> => {
      let query = supabase
        .from("duas")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: true });

      if (categoryId) query = query.eq("category_id", categoryId);

      const { data, error } = await query;
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        text: row.text,
        categoryId: row.category_id,
        pinned: row.pinned,
      }));
    },
  });
}

export function useAddDua() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { text: string; categoryId: string | null }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { error } = await supabase.from("duas").insert({
        user_id: userId,
        text: input.text,
        category_id: input.categoryId,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["duas"] }),
  });
}

export function useEditDua() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      text: string;
      categoryId: string | null;
    }) => {
      const { error } = await supabase
        .from("duas")
        .update({ text: input.text, category_id: input.categoryId })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["duas"] }),
  });
}

export function useTogglePinDua() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; pinned: boolean }) => {
      const { error } = await supabase
        .from("duas")
        .update({ pinned: input.pinned })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["duas"] }),
  });
}

export function useDeleteDua() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("duas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["duas"] }),
  });
}
