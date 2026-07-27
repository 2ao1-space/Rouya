import { supabase } from "@/lib/supabase/client";

export async function uploadNoteImage(
  file: File | Blob,
  userId: string,
  fileName = "image.png",
): Promise<string> {
  const path = `${userId}/${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("notes").upload(path, file);
  if (error) throw error;
  return path;
}

export async function getNoteImageUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("notes")
    .createSignedUrl(path, 60 * 60 * 24);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteNoteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from("notes").remove([path]);
  if (error) throw error;
}
