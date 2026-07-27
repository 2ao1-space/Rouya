import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { Note, NoteType } from "../types/notes";
import {
  uploadNoteImage,
  deleteNoteImage,
  getNoteImageUrl,
} from "@/lib/supabase/notesStorage";

export function useNotes(categoryId: string | null) {
  return useQuery({
    queryKey: ["notes", categoryId],
    queryFn: async (): Promise<Note[]> => {
      let query = supabase
        .from("notes")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (categoryId) query = query.eq("category_id", categoryId);

      const { data, error } = await query;
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        type: row.type,
        categoryId: row.category_id,
        textContent: row.text_content,
        imagePath: row.image_path,
        pinned: row.pinned,
        createdAt: row.created_at,
      }));
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      type: NoteType;
      categoryId: string | null;
      textContent: string | null;
      imageFile?: File | Blob;
      imageFileName?: string;
      todoItems?: string[];
    }) => {
      const userId = await getCurrentUserId();

      let imagePath: string | null = null;
      if (input.imageFile) {
        imagePath = await uploadNoteImage(
          input.imageFile,
          userId,
          input.imageFileName,
        );
      }

      const { data: note, error } = await supabase
        .from("notes")
        .insert({
          user_id: userId,
          type: input.type,
          category_id: input.categoryId,
          text_content: input.textContent,
          image_path: imagePath,
        })
        .select()
        .single();
      if (error) throw error;

      if (input.todoItems && input.todoItems.length > 0) {
        const rows = input.todoItems.map((text, index) => ({
          note_id: note.id,
          user_id: userId,
          text,
          order: index,
        }));
        const { error: todoError } = await supabase
          .from("note_todo_items")
          .insert(rows);
        if (todoError) throw todoError;
      }

      return note.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["todoItems"] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      textContent: string | null;
      categoryId: string | null;
    }) => {
      const { error } = await supabase
        .from("notes")
        .update({
          text_content: input.textContent,
          category_id: input.categoryId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useTogglePinNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; pinned: boolean }) => {
      const { error } = await supabase
        .from("notes")
        .update({ pinned: input.pinned })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: Note) => {
      if (note.imagePath) await deleteNoteImage(note.imagePath);
      const { error } = await supabase.from("notes").delete().eq("id", note.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export async function fetchNoteImageUrl(path: string) {
  return getNoteImageUrl(path);
}
