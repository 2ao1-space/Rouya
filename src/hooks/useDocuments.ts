import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { DocumentRecord } from "@/types/documents";
import {
  uploadDocumentFile,
  deleteDocumentFile,
} from "@/lib/supabase/documentsStorage";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<DocumentRecord[]> => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        filePath: row.file_path,
        fileType: row.file_type,
        createdAt: row.created_at,
      }));
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { file: File; name: string }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const filePath = await uploadDocumentFile(input.file, userId);

      const { error } = await supabase.from("documents").insert({
        user_id: userId,
        name: input.name,
        file_path: filePath,
        file_type: input.file.type || "application/octet-stream",
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: DocumentRecord) => {
      await deleteDocumentFile(doc.filePath);
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}
