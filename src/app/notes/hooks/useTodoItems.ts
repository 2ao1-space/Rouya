import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { TodoItem } from "../types/notes";

export function useTodoItems(noteId: string) {
  return useQuery({
    queryKey: ["todoItems", noteId],
    enabled: Boolean(noteId),
    queryFn: async (): Promise<TodoItem[]> => {
      const { data, error } = await supabase
        .from("note_todo_items")
        .select("*")
        .eq("note_id", noteId)
        .order("order", { ascending: true });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        text: row.text,
        done: row.done,
        order: row.order,
      }));
    },
  });
}

export function useAddTodoItem(noteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const userId = await getCurrentUserId();
      const { data: existing } = await supabase
        .from("note_todo_items")
        .select("order")
        .eq("note_id", noteId)
        .order("order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.order ?? -1) + 1;

      const { error } = await supabase.from("note_todo_items").insert({
        note_id: noteId,
        user_id: userId,
        text,
        order: nextOrder,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todoItems", noteId] }),
  });
}

export function useToggleTodoItem(noteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { itemId: string; done: boolean }) => {
      const { error } = await supabase
        .from("note_todo_items")
        .update({ done: input.done })
        .eq("id", input.itemId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todoItems", noteId] }),
  });
}

export function useDeleteTodoItem(noteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("note_todo_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todoItems", noteId] }),
  });
}

export function useReorderTodoItems(noteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from("note_todo_items")
            .update({ order: index })
            .eq("id", id),
        ),
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todoItems", noteId] }),
  });
}
