import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Transaction } from "@/types/finance";

export function useDayTransactions(dateKey: string) {
  return useQuery({
    queryKey: ["dayTransactions", dateKey],
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", `${dateKey}T00:00:00`)
        .lte("date", `${dateKey}T23:59:59`)
        .order("date", { ascending: false });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        type: row.type,
        amount: Number(row.amount),
        accountId: row.account_id,
        toAccountId: row.to_account_id ?? undefined,
        reason: row.reason,
        notes: row.notes ?? undefined,
        date: row.date,
        createdAt: row.created_at,
      }));
    },
  });
}
