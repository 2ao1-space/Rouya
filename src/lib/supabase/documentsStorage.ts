import { supabase } from "@/lib/supabase/client";

export async function uploadDocumentFile(
  file: File,
  userId: string,
): Promise<string> {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("documents").upload(path, file);
  if (error) throw error;
  return path;
}

export async function getDocumentSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteDocumentFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from("documents").remove([path]);
  if (error) throw error;
}
