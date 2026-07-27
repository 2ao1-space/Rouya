import { supabase } from "@/lib/supabase/client";

export async function uploadZakatProof(
  file: File,
  userId: string,
): Promise<string> {
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("zakat-proofs")
    .upload(path, file);
  if (error) throw error;

  const { data } = await supabase.storage
    .from("zakat-proofs")
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  return data?.signedUrl ?? path;
}
