import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Account } from "@/types/finance";

async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .is("archived_at", null)
    .order("order", { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    balance: Number(row.balance),
    icon: row.icon,
    order: row.order,
  }));
}

export function useAccounts() {
  return useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
}
