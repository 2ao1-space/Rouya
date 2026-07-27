import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { NoteCategory } from "../types/notes";

export function useNoteCategories() {
  return useQuery({
    queryKey: ["noteCategories"],
    queryFn: async (): Promise<NoteCategory[]> => {
      const { data, error } = await supabase
        .from("note_categories")
        .select("*");
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
      }));
    },
  });
}

export function useAddNoteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; color: string }) => {
      const userId = await getCurrentUserId();
      const { error } = await supabase.from("note_categories").insert({
        user_id: userId,
        name: input.name,
        color: input.color,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["noteCategories"] }),
  });
}
