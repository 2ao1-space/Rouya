import { supabase } from "@/lib/supabase/client";

export async function ensureAnonymousSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.session;
}

let cachedUserId: string | null = null;

export async function getCurrentUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("مفيش جلسة مستخدم");
  cachedUserId = user.id;
  return cachedUserId;
}

export function clearCachedUserId() {
  cachedUserId = null;
}
