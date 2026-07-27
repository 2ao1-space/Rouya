import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { AccountType } from "@/types/finance";
import { AppModuleId } from "@/types/settings";
import { getCurrentUserId } from "@/lib/supabase/auth";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) return { name: "", birthDate: null, email: null };

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;

      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      return {
        name: data?.name ?? "",
        birthDate: data?.birth_date ?? null,
        email: authData?.user?.email ?? null,
      };
    },
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; birthDate: string | null }) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("مفيش جلسة مستخدم");

      const { error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userId)
        throw new Error(
          "مفيش جلسة مستخدم - تأكد إن Anonymous Sign-In مفعّل من لوحة Supabase",
        );

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        name: input.name,
        birth_date: input.birthDate,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
    onError: (error) => {
      console.error("فشل حفظ البروفايل:", error);
    },
  });
}

export function useAppModules() {
  return useQuery({
    queryKey: ["userModules"],
    queryFn: async (): Promise<AppModuleId[]> => {
      const { data, error } = await supabase
        .from("user_modules")
        .select("module_id")
        .order("order", { ascending: true });
      if (error) throw error;
      return data.map((row) => row.module_id as AppModuleId);
    },
  });
}

export function useSaveAppModules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleIds: AppModuleId[]) => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      await supabase.from("user_modules").delete().eq("user_id", userId);
      if (moduleIds.length === 0) return;

      const rows = moduleIds.map((moduleId, index) => ({
        user_id: userId,
        module_id: moduleId,
        order: index,
      }));
      const { error } = await supabase.from("user_modules").insert(rows);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userModules"] }),
  });
}

export function useAddAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      type: AccountType;
      icon: string;
    }) => {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const { error } = await supabase.from("accounts").insert({
        user_id: userId,
        name: input.name,
        type: input.type,
        icon: input.icon,
        balance: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useEditAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      accountId: string;
      name: string;
      type: AccountType;
      icon: string;
    }) => {
      const { error } = await supabase
        .from("accounts")
        .update({
          name: input.name,
          type: input.type,
          icon: input.icon,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.accountId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase.rpc("delete_account", {
        p_account_id: accountId,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useDeleteAllData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("delete_all_user_data");
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
